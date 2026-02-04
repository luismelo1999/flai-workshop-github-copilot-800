from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'name', 'team_id', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('created_at',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'activity_type', 'duration', 'distance', 'calories', 'date', 'created_at')
    search_fields = ('user_id', 'activity_type')
    list_filter = ('activity_type', 'date', 'created_at')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'team_id', 'total_points', 'total_activities', 'rank', 'updated_at')
    search_fields = ('user_id', 'team_id')
    list_filter = ('updated_at',)
    ordering = ('-total_points',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'difficulty', 'duration', 'exercise_type', 'created_at')
    search_fields = ('name', 'exercise_type')
    list_filter = ('difficulty', 'exercise_type', 'created_at')
