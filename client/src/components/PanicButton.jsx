import React from 'react';
import Cookies from 'universal-cookie';

import '../App.css'

export default function PanicButton({ interOnClick, intervenResponse }) {
  const cookies = new Cookies(null, { path: '/' });

  const locationAPIOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // wait for as long as 10 seconds for a new breadcrumb
    maximumAge: 30000, // breadcrumb can be up to 30 seconds old
  };

  // TODO: Depending on response, display message saying that Cupid is coming. If error, report it
  async function locationRetrievedHook(location) {
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }

    var response = await fetch('/create_intervention/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get("csrftoken")
        },
        body: JSON.stringify({ coordinates: coords })
    });
    
    var info = await response.json()
    
    intervenResponse(info['status'])
  }

  function locationErrorHook(error) {
    console.log(`An error has occured while trying to create a new intervention: ${error}`)
  }

  function createIntervention() {
    navigator.geolocation.getCurrentPosition(
      locationRetrievedHook,
      locationErrorHook,
      locationAPIOptions
    );
  }

    return (
      <div onClick={() => {createIntervention(); interOnClick(); intervenResponse(<img width={50} height={50} src="/loading-wheel.svg" />);}} id="panicButton">
          <p id="panicText">Save Me!</p>
      </div>
    )
  }