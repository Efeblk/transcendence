# Generated by Django 4.2.5 on 2024-10-25 12:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='profile_picture',
            field=models.ImageField(blank=True, default='profile_pictures/default.jpg', null=True, upload_to='profile_pictures/'),
        ),
        migrations.AddField(
            model_name='users',
            name='two_fa_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='user_grade',
            field=models.CharField(default='Fifth wheel', max_length=25),
        ),
        migrations.AddField(
            model_name='users',
            name='user_imagejson',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='user_location',
            field=models.CharField(default='Earth', max_length=25),
        ),
        migrations.AddField(
            model_name='users',
            name='user_phone',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='user_skillsjson',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='user_wallet',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='users',
            name='user_level',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=5),
        ),
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending', max_length=10)),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friends', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EmailVerificationCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=6)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddConstraint(
            model_name='friendship',
            constraint=models.UniqueConstraint(condition=models.Q(('user__lt', models.F('friend'))), fields=('user', 'friend'), name='unique_friendship'),
        ),
    ]
