# vremek/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Egitestek, Esemenyek, Cikkek, Kommentek


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Egyedi adatok hozzáadása a tokenhez
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser # Ez jelzi, hogy admin-e
        return token    
    # -------------------------------------

   

class EgitestekSerializer(serializers.ModelSerializer):
    class Meta:
        model = Egitestek
        fields = '__all__'

# serializer, hogy az eseménynél lássuk a jelentkezők alap adatait
class JelentkezoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EsemenyekSerializer(serializers.ModelSerializer):
    # Így a jelentkezők részletes listáját kapjuk meg, de a mező írásvédett (read_only) lesz,
    # mert a jelentkezést nem manuális JSON küldéssel, hanem egy külön gombbal (endpointtal) intézzük.
    jelentkezok = JelentkezoSerializer(many=True, read_only=True)
    is_registered = serializers.SerializerMethodField()

    class Meta:
        model = Esemenyek
        fields = '__all__'

    # A registered mező értékét meghatározó függvény
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.jelentkezok.filter(id=request.user.id).exists()
        return False    


class CikkekSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cikkek
        fields = '__all__'


# Kommentek modell serializer

class KommentekSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Kommentek
        fields = ['id', 'user', 'username', 'tartalom', 'letrehozva']
        read_only_fields = ['user', 'letrehozva']