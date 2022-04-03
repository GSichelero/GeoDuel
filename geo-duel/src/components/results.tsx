import React, { useEffect, useRef, useState, ReactElement } from "react";
import ReactDOM from "react-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { setDoc, addDoc, updateDoc, deleteDoc, deleteField, collection, query, where, onSnapshot } from "firebase/firestore";
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

let docData;
async function get_async_data() {
  const docs = await firestore.collection('matches').doc(roomName).get()
  return docs.data()
}
const getAsync = async () => {
  const key = await get_async_data();
  return key;
}
getAsync().then(key => {
  docData = key;
}, error => {
  console.log(error);
});

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
let selectedLocation: any = { lat: -31.55542202732198, lng: -54.54408893196694 };
function MyMapStreetComponentGuess({
  fenway,
  round,
  playerIndex
}: {
  fenway: google.maps.LatLngLiteral;
  round: number;
  playerIndex: number;
}) {
  const refMap: any = useRef();
  round_number = round;

  useEffect(() => {
    if (!updated) {
        let playerName = Object.keys(docData['playersInfo'])[round['playerIndex']];
        let geoPoint: any = Object.values(docData['playersInfo'][playerName][round['round_number']]['picking']);
        let lat = geoPoint[0];
        let lng = geoPoint[1];
        let latLngPosition = { lat: lat, lng: lng };
        map = new window.google.maps.Map(refMap.current, {
            center: fenway,
            zoom: 2,
            panControl: false,
            zoomControl: true,
            fullscreenControl: false,
            streetViewControl: false
        });

        Object.keys(docData['playersInfo']).forEach(function(key) {
            if (key == playerName) {
                marker = new google.maps.Marker({
                    position: latLngPosition,
                    title:"Correct Location",
                    label: {
                      text: playerName,
                      fontWeight: 'bold'
                    },
                    icon: {
                      url: "http://maps.google.com/mapfiles/kml/pal3/icon31.png",
                      labelOrigin: new window.google.maps.Point(8, -5)
                    }
                  });
                  marker.setMap(map);
            }
            else {
                let geoPoint: any = Object.values(docData['playersInfo'][key][round['round_number']]['guessings'][round['playerIndex']]);
                let lat = geoPoint[0];
                let lng = geoPoint[1];
                let latLngPosition = { lat: lat, lng: lng };
                marker = new google.maps.Marker({
                    position: latLngPosition,
                    title:key,
                    label: {
                      text: key,
                      fontWeight: 'bold'
                    },
                    icon: {
                      url: icons[random],
                      labelOrigin: new window.google.maps.Point(8, -5)
                    }
                  });
                  marker.setMap(map);
            }
        });
    }
  });

  async function updateLocation(positionClicked: google.maps.LatLng) {
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
    </div>
  );
}

export function RenderMapStreetGuess(round_number, pickingTime, playerIndex) {
  const fenway = { lat: -31.55542202732198, lng: -54.54408893196694 };
  return (
    <div>
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render}>
      <MyMapStreetComponentGuess fenway={fenway} round={round_number} playerIndex={playerIndex}/>
    </Wrapper>
    </div>
  );
}