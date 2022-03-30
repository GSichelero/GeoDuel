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

async function getMarker() {
  const snapshot = await firebase.firestore().collection('events').get()
  return snapshot.docs.map(doc => doc.data());
}

const databaseData = await getMarker();
console.log(databaseData);

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
function MyMapStreetComponentGuess({
  fenway,
  round,
  pickingTime,
  correctLocation
}: {
  fenway: google.maps.LatLngLiteral;
  round: number;
  pickingTime: any;
  correctLocation: google.maps.LatLngLiteral;
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
            streetViewControl: false
        });

        map.addListener('click', function(e) {
          updateLocation(e.latLng);
        });

        panorama = new window.google.maps.StreetViewPanorama(refPano.current, {
            position: correctLocation,
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
    }
  });

  async function updateLocation(positionClicked: google.maps.LatLng) {
    selectedLocation = positionClicked;
    if (marker) {
      marker.setMap(null);
      marker = null;
    }
    marker = new google.maps.Marker({
      position: positionClicked,
      title:"Guess",
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
    </div>
  );
}

let stopCount: boolean = false;
function CalculateTimeLeftGuess(round, pickingTime) {
  round_number = round;
  const [seconds, setSeconds]: any = useState(round["round"]["pickingTime"] * 60);
  useEffect(() => {
    if (seconds > 0 && !stopCount) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else if (seconds == 0) {
      stopCount = true;
      setSeconds('###### Your chosen location was sent! ######');
      setDoc(doc(db, "matches", roomName), {
        playersInfo: {
          [playerName]: {
            [`${String(round["round"]["round_number"])}`]: {
              guessings: {
                ['0']: new firebase.firestore.GeoPoint(selectedLocation.lat(), selectedLocation.lng())
              }
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
      <button className="ready" onClick={iAmReady!}>Guess Location!</button>
    </div>
  );
}

export function RenderMapStreetGuess(round_number, pickingTime, correctLocation) {
  const fenway = { lat: -31.55542202732198, lng: -54.54408893196694 };
  return (
    <div>
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyMapStreetComponentGuess fenway={fenway} round={round_number} pickingTime={pickingTime} correctLocation={correctLocation}/>
      <CalculateTimeLeftGuess round={round_number} pickingTime={pickingTime}/>
    </Wrapper>
    </div>
  );
}