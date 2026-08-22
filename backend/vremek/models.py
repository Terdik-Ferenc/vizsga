from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator

class Egitestek(models.Model):
    egitestNev = models.CharField(max_length=200, verbose_name="Égitest neve")
    egitestImage = models.ImageField(upload_to='egitestek_kepek/', blank=True, null=True, verbose_name="Égitest képe")
    # videók feltöltése (védelemből csak videó fileokat enged feltölteni)
    egitestVideo = models.FileField(
        upload_to='egitestek_videok/', 
        blank=True, 
        null=True, 
        verbose_name="Égitest videója",
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'avi', 'mov', 'mkv', 'webm', 'vlc'])] # Csak ezeket engedjük
    )
    egitestDescription = models.TextField(verbose_name="Égitest leírása")

    def __str__(self):
        return self.egitestNev
    
    class Meta:
        verbose_name_plural = 'egitestek'


class Esemenyek(models.Model):
    esemenyNev = models.CharField(max_length=200, verbose_name="Esemény neve")
    esemenyDatum = models.DateTimeField(verbose_name="Esemény dátuma és ideje")
    esemenyHelyszin = models.CharField(max_length=255, verbose_name="Esemény helyszíne")
    # Több a többhöz kapcsolat a felhasználókkal
    # A blank=True lehetővé teszi, hogy egy eseményre kezdetben ne legyen jelentkező
    jelentkezok = models.ManyToManyField(User, related_name='jelentkezett_esemenyek', blank=True, verbose_name="Jelentkezett felhasználók")

    def __str__(self):
        return self.esemenyNev
    
    class Meta:
        verbose_name_plural = 'esemenyek'


class Cikkek(models.Model):
    cikkNev = models.CharField(max_length=255, verbose_name="Cikk címe")
    cikkImage = models.ImageField(upload_to='cikkek_kepek/', blank=True, null=True, verbose_name="Cikk képe")
    # videók feltöltése
    cikkVideo = models.FileField(
        upload_to='cikkek_videok/', 
        blank=True, 
        null=True, 
        verbose_name="Cikkek videója",
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'avi', 'mov', 'mkv', 'webm', 'vlc'])]
    )
    cikkShortDescription = models.CharField(max_length=500, verbose_name="Rövid leírás")
    cikkLongDescription = models.TextField(verbose_name="Hosszú leírás")

    def __str__(self):
        return self.cikkNev
    
    class Meta:
        verbose_name_plural = 'cikkek'

    # Kommentek modellje
class Kommentek(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='kommentek', verbose_name="Felhasználó")
    tartalom = models.TextField(verbose_name="Komment tartalma")
    letrehozva = models.DateTimeField(auto_now_add=True, verbose_name="Létrehozás ideje")

    def __str__(self):
        return f"{self.user.username} - {self.tartalom[:20]}"

    class Meta:
            verbose_name_plural = 'kommentek'
