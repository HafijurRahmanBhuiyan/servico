from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer

class ServiceReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(service_id=self.kwargs['service_id'], status='published')

class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Review.objects.all().select_related('customer', 'service')
    filterset_fields = ['status']

class AdminReviewDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        new_status = request.data.get('status')
        if new_status in ['published', 'hidden', 'flagged']:
            review.status = new_status
            review.save()
        return Response(ReviewSerializer(review).data)

    def delete(self, request, pk):
        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({'detail': 'Not found'}, status=404)
        review.delete()
        return Response(status=204)
