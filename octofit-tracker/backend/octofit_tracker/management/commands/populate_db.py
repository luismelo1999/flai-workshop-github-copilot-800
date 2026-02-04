from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # Clear existing data
        self.stdout.write('Deleting existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League Unlimited'
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))

        # Create Users (Superheroes)
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'email': 'ironman@avengers.com', 'name': 'Iron Man', 'password': 'arc_reactor_3000'},
            {'email': 'spiderman@avengers.com', 'name': 'Spider-Man', 'password': 'web_slinger'},
            {'email': 'thor@avengers.com', 'name': 'Thor', 'password': 'mjolnir_worthy'},
            {'email': 'blackwidow@avengers.com', 'name': 'Black Widow', 'password': 'red_room_spy'},
            {'email': 'hulk@avengers.com', 'name': 'Hulk', 'password': 'gamma_smash'},
            {'email': 'captainamerica@avengers.com', 'name': 'Captain America', 'password': 'super_soldier'},
        ]

        dc_heroes = [
            {'email': 'superman@justiceleague.com', 'name': 'Superman', 'password': 'man_of_steel'},
            {'email': 'batman@justiceleague.com', 'name': 'Batman', 'password': 'dark_knight'},
            {'email': 'wonderwoman@justiceleague.com', 'name': 'Wonder Woman', 'password': 'amazonian_warrior'},
            {'email': 'flash@justiceleague.com', 'name': 'Flash', 'password': 'speed_force'},
            {'email': 'aquaman@justiceleague.com', 'name': 'Aquaman', 'password': 'king_of_atlantis'},
            {'email': 'greenlantern@justiceleague.com', 'name': 'Green Lantern', 'password': 'willpower_ring'},
        ]

        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                email=hero['email'],
                name=hero['name'],
                password=hero['password'],
                team_id=str(team_marvel.id)
            )
            marvel_users.append(user)
            self.stdout.write(f'  Created user: {user.name}')

        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                email=hero['email'],
                name=hero['name'],
                password=hero['password'],
                team_id=str(team_dc.id)
            )
            dc_users.append(user)
            self.stdout.write(f'  Created user: {user.name}')

        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))

        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Gym Workout', 'Yoga', 'Boxing']
        activity_count = 0

        for user in all_users:
            # Each user has 5-10 activities
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(30, 120)  # 30 to 120 minutes
                distance = round(random.uniform(2.0, 15.0), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = duration * random.randint(8, 12)  # Rough estimate
                days_ago = random.randint(0, 30)
                activity_date = datetime.now().date() - timedelta(days=days_ago)

                Activity.objects.create(
                    user_id=str(user.id),
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories,
                    date=activity_date
                )
                activity_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {activity_count} activities'))

        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        for user in all_users:
            # Calculate total points based on activities
            user_activities = Activity.objects.filter(user_id=str(user.id))
            total_points = sum(activity.calories for activity in user_activities)
            total_activities = user_activities.count()

            Leaderboard.objects.create(
                user_id=str(user.id),
                team_id=user.team_id,
                total_points=total_points,
                total_activities=total_activities
            )

        # Update ranks
        leaderboard_entries = Leaderboard.objects.all().order_by('-total_points')
        for rank, entry in enumerate(leaderboard_entries, start=1):
            entry.rank = rank
            entry.save()

        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} leaderboard entries'))

        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Avengers Assembly Training',
                'description': 'High-intensity workout inspired by Earth\'s Mightiest Heroes',
                'difficulty': 'hard',
                'duration': 60,
                'exercise_type': 'Full Body'
            },
            {
                'name': 'Spider-Man Agility Drill',
                'description': 'Improve flexibility and agility like your friendly neighborhood Spider-Man',
                'difficulty': 'medium',
                'duration': 45,
                'exercise_type': 'Cardio'
            },
            {
                'name': 'Thor\'s Hammer Strength',
                'description': 'Build god-like strength with this power lifting routine',
                'difficulty': 'hard',
                'duration': 90,
                'exercise_type': 'Strength'
            },
            {
                'name': 'Black Widow Core Blast',
                'description': 'Develop a strong core with this spy-level training',
                'difficulty': 'medium',
                'duration': 30,
                'exercise_type': 'Core'
            },
            {
                'name': 'Captain America Endurance Run',
                'description': 'Build super soldier stamina with this endurance workout',
                'difficulty': 'medium',
                'duration': 60,
                'exercise_type': 'Cardio'
            },
            {
                'name': 'Hulk Smash Strength Training',
                'description': 'Unleash your inner strength with this powerhouse routine',
                'difficulty': 'hard',
                'duration': 75,
                'exercise_type': 'Strength'
            },
            {
                'name': 'Justice League Power Hour',
                'description': 'Complete hero training combining all fitness elements',
                'difficulty': 'hard',
                'duration': 60,
                'exercise_type': 'Full Body'
            },
            {
                'name': 'Flash Speed Sprint',
                'description': 'Develop lightning-fast speed with interval training',
                'difficulty': 'medium',
                'duration': 40,
                'exercise_type': 'Cardio'
            },
            {
                'name': 'Batman Combat Training',
                'description': 'Master martial arts with this combat-focused routine',
                'difficulty': 'hard',
                'duration': 70,
                'exercise_type': 'Martial Arts'
            },
            {
                'name': 'Wonder Woman Warrior Workout',
                'description': 'Train like an Amazonian warrior with this balanced routine',
                'difficulty': 'medium',
                'duration': 50,
                'exercise_type': 'Full Body'
            },
            {
                'name': 'Superman Flight Prep',
                'description': 'Upper body and core workout for superhuman performance',
                'difficulty': 'hard',
                'duration': 55,
                'exercise_type': 'Upper Body'
            },
            {
                'name': 'Aquaman Swimming Circuit',
                'description': 'Build endurance with this water-based workout simulation',
                'difficulty': 'easy',
                'duration': 45,
                'exercise_type': 'Swimming'
            },
        ]

        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)
            self.stdout.write(f'  Created workout: {workout_data["name"]}')

        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))

        # Final summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('=====================================\n'))
