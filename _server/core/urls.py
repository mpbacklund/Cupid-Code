from django.urls import path, re_path
from . import views

urlpatterns = [
    path('api/', view=views.chat_api, name='chat_api'),
    path('me/', view=views.me, name='me'),
    path('manager_statistics/', view=views.manager_statistics, name='manager_statistics'),
    path('update_me/', view=views.update_me, name='update_me'),
    path('create_intervention/', view=views.create_intervention, name='create_intervention'),
    path('get_intervention/', view=views.get_intervention, name='get_intervention'),
    path('accept_job/', view=views.accept_job, name='accept_job'),
    path('complete_job/', view=views.complete_job, name='complete_job'),
    path('financial_statistics/', view=views.financial_statistics, name='financial_statistics'),
    re_path('.*', view=views.index, name="index"), # this one has to be last
]