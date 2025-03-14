from django.db import models


class Professor(models.Model):
    ni = models.CharField(max_length=255)
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    tel = models.CharField(max_length=255)
    ocupacao = models.FloatField()

class Disciplina(models.Model):
    nome = models.CharField(max_length=255, unique=True)
    sigla = models.CharField(max_length=10, unique=True)

    def save(self, *args, **kwargs):
        if not self.sigla:
            self.sigla = ''.join([palavra[0].upper() for palavra in self.nome.split()])
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome
    