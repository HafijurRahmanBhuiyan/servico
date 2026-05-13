from django.contrib import admin
from .models import Category, Service, ServiceFAQ, ServiceProcessStep

admin.site.register(Category)
admin.site.register(Service)
admin.site.register(ServiceFAQ)
admin.site.register(ServiceProcessStep)
