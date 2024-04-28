from rest_framework import serializers
from .models import *

class NoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Note
        fields = ['note_id', 'title', 'body', 'updated', 'created', 'isPinned', 'isArchive', 'isTrash', 'bg_img', 'bg_color']