from django.shortcuts import render, redirect
from django.conf  import settings
from django.views import View
from django.http import HttpRequest, JsonResponse, HttpResponseNotFound, HttpResponse
from django.forms.models import model_to_dict
import json
import os
import random
import googlemaps
from django.contrib.auth.decorators import login_required
from openai import OpenAI
from core.models import Intervention, Location, PointOfInterest
from django.utils import timezone
from registration.models import Dater, Cupid, Manager
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models import Sum
from decimal import Decimal

# Load manifest when server launches
MANIFEST = {}
if not settings.DEBUG:
    f = open(f"{settings.BASE_DIR}/core/static/core/manifest.json")
    MANIFEST = json.load(f)

@login_required
def me(request):
    if request.method == 'GET':
        user = request.user
        userData = model_to_dict(user)
        userData.pop("password", None) # Remove password, we should never send it back.

        if (hasattr(user, "dater")):
            userData.update(model_to_dict(user.dater))
            
        if (hasattr(user, "cupid")):
            userData.update(model_to_dict(user.cupid))

        if (hasattr(user, "manager")):
            userData.update(model_to_dict(user.manager))

        return JsonResponse(userData)
    

@login_required
def update_me(request):
    if request.method == 'POST':
        # get the user
        user = request.user

        # parse what field is being updated
        data = json.loads(request.body.decode("utf-8"))
        field = data.get("field")
        value = data.get("value")
        
        # get the user type and update the field
        if (hasattr(user, "dater")):
            dater = Dater.objects.get(user_id=user.id)

            if(field == "balance") :
                new_balance = float(value)
                dater.balance = new_balance
                dater.save()
                return JsonResponse({'success': 'Balance updated successfully'})
            elif(field == "budget") :
                new_budget = float(value)
                dater.budget = new_budget
                dater.save()
                return JsonResponse({'success': 'Baudget updated successfully'})
            
        if (hasattr(user, "cupid")):
            userData = Cupid.objects.get(id=user.id)

        if (hasattr(user, "manager")):
            userData = Manager.objects.get(id=user.id)


        return JsonResponse({'error': 'Invalid User type'})  
    
    return JsonResponse({'error': 'Invalid request method'})

@login_required
def manager_statistics(request):
    # Calculate the total number of fulfilled interventions in the last 30 days
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    interventions_last_30_days = Intervention.objects.filter(time_created__gte=thirty_days_ago)

    # Calculate the total number of unique daters using the app
    unique_daters_count = Dater.objects.all().count()
    monthly_daters_count = interventions_last_30_days.values('dater').distinct().count()

    # Calculate the total number of unique cupids using the app
    unique_cupids_count = Cupid.objects.all().count()
    monthly_cupids_count = interventions_last_30_days.values('cupid').distinct().count()

    # Construct the JSON response
    data = {
        'fulfilled_interventions_last_30_days': interventions_last_30_days.count(),
        'unique_daters_count': unique_daters_count,
        'monthly_daters_count': monthly_daters_count,
        'unique_cupids_count': unique_cupids_count,
        'monthly_cupids_count': monthly_cupids_count,
    }
    return JsonResponse(data)

@login_required
def financial_statistics(request):
    # get all interventions in last 30 days
    thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
    interventions_last_30_days = Intervention.objects.filter(time_created__gte=thirty_days_ago)

    # get the amount of money exchanged in interventions over the last 30 days
    sum_of_total_payout = interventions_last_30_days.aggregate(Sum('total_payout'))
    
    total_payout = sum_of_total_payout['total_payout__sum']
    
    # Check if total_payout is None before performing calculations
    if total_payout is not None:
        # Convert the float to Decimal for precise decimal arithmetic
        total_payout = Decimal(str(total_payout))

        # Perform calculations with Decimal objects
        cupid_payout = total_payout * Decimal('0.8')
        our_payout = total_payout * Decimal('0.2')

        # If needed, convert back to float for further processing
        cupid_payout = float(cupid_payout)
        our_payout = float(our_payout)
    else:
        # Handle the case when there are no interventions in the last 30 days
        cupid_payout = 0
        our_payout = 0
        total_payout = 0

    # Get the sum of all dater balances
    total_balance = Dater.objects.aggregate(Sum('balance'))
    # Access the sum of balances
    total_unused_cupid_cash = total_balance['balance__sum']

    if total_unused_cupid_cash is None:
        total_unused_cupid_cash = 0
        
    data = {
        'total_payout': total_payout,
        'cupid_payout': cupid_payout,
        'our_payout': our_payout,
        'total_unused_cupid_cash': total_unused_cupid_cash,
    }
    return JsonResponse(data)


@login_required
def index(req):
    context = {
        "asset_url": os.environ.get("ASSET_URL", ""),
        "debug": settings.DEBUG,
        "manifest": MANIFEST,
        "js_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["file"],
        "css_file": "" if settings.DEBUG else MANIFEST["src/main.ts"]["css"][0]
    }
    return render(req, "core/index.html", context)

@login_required
def chat_api(request):
    if not request.method == 'POST':
        return HttpResponseNotFound()
    data = json.loads(request.body.decode("utf-8"))
    conversation = data.get("conversation")
    convo = [
        {"role": "system", "content": "You, the assistant, are a professional dating assistant. I am a client who has hired you to assist me with my dating life."}
        ]+[
            {"role": "user" if msg["isUser"] == "true" else "system", "content": msg['text']}
            for msg in conversation
    ]

    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages = convo
    )

    return JsonResponse({'response': response.choices[0].message.content})


@login_required
def get_intervention(request: HttpRequest):
    if request.method == 'GET':
        dater = Dater.objects.get(pk=request.user)
        if not dater:
            return HttpResponseNotFound()

        # Gets the most recent intervention created for this user
        intervention = Intervention.objects.filter(dater=dater).last()

        inteventionData = model_to_dict(intervention)

        return JsonResponse(inteventionData)
    
    return HttpResponseNotFound()

@login_required
def create_intervention(request: HttpRequest): # we need to know which dater made the intervention request
    if request.method == "POST":
        dater = Dater.objects.get(pk=request.user)
        if not dater:
            return HttpResponseNotFound()
        
        # Before creating a new intervention, check to see if there's already an active intervention
        lastIntervention = Intervention.objects.filter(dater=dater).last()
        if(lastIntervention != None and lastIntervention.fulfilled != True):
           return JsonResponse({'status': 'You already have an ongoing intervention! Go to the Intervention page to see details.'})
        
        # Make sure the dater's balance is at least $20
        budget = dater.budget
        if(budget < 20):
            return JsonResponse({'status': 'Intervention not started.  You must have a budget of at least $20 in order to get help.'})
        
        # Create the intervention
        jsonLocation = json.loads(request.body.decode("utf-8"))['coordinates']
        daterLocation = Location(latitude=jsonLocation['latitude'], longitude=jsonLocation['longitude'])
        daterLocation.save()
        point_of_interest = selectPointOfInterest(daterLocation)
        point_of_interest.save()

        dater.budget = 0.00 # Take money from the dater
        dater.balance = dater.balance - budget
        dater.save()

        intervention = Intervention.objects.create(
            dater=dater,
            point_of_interest=point_of_interest,
            delivery_location=daterLocation,
            total_payout=budget,
        )
        intervention.save()

        # Push new intervention to all Cupids
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "interventions_updates",
            {
                "type": "interventions.message",  # Corresponds to the method in the consumer
                "message": json.dumps(intervention.as_cupid_notification()),
            }
        )
        # TODO: Create a try/catch block for the above. We may just not get results from the Google Maps API. Return the status.
        return JsonResponse({'status': 'Help is on the way!  Check the Interventions Page for details.'}) 


def selectPointOfInterest(daterLocation: Location):
    convo = [
        {"role": "system", "content": 
            (
                "I am on a date and it's not going well. "
                "I'm going to send a friend to a store, restaurant, or venue to buy something that would help the date go better. "
                "Give me one to four words that I could type into Google Maps to find a good place to send my friend. "
                "Do not give the result as a bulleted list or in quotes."
            )
        }
    ]

    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages = convo
    )
    
    chatgpt_choice = response.choices[0].message.content
    print(f"ChatGPT says: '{chatgpt_choice}'")
    points = getPointsOfInterest(chatgpt_choice, daterLocation)

    index = 0 if len(points["results"]) == 1 else random.randint(0, len(points["results"]) - 1)
    point = points["results"][index]
    return PointOfInterest(name=point['name'], address=point['formatted_address'], google_maps_id=point['place_id'])

# TODO: We may want to filter out results that don't contain, 'business_status': 'OPERATIONAL'
def getPointsOfInterest(keyword: str, daterLocation: Location):
    maps = googlemaps.Client(key=os.environ["GOOGLE_MAPS_API_KEY"])

    response = maps.places(query=keyword, location=(daterLocation.latitude, daterLocation.longitude))
    if 'status' in response and response['status'] == 'ZERO_RESULTS':
        print("Response was empty! Defaulting to search for flowers...")
        response = maps.places(query="flowers", location=(daterLocation.latitude, daterLocation.longitude))
    return response

@login_required
def accept_job(request):
    person = Cupid.objects.get(pk=request.user)
    if not person:
        return HttpResponseNotFound()
    data = json.loads(request.body.decode("utf-8"))
    intervention = Intervention.objects.get(pk=data.get('id'))
    if intervention.cupid != None:
        return JsonResponse({'status': 'error', 'details': 'This intervention was already accepted by another Cupid!'}) 
    intervention.cupid = person
    intervention.save()

    # Notify all Cupids that the intervention is now taken
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "interventions_updates",
        {
            "type": "interventions.message",  # Corresponds to the method in the consumer
            "message": json.dumps(intervention.as_cupid_notification()),
        }
    )
    return JsonResponse({'status': 'accepted'})

@login_required
def complete_job(request):
    data = json.loads(request.body.decode("utf-8"))
    intervention = Intervention.objects.get(pk=data.get('id'))
    intervention.fulfilled = True
    intervention.save()

    cupid = Cupid.objects.get(pk=request.user)
    if not cupid:
        return HttpResponseNotFound()
    
    # After completing an intervention, pay the cupid
    cupid_payout = float(intervention.total_payout) * 0.8
    cupid.balance = float(cupid.balance) + cupid_payout
    cupid.save()

    return JsonResponse({'status': 'completed'})
