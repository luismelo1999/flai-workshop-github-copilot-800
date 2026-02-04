from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            name='Test User',
            password='password123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.name, 'Test User')
        self.assertIsNotNone(self.user.created_at)


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Team',
            description='A test team'
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team.description, 'A test team')
        self.assertIsNotNone(self.team.created_at)


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='1',
            activity_type='running',
            duration=30,
            distance=5.0,
            calories=300,
            date='2024-01-01'
        )

    def test_activity_creation(self):
        self.assertEqual(self.activity.user_id, '1')
        self.assertEqual(self.activity.activity_type, 'running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)


class UserAPITest(APITestCase):
    def test_create_user(self):
        url = '/api/users/'
        data = {
            'email': 'newuser@example.com',
            'name': 'New User',
            'password': 'password123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'newuser@example.com')

    def test_list_users(self):
        User.objects.create(email='user1@example.com', name='User 1', password='pass1')
        User.objects.create(email='user2@example.com', name='User 2', password='pass2')
        url = '/api/users/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class TeamAPITest(APITestCase):
    def test_create_team(self):
        url = '/api/teams/'
        data = {
            'name': 'New Team',
            'description': 'A new team for testing'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(Team.objects.get().name, 'New Team')


class ActivityAPITest(APITestCase):
    def test_create_activity(self):
        url = '/api/activities/'
        data = {
            'user_id': '1',
            'activity_type': 'cycling',
            'duration': 45,
            'distance': 15.0,
            'calories': 500,
            'date': '2024-01-15'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 1)


class WorkoutAPITest(APITestCase):
    def test_create_workout(self):
        url = '/api/workouts/'
        data = {
            'name': 'Morning Cardio',
            'description': 'A quick morning cardio workout',
            'difficulty': 'medium',
            'duration': 20,
            'exercise_type': 'cardio'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Workout.objects.count(), 1)
