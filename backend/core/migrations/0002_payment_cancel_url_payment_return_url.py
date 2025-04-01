# Generated by Django 5.1.7 on 2025-03-31 19:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="payment",
            name="cancel_url",
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="payment",
            name="return_url",
            field=models.URLField(blank=True, null=True),
        ),
    ]
