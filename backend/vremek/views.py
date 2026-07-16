from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import RegisterSerializer, EgitestekSerializer, EsemenyekSerializer, CikkekSerializer
from .models import Egitestek, Esemenyek, Cikkek


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# Lista a felhasználókról (csak Admin érheti el)
class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Lekérjük az összes felhasználót, kivéve magát az admint
        users = User.objects.exclude(id=request.user.id).values('id', 'username', 'email')
        return Response(users)

# Felhasználó törlése (csak Admin érheti el)
class DeleteUserView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            user_to_delete = User.objects.get(pk=pk)
            # Biztonsági mentés: Ne engedjük, hogy egy admin önmagát törölje ezen a gombon keresztül
            if user_to_delete == request.user:
                return Response({"detail": "Nem törölheted saját magadat!"}, status=status.HTTP_400_BAD_REQUEST)
            
            user_to_delete.delete()
            return Response({"detail": "Felhasználó sikeresen törölve."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "A felhasználó nem található."}, status=status.HTTP_404_NOT_FOUND)    
        
#------ Authentikations bejegyzések vége -------------------------------------


class EgitestekViewSet(viewsets.ModelViewSet):
    queryset = Egitestek.objects.all()
    serializer_class = EgitestekSerializer
    permission_classes = [IsAuthenticated] # Szigorú védelem: csak bejelentkezetteknek

class EsemenyekViewSet(viewsets.ModelViewSet):
    queryset = Esemenyek.objects.all()
    serializer_class = EsemenyekSerializer
    permission_classes = [IsAuthenticated]

    # Jelentkezés és lemondás endpoint
    # Elérhetőség POST kéréssel: /api/vremek/esemenyek/<id>/jelentkezes/
    # Példa: ha POST-al küldjük ezt, és az <id> helyére 1-est írunk akkor az 1-es ID-jű eseményre jelentkezünk,
    #  ha ismét POST-oljuk ugyanezt, akkor lejelentkeztet az eseményről

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def jelentkezes(self, request, pk=None):
        esemeny = self.get_object()
        user = request.user # A bejelentkezett felhasználó

        if user in esemeny.jelentkezok.all():
            # Ha már jelentkezett, akkor most leiratkoztatjuk (lemondás)
            esemeny.jelentkezok.remove(user)
            return Response(
                {"message": f"Sikeresen lemondtad a(z) '{esemeny.esemenyNev}' eseményt."}, 
                status=status.HTTP_200_OK
            )
        else:
            # Ha még nem jelentkezett, akkor felvesszük a listára
            esemeny.jelentkezok.add(user)
            return Response(
                {"message": f"Sikeresen jelentkeztél a(z) '{esemeny.esemenyNev}' eseményre."}, 
                status=status.HTTP_201_CREATED
            )

class CikkekViewSet(viewsets.ModelViewSet):
    queryset = Cikkek.objects.all()
    serializer_class = CikkekSerializer
    permission_classes = [IsAuthenticated]