from django.db import models
from registration.models import Dater, Cupid
from django.utils import timezone
from django.forms.models import model_to_dict
        
class Location(models.Model):
    latitude = models.TextField()
    longitude = models.TextField()

class PointOfInterest(models.Model):
    name = models.TextField()
    address = models.TextField()
    google_maps_id = models.TextField()

class Intervention(models.Model):
    # Intervention has a many-to-one relationship with Dater;
    # One dater can have multiple interventions.
    dater = models.ForeignKey(Dater, on_delete=models.CASCADE)
    cupid = models.ForeignKey(Cupid, on_delete=models.CASCADE, default=None, null=True) # instead of an accepted field, the Intervention has been accepted when the cupid field is not null
    fulfilled = models.BooleanField(default=False)
    time_created = models.DateTimeField(default=timezone.now)
    point_of_interest = models.ForeignKey(PointOfInterest, on_delete=models.CASCADE)
    delivery_location = models.ForeignKey(Location, on_delete=models.CASCADE)
    total_payout = models.DecimalField(max_digits = 7, decimal_places = 2, default = 0)

    def as_cupid_notification(self):
        serialized = model_to_dict(self, fields=['id'])
        serialized['taken'] = self.cupid is not None
        if not serialized['taken']:
            dater_name = self.dater.user.first_name if self.dater.user.first_name != "" else self.dater.user.username
            serialized['dater'] = {'first_name': dater_name}
            serialized['point_of_interest'] = self.point_of_interest.google_maps_id
            serialized['delivery_location'] = {
                'latitude': float(self.delivery_location.latitude),
                'longitude': float(self.delivery_location.longitude)
            }
        return serialized