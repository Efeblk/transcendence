# Generated by Django 4.2.5 on 2024-11-02 07:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='GameData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player', models.CharField(max_length=100)),
                ('player2', models.CharField(max_length=100)),
                ('opponent', models.IntegerField()),
                ('player_score', models.IntegerField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('winner', models.CharField(max_length=100)),
            ],
        ),
    ]
