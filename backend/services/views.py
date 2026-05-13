from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from .models import Category, Service
from .serializers import CategorySerializer, ServiceListSerializer, ServiceDetailSerializer, AdminServiceSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class CategoryListView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.filter(is_active=True)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    queryset = Category.objects.all()
    lookup_field = 'slug'

class ServiceListView(generics.ListCreateAPIView):
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['category__slug', 'is_popular', 'is_active']
    search_fields = ['title', 'description']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdminServiceSerializer
        return ServiceListSerializer

    def get_queryset(self):
        return Service.objects.filter(is_active=True).select_related('category')

class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    permission_classes = [IsAdminOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AdminServiceSerializer
        return ServiceDetailSerializer
