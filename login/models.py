from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserInfo(models.Model):
	user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	date_of_birth = models.DateField(default='1970-1-1')
	timezone = models.CharField(default='UTC', max_length=3, blank=True)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_info(sender, instance, created, **kwargs):
	if created:
		UserInfo.objects.create(user=instance)