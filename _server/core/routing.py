from django.urls import path

from .consumers import InterventionConsumer

websocket_urlpatterns = [
    path("ws/interventions/", InterventionConsumer.as_asgi()),
]