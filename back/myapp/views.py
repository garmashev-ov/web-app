from .serializers import (
    UserSerializer,
    PostSerializer,
    CommentSerializer,
    PostListSerializer,
    ProfileSerializer,
)
from rest_framework import viewsets, permissions
from .models import User, Post, Comment
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    http_method_names = ["get", "post"]

    def perform_create(self, serializer):
        user = User.objects.create_user(**serializer.validated_data)
        user.set_password(serializer.validated_data["password"])
    
        return user


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get"]

    def get(self, request, *args, **kwargs):
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data)


class ProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSerializer
    queryset = User.objects.all()
    http_method_names = ["get", "post"]

    def perform_create(self, serializer):
        raise PermissionDenied()

    @action(detail=True, methods=["post"])
    def subscribe(self, request, pk=None):
        subscriber = request.user
        user_to_subscribe = self.get_object()
        serializer = self.get_serializer(user_to_subscribe)
        is_subscribed = serializer.data["is_subscribed"]
        if subscriber.is_authenticated:
            if is_subscribed:
                user_to_subscribe.subscribers.remove(subscriber)
            else:
                user_to_subscribe.subscribers.add(subscriber)
            return JsonResponse(
                {"status": "success", "message": "Subscribed successfully"}, status=200
            )
        else:
            raise PermissionDenied("login to subscribe")


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all().order_by("-publication_time")

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            raise PermissionDenied("login to create a post")
        return super().perform_create(serializer)

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to update this post.")
        return super().perform_update(serializer)

    def perform_destroy(self, instance):
        if instance.author == self.request.user:
            return super().perform_destroy(instance)
        else:
            raise PermissionDenied("You do not have permission to delete this post.")

    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user
        serializer = self.get_serializer(post)
        is_liked = serializer.data["is_liked"]

        if user.is_authenticated:
            if is_liked == 1:
                post.likes.remove(user)

            elif is_liked == 0:
                post.likes.add(user)

            elif is_liked == -1:
                post.dislikes.remove(user)
                post.likes.add(user)

        else:
            raise PermissionDenied("login to like a post")
        return JsonResponse(
            {"status": "success", "message": "Liked successfully"}, status=200
        )

    @action(detail=True, methods=["post"])
    def dislike(self, request, pk=None):
        post = self.get_object()
        user = request.user
        serializer = self.get_serializer(post)
        is_liked = serializer.data["is_liked"]

        if user.is_authenticated:
            if is_liked == 1:
                post.likes.remove(user)
                post.dislikes.add(user)

            elif is_liked == 0:
                post.dislikes.add(user)

            elif is_liked == -1:
                post.dislikes.remove(user)

        else:
            raise PermissionDenied("login to like a post")
        return JsonResponse(
            {"status": "success", "message": "disLiked successfully"}, status=200
        )


class PostListViewSet(viewsets.ModelViewSet):
    serializer_class = PostListSerializer
    queryset = Post.objects.all().order_by("-publication_time")
    http_method_names = ["get"]


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            raise PermissionDenied("login to create a comment")
        return super().perform_create(serializer)

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to update this comment.")
        serializer.save()
        return super().perform_update(serializer)

    def perform_destroy(self, instance):
        if instance.author == self.request.user:
            return super().perform_destroy(instance)
        else:
            raise PermissionDenied("You do not have permission to delete this comment.")
