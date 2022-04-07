import React, { useEffect, useRef, useState, ReactElement } from "react";
import ReactDOM from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { setDoc, addDoc, updateDoc, deleteDoc, deleteField, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { any, bool } from "prop-types";

firebase.initializeApp({
  apiKey: "AIzaSyCKrzHCFzQSADP43iFN2e_gduzX-1TTmj8",
  authDomain: "geoduel-dc6b2.firebaseapp.com",
  projectId: "geoduel-dc6b2",
  storageBucket: "geoduel-dc6b2.appspot.com",
  messagingSenderId: "863497247016",
  appId: "1:863497247016:web:d1b3082d2cc526353bd81d",
  measurementId: "G-DNZY4K9H73"
})
const firestore = firebase.firestore();

const db = getFirestore();

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
]
const random = Math.floor(Math.random() * icons.length);

const render = (status: Status): any => {
  return <h1>{status}</h1>;
};

let updated = false;
let map;
let panorama;
let marker;
let round_number: number;
let selectedLocation: any;
function MyMapStreetComponent({
  fenway,
  round,
  pickingTime
}: {
  fenway: google.maps.LatLngLiteral;
  round: number;
  pickingTime: any;
}) {
  const refMap: any = useRef();
  const refPano: any = useRef();
  const [streetLocation, setstreetLocation] = useState<google.maps.LatLng | null>();
  round_number = round;

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

  async function updateLocation() {
    const selectedPosition = panorama.getPosition();
    setstreetLocation(selectedPosition);
    selectedLocation = selectedPosition;
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
      <button className="select" onClick={updateLocation!}>Select Location!</button>
    </div>
  );
}

let stopCount: boolean = false;
function CalculateTimeLeft(round, pickingTime) {
  round_number = round;
  const [seconds, setSeconds]: any = useState(round["round"]["pickingTime"] * 60);
  useEffect(() => {
    if (seconds > 0 && !stopCount && updated) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }
    else if (seconds > 0 && !stopCount && !updated) {
      updated = true;
      setTimeout(() => setSeconds(seconds - 1), 1000);
    }
    else if (seconds == 0) {
      stopCount = true;
      setSeconds('###### Your chosen location was sent! ######');
      setDoc(doc(db, "matches", roomName), {
        playersInfo: {
          [playerName]: {
            [`${String(round["round"]["round_number"])}`]: {
              guessings: {},
              picking: new firebase.firestore.GeoPoint(selectedLocation.lat(), selectedLocation.lng()),
            }
          }
        }
      }, { merge: true });
    }
    else {
      setSeconds('###### Your chosen location was sent! ######');
    }
  });

  function iAmReady() {
    stopCount = true;
    setSeconds(0);
  }

  return (
    <div>
      <h2>{`Time left: ${seconds} seconds!`}</h2>
      <button className="ready" onClick={iAmReady!}>I am Ready!!!</button>
    </div>
  );
}

export function RenderMapStreet(round_number, pickingTime) {
  const fenway = { lat: -31.55542202732198, lng: -54.54408893196694 };
  return (
    <div>
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render} libraries={["geometry"]}>
      <MyMapStreetComponent fenway={fenway} round={round_number} pickingTime={pickingTime}/>
      <CalculateTimeLeft round={round_number} pickingTime={pickingTime}/>
    </Wrapper>
    </div>
  );
}