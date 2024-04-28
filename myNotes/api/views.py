from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import NoteSerializer

# Create your views here.
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class UploadImageView(APIView):
    def post(self, request, format=None):
        image = request.data.get('image')
        if image:
            note = Note.objects.get(pk=request.data.get('note_id'))
            note.bg_img = image
            note.save()
            return Response({'message': 'Image uploaded successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
