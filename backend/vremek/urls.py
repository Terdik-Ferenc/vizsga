from django.urls import path, include
# from rest_framework_simplejwt.views import TokenRefreshView
# from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, UserListView, DeleteUserView, EgitestekViewSet, EsemenyekViewSet, CikkekViewSet
# from rest_framework_simplejwt.views import TokenObtainPairView as DefaultTokenObtainPairView
# Importáljuk a saját bejelentkezési nézetünket (Serializer alapján)
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import MyTokenObtainPairSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# Létrehozzuk a routert és beregisztráljuk az endpointokat
router = DefaultRouter()
router.register(r'egitestek', EgitestekViewSet)
router.register(r'esemenyek', EsemenyekViewSet)
router.register(r'cikkek', CikkekViewSet)

urlpatterns = [
    # Autentikációs végpontok
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', MyTokenObtainPairView.as_view(), name='login'),
    # path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/users/', UserListView.as_view(), name='user-list'),
    path('admin/users/<int:pk>/delete/', DeleteUserView.as_view(), name='user-delete'),
    path('', include(router.urls)),
]



