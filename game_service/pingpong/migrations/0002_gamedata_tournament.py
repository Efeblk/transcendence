# Generated by Django 4.2.5 on 2024-11-02 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pingpong', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamedata',
            name='tournament',
            field=models.BooleanField(default=False),
        ),
    ]
