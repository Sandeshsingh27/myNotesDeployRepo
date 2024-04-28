from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import *


router = routers.DefaultRouter()
router.register(r'Note', NoteViewSet)

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('upload/', UploadImageView.as_view(), name='upload_image'),
]