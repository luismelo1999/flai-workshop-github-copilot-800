from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'password', 'team_id', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_id(self, obj):
        return str(obj.id)


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'member_count']
    
    def get_id(self, obj):
        return str(obj.id)
    
    def get_member_count(self, obj):
        # Count users with this team's id
        return User.objects.filter(team_id=str(obj.id)).count()


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'distance', 'calories', 'date', 'created_at']
    
    def get_id(self, obj):
        return str(obj.id)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()
    total_calories = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'user_name', 'team_id', 'team_name', 'total_points', 'total_activities', 'total_calories', 'rank', 'updated_at']
    
    def get_id(self, obj):
        return str(obj.id)
    
    def get_user_name(self, obj):
        try:
            user = User.objects.get(id=obj.user_id)
            return user.name
        except User.DoesNotExist:
            return f"User {obj.user_id}"
    
    def get_team_name(self, obj):
        if not obj.team_id:
            return None
        try:
            team = Team.objects.get(id=obj.team_id)
            return team.name
        except Team.DoesNotExist:
            return None
    
    def get_total_calories(self, obj):
        from django.db.models import Sum
        total = Activity.objects.filter(user_id=obj.user_id).aggregate(Sum('calories'))['calories__sum']
        return total or 0


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'duration', 'exercise_type', 'created_at']
    
    def get_id(self, obj):
        return str(obj.id)
