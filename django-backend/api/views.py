from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from photoapp.models import Photo, Folder
from .serializers import PhotoSerializer, FolderSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from django.shortcuts import get_object_or_404

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def test_api(request):
    return Response({"message": "API is working!"}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [permissions.AllowAny]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return User.objects.filter(id=self.request.user.id)
        return User.objects.none()

class FolderViewSet(viewsets.ModelViewSet):
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """Delete folder and its photos"""
        folder = self.get_object()
        Photo.objects.filter(folder=folder).delete()
        folder.delete()
        return Response({'status': 'folder and its photos deleted'}, status=status.HTTP_204_NO_CONTENT)

class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        folder_id = self.kwargs.get('folder_pk')
        if folder_id:
            return Photo.objects.filter(user=self.request.user, folder_id=folder_id)
        return Photo.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        filename = request.data.get('filename')
        if not filename:
            return Response({'error': 'filename is required'}, status=400)
        if 'image' not in request.FILES:
            return Response({'error': 'Image file is required'}, status=400)

        folder_id = self.kwargs.get('folder_pk')
        if not folder_id:
            return Response({'error': 'folder_id is required from the URL.'}, status=400)

        folder = get_object_or_404(Folder, id=folder_id, user=request.user)
        image_file = request.FILES['image']
        image_file.name = filename

        photo = Photo.objects.create(
            title=filename,
            folder=folder,
            user=request.user,
            image=image_file
        )

        serializer = self.get_serializer(photo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        folder_id = self.kwargs.get('folder_pk')
        photo = self.get_object()
        if folder_id and str(photo.folder_id) != str(folder_id):
            return Response({'error': 'Photo not found in the specified folder.'}, status=status.HTTP_404_NOT_FOUND)
        photo.delete()
        return Response({'status': 'photo deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_photo_custom(request):
    foldername = request.query_params.get('foldername')
    filename = request.query_params.get('filename')

    if not foldername or not filename or 'image' not in request.FILES:
        return Response({"error": "Missing foldername, filename or image"}, status=400)

    user = request.user
    if not user.is_authenticated:
        return Response({"error": "Authentication required"}, status=401)

    folder, _ = Folder.objects.get_or_create(user=user, name=foldername)
    image_file = request.FILES['image']
    image_file.name = filename

    photo = Photo.objects.create(
        title=filename,
        folder=folder,
        user=user,
        image=image_file
    )
    serializer = PhotoSerializer(photo)
    return Response(serializer.data, status=201)