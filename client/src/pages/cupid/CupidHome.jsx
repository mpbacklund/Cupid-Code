import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer, LoadScript } from '@react-google-maps/api'
import Cookies from 'universal-cookie';

function CupidHome() {
    const cookies = new Cookies(null, {path:'/'});
    const [markers, setMarkers] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const directionsService = useRef(null);
    const [jobActive, setJobActive] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({ lat: 41.7403, lng: -111.842 });

    function success(position) {
        const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        setCurrentLocation(latlng)
    }

    function error(err) {
        console.error(`ERROR(${err.code}): ${err.message}`);
    }
    
    const locationAPIOptions = {
        enableHighAccuracy: true,
        timeout: 10000, // wait for as long as 10 seconds for a new breadcrumb
        maximumAge: 30000, // breadcrumb can be up to 30 seconds old
    };

    useEffect(() => {

        navigator.geolocation.watchPosition(
          success,
          error,
          locationAPIOptions
        );
    }, []);

    const mapRef = useRef();
    const onLoad = useCallback(map => {
        mapRef.current = map;
        const ws = new WebSocket('ws://' + location.host + '/ws/interventions/')
      
        const id = navigator.geolocation.watchPosition(success, error, locationAPIOptions);

        ws.onmessage = async function (event) {
            const interventionNotification = JSON.parse(event.data);
            if (interventionNotification.taken) {
                // Remove the notification from the markers because it was taken by another cupid
                setMarkers(previousMarkers => previousMarkers.filter(marker => marker.key !== interventionNotification.id))
            } else {
                let deliveryLocation = interventionNotification.delivery_location
                let converted = await makeAddresses(interventionNotification)
                setMarkers(previousMarkers => [...previousMarkers,
                    {key: interventionNotification['id'],
                    dater: interventionNotification.dater.first_name,
                    lat: deliveryLocation.latitude, 
                    lng: deliveryLocation.longitude,
                    pickUp: converted.pickUp,
                    dropOff: converted.dropOff
                }])
            }
        }

        return () => {
            ws.close();
            navigator.geolocation.clearWatch(id);
        }
    }, []);

    async function makeAddresses(box) {
        const geocoder = new window.google.maps.Geocoder();

        const cPlaceID = async (placeId) => {
            return new Promise((resolve, reject) => {
                geocoder.geocode({ placeId: placeId }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject('Failed to geocode place ID');
                    }
                })
            })
        }
    
        const cCoords = async (lat, lng) => {
            return new Promise((resolve, reject) => {
                geocoder.geocode({ location: { lat: lat, lng: lng } }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject('Failed to geocode coordinates');
                    }
                })
            })
        }
        
        try{
            const pickUp = await cPlaceID(box.point_of_interest)
            const dropOff = await cCoords(box.delivery_location.latitude, box.delivery_location.longitude)
            return {pickUp, dropOff};
        }
        catch (error) {
            console.error(error);
            return {pickUp: 'Address not available', dropOff: 'Address not available'};
        }
    }

    async function acceptJob() {
        if (!activeMarker) return;
        const response = await fetch('/accept_job/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get("csrftoken")
            },
            body: JSON.stringify({id: activeMarker.key}),
        });
        const data = await response.json();
        if (data.status === 'accepted'){
            setJobActive(activeMarker.key);
            displayRoute(activeMarker);
            setActiveMarker(null);
        }
        else {
            console.log('Failed to accept job')
        }
    }

    const displayRoute = (marker) => {
        if (!directionsService.current) {
            directionsService.current = new window.google.maps.DirectionsService();
        }

        directionsService.current.route({
            origin: {lat: currentLocation.lat, lng: currentLocation.lng},
            waypoints: [{location: marker.pickUp}],
            destination: marker.dropOff,
            travelMode: window.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                setDirectionsResponse(result);
            }
            else {
                console.error(`failed to fetch directions: ${status}`);
            }
        })
    }

    async function completeJob() {
        const response = await fetch('/complete_job/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get("csrftoken")
            },
            body: JSON.stringify({id: jobActive}),
        });
        const data = await response.json();
        if (data.status === 'completed'){
            setDirectionsResponse(null);
            setJobActive(null);
        }
    }

    function clearActive() {
        setActiveMarker(null)
    }
    
    return(
        <>
            <LoadScript 
                googleMapsApiKey='AIzaSyDfIWSb-Nr95aKWPqH6qvWKjz-PCvs5IyE'
                loadingElement={<div>Loading...</div>}
            >
                <GoogleMap 
                    mapContainerStyle={{width: '100%', height: '100%'}}
                    center={currentLocation}
                    zoom={12}
                    onLoad={onLoad}
                >
                    {!jobActive && markers.map(marker => (
                        <Marker 
                            key={marker.key} 
                            position={{lat:marker.lat, lng:marker.lng}}
                            onClick={() => setActiveMarker(marker)}
                        />
                        
                    ))}
                    {activeMarker && (
                        <InfoWindow
                            position={{lat:activeMarker.lat,lng:activeMarker.lng}}
                            onCloseClick={() => clearActive()}
                        >
                            <div>
                                <h2>Intervention Alert</h2>
                                <p>Job: {activeMarker.dater} needs help!</p>
                                <p>Pickup from: {activeMarker.pickUp}</p>
                                <p>Deliver to: {activeMarker.dropOff}</p>
                                <button className="cupid-code-button" onClick={acceptJob}>Accept Intervention</button>
                            </div>
                        </InfoWindow>
                    )}
                    {directionsResponse && (
                        <DirectionsRenderer directions={directionsResponse} />
                    )}
                </GoogleMap>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', padding: '10px' }}>
                    {jobActive && <button className="cupid-code-button" onClick={completeJob}>Complete Job</button>}
                </div>
            </LoadScript>
        </>
    )
}

export default CupidHome;