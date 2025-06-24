from rest_framework_nested import routers
from .views import UserViewSet, PhotoViewSet, FolderViewSet, test_api, add_photo_custom
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet)
router.register(r'folders', FolderViewSet, basename='folder')

folders_router = routers.NestedDefaultRouter(router, r'folders', lookup='folder')
folders_router.register(r'photos', PhotoViewSet, basename='folder-photos')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(folders_router.urls)),
    # ...your other URLs
    re_path(r'^token/?$', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    re_path(r'^token/refresh/?$', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^auth/', include('rest_framework.urls')), # CORRECTED LINE: Removed the '$'
    re_path(r'^test/?$', test_api, name='test_api'),
    re_path(r'^addphoto/?$', add_photo_custom, name='add_photo_custom'),
]
