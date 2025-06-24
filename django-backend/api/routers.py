from rest_framework.routers import DefaultRouter

class NoSlashRouter(DefaultRouter):
    trailing_slash = ''