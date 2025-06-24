from django.db import models
from django.conf import settings

# This function is not strictly needed if your container is always 'photos' and you rely on Azure for internal paths
# However, if you want dynamic subfolders like 'photos/folder_name/filename.jpg', keep it.
# If you just want 'folder_name/filename.jpg' directly in the 'photos' container, simply set upload_to='folder_name/' in the model.

# Let's keep your custom upload_to as it handles folder structure within the blob container.
# Just ensure it correctly handles the path without leading slashes for Azure.
def upload_to_folder(instance, filename):
    folder_name = instance.folder.name if instance.folder else 'others'
    # Sanitize folder_name to be URL-friendly and valid for blob paths
    folder_name = "".join(c for c in folder_name if c.isalnum() or c in (' ', '_', '-')).strip()
    folder_name = folder_name.replace(' ', '_') # Replace spaces with underscores for better URL path
    return f'photos/{folder_name}/{filename}' # This creates path like photos/MyFolder/image.jpg

class Folder(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

    class Meta:
        pass

class Photo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    # Use the custom upload_to function
    image = models.ImageField(upload_to=upload_to_folder)
    folder = models.ForeignKey(
        'Folder',
        on_delete=models.CASCADE,
        related_name='photos',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='photos'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Photo'
        verbose_name_plural = 'Photos'
