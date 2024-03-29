# Generated by Django 2.0.13 on 2019-03-23 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('movieid', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('director', models.CharField(max_length=100)),
                ('genres', models.CharField(max_length=100)),
                ('poster_path', models.CharField(max_length=200)),
                ('overview', models.TextField()),
                ('release_date', models.DateTimeField(blank=True, null=True)),
                ('runtime', models.PositiveSmallIntegerField()),
            ],
        ),
    ]
