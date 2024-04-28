from django.contrib import admin
from .models import *
# Register your models here.
class NoteAdmin(admin.ModelAdmin):
    list_display = ["note_id", "title", "body", "updated", "created", "isPinned", "isArchive", "isTrash", "bg_img", "bg_color"]
    readonly_fields = ["created", "updated"]

admin.site.register(Note, NoteAdmin)

