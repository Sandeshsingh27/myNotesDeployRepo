from django.db import models

# Create your models here.
class Note(models.Model):
    note_id = models.BigAutoField(primary_key=True)
    title = models.CharField(max_length=50)
    body = models.TextField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    isPinned = models.BooleanField(default=False)
    isArchive = models.BooleanField(default=False)
    isTrash = models.BooleanField(default=False)
    bg_img = models.ImageField(upload_to='media/', null=True, blank=True)
    bg_color = models.CharField(max_length=10, default="#fff")

    def __str__(self):
        return self.body[0:50]