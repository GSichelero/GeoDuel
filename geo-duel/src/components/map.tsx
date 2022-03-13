import React, { useEffect, useRef, useState, ReactElement } from "react";
import ReactDOM from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const search = window.location.search;
const params = new URLSearchParams(search); 
const roomName = String(params.get('room'));
const playerName = String(params.get('player'));

const icons = [
  'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  'http://maps.google.com/mapfiles/ms/icons/lightblue-dot.png',
]
const random = Math.floor(Math.random() * icons.length);

const render = (status: Status): any => {
  return <h1>{status}</h1>;
};

function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref: any = useRef();

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return <div ref={ref} id="map" />;
}


function MyStreetViewComponent({
  position,
  heading,
  pitch,
}: {
  position: google.maps.LatLngLiteral;
  heading: number;
  pitch: number;
}) {
  const ref: any = useRef();

  useEffect(() => {
    new window.google.maps.StreetViewPanorama(ref.current, {
      position: position,
      pov: {
        heading: heading,
        pitch: pitch,
      }
    });
  });

  return <div ref={ref} id="pano" />;
}

let updated = false;
let map;
let panorama;
let marker;
function MyMapStreetComponent({
  fenway,
}: {
  fenway: google.maps.LatLngLiteral;
}) {
  const refMap: any = useRef();
  const refPano: any = useRef();
  const [streetLocation, setstreetLocation] = useState<google.maps.LatLng | null>();

  useEffect(() => {
    if (!updated) {
      map = new window.google.maps.Map(refMap.current, {
        center: fenway,
        zoom: 2,
        panControl: false,
        zoomControl: true,
        fullscreenControl: false,
        // streetViewControl: false
      });
      panorama = new window.google.maps.StreetViewPanorama(refPano.current, {
        position: fenway,
        pov: {
          heading: 34,
          pitch: 10,
        },
        linksControl: false,
        panControl: false,
        addressControl: false,
        enableCloseButton: false,
        zoomControl: true,
        fullscreenControl: false,
      });
      map.setStreetView(panorama);
    }
  });

  function updateLocation() {
    const selectedPosition = panorama.getPosition();
    setstreetLocation(selectedPosition);
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    marker = new google.maps.Marker({
      position: selectedPosition,
      title:"Pick",
      label: {
        text: playerName,
        fontWeight: 'bold'
      },
      icon: {
        url: icons[random],
        labelOrigin: new window.google.maps.Point(8, -5)
      }
    });
    marker.setMap(map);
    updated = true;
  }

  return (
    <div id="mapsContainer">
      <div ref={refMap} id="map" />
      <div ref={refPano} id="pano" />
      <h2>{String(streetLocation)}</h2>
      <button onClick={updateLocation!}>Choose Location!</button>
    </div>
  );
}

export function RenderMap() {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 4;
  return (
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyMapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
}

export function RenderStreetView() {
  const position = { lat: 42.345573, lng: -71.098326 };
  const heading = 34;
  const pitch = 10;
  return (
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyStreetViewComponent position={position} heading={heading} pitch={pitch} />
    </Wrapper>
  );
}

export function RenderMapStreet() {
  const fenway = { lat: -31.55542202732198, lng: -54.54408893196694 };
  return (
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyMapStreetComponent fenway={fenway}/>
    </Wrapper>
  );
}