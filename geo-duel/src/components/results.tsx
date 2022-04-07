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
let correctPosition: google.maps.LatLng;
function MyMapComponentResult({
  fenway,
  round,
  playerIndex,
  docData
}: {
  fenway: google.maps.LatLngLiteral;
  round: number;
  playerIndex: number;
  docData: any;
}) {
  const refMap: any = useRef();
  round_number = round;
  let playerName = Object.keys(round['docData']['playersInfo']).sort()[round['playerIndex']];
  let geoPoint: any = Object.values(round['docData']['playersInfo'][playerName][round['round_number']]['picking']);
  let lat = geoPoint[0];
  let lng = geoPoint[1];
  correctPosition = new window.google.maps.LatLng(lat, lng);

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

        Object.keys(round['docData']['playersInfo']).forEach(function(key) {
            if (key == playerName) {
                marker = new google.maps.Marker({
                    position: correctPosition,
                    title:key,
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
                let geoPoint: any = Object.values(round['docData']['playersInfo'][key][round['round_number']]['guessings'][round['playerIndex']]);
                let lat = geoPoint[0];
                let lng = geoPoint[1];
                let latLngPosition = { lat: parseFloat(lat), lng: parseFloat(lng) };
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
        updated = true;
    }
  });

  return (
    <div id="mapsContainer">
      <div ref={refMap} id="mapResult" />
      {
          Object.keys(round['docData']['playersInfo']).map(function(key) {
            if (key == playerName) {
              return (<h2>Location chosen by: {key}</h2>)
            }
            else {
                // https://developers.google.com/maps/documentation/javascript/reference/geometry#spherical.computeDistanceBetween
                // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
                // http://kml4earth.appspot.com/icons.html
                let geoPoint: any = Object.values(round['docData']['playersInfo'][key][round['round_number']]['guessings'][round['playerIndex']]);
                let lat = geoPoint[0];
                let lng = geoPoint[1];
                let latLngPosition: google.maps.LatLng = new window.google.maps.LatLng(lat, lng);
                let distanceFromCorrectPlace = window.google.maps.geometry.spherical.computeDistanceBetween(correctPosition, latLngPosition);
                let score = 10000 - ((Math.log(distanceFromCorrectPlace) / Math.log(2)) * 400);
                if (score < 0) {
                    score = 0;
                }
                else if (score > 10000) {
                  score = 10000;
                }
                return (<h2>{key}: {Math.round(score)} Points!</h2>)
            }
        })}
    </div>
  );
}

export function RenderMapResult(round_number, pickingTime, playerIndex, docData) {
  const fenway = { lat: -31.55542202732198, lng: -54.54408893196694 };
  return (
    <div>
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render} libraries={["geometry"]}>
      <MyMapComponentResult fenway={fenway} round={round_number} playerIndex={playerIndex} docData={docData}/>
    </Wrapper>
    </div>
  );
}