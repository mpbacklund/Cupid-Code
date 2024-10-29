from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Intervention
from asgiref.sync import sync_to_async

class InterventionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "interventions_updates",  # Group name
            self.channel_name
        )
        await self.accept()
        interventions = await sync_to_async(list)(Intervention.objects.filter(cupid=None))
        for intervention in interventions:
            json_intervention = json.dumps(await sync_to_async(intervention.as_cupid_notification)())
            await self.send(json_intervention)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "interventions_updates",
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        pass  # We don't receive anything from the front-end

    async def interventions_message(self, event):
        intervention = event['message']
        await self.send(text_data=intervention)