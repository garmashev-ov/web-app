from rest_framework import serializers
from .models import User, Post, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "avatar", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    likes_cnt = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, required=False, read_only=True)

    def get_likes_cnt(self, obj):
        return obj.likes.count() - obj.dislikes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if obj.likes.filter(id=request.user.id).exists():
                return 1
            elif obj.dislikes.filter(id=request.user.id).exists():
                return -1
        return 0

    class Meta:
        model = Post
        fields = ["id", "author", "content", "publication_time", "likes_cnt", "is_liked", "comments"]

class PostListSerializer(PostSerializer):
    class Meta:
        model = Post
        fields = ["id", "author", "content", "publication_time", "likes_cnt", "is_liked"]


class ProfileSerializer(serializers.ModelSerializer):
    posts = PostListSerializer(many=True, read_only=True)
    subscribers_cnt = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()

    def get_subscribers_cnt(self, obj):
        return obj.subscribers.count()
    
    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.subscribers.filter(id=request.user.id).exists()
        return False

    class Meta:
        model = User
        fields = ["id", "username", "avatar", "posts", "subscribers_cnt", "is_subscribed"]
