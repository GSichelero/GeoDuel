import React, { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore, doc } from "firebase/firestore"
import { setDoc } from "firebase/firestore";

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
let selectedLocation: any = { lat: -31.55542202732198, lng: -54.54408893196694 };
function MyMapStreetComponentGuess({
  fenway,
  round,
  pickingTime,
  playerIndex,
  docData
}: {
  fenway: google.maps.LatLngLiteral;
  round: number;
  pickingTime: any;
  playerIndex: number;
  docData: any;
}) {
  const refMapGuess: any = useRef();
  const refPanoGuess: any = useRef();
  round_number = round;

  useEffect(() => {
    if (!updated) {
      let playerName = Object.keys(round['docData']['playersInfo']).sort()[round['playerIndex'] - 1];
      let geoPoint: any;
      while (!geoPoint) {
        try {
          geoPoint = Object.values(round['docData']['playersInfo'][playerName][round['round_number']]['picking']);
        } catch (error) {
          console.log(error);
        }
      }
      geoPoint = Object.values(round['docData']['playersInfo'][playerName][round['round_number']]['picking']);
      let lat = geoPoint[0];
      let lng = geoPoint[1];
      let latLngPosition = { lat: lat, lng: lng };
      map = new window.google.maps.Map(refMapGuess.current, {
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

      panorama = new window.google.maps.StreetViewPanorama(refPanoGuess.current, {
          position: latLngPosition,
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
          showRoadLabels: false
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
      <div ref={refMapGuess} id="map" />
      <div ref={refPanoGuess} id="pano" />
    </div>
  );
}

function CalculateTimeLeftGuess(round, pickingTime) {
  round_number = round;
  const [seconds, setSeconds]: any = useState(round["round"]["pickingTime"] * 60);
  let stopCount: boolean = false;
  updated = false;

  useEffect(() => {
    if (seconds > 0 && !stopCount && updated) {
      const timer = () => setTimeout(() => setSeconds(seconds - 1), 1000);
      const timerId = timer();
      return () => {
        clearTimeout(timerId);
      };
    }
    else if (seconds > 0 && !stopCount && !updated) {
      if (playerName == Object.keys(round["round"]['docData']['playersInfo']).sort()[round["round"]['playerIndex'] -1]) {
        stopCount = true;
        updated = true;
        setSeconds('###### The other players are guessing your location, wait a little! ######');
        setDoc(doc(db, "matches", roomName), {
          playersInfo: {
            [playerName]: {
              [`${String(round["round"]["round_number"])}`]: {
                guessings: {
                  [round["round"]['playerIndex']]: new firebase.firestore.GeoPoint(0, 0)
                }
              }
            }
          }
        }, { merge: true });
      }
      else{
        updated = true;
        const timer = () => setTimeout(() => setSeconds(seconds - 1), 1000);
        const timerId = timer();
        return () => {
          clearTimeout(timerId);
        };
      }
    }
    else if (seconds == 0) {
      stopCount = true;
      setSeconds('###### Your chosen location was sent! ######');
      setDoc(doc(db, "matches", roomName), {
        playersInfo: {
          [playerName]: {
            [`${String(round["round"]["round_number"])}`]: {
              guessings: {
                [round["round"]['playerIndex']]: new firebase.firestore.GeoPoint(selectedLocation.lat(), selectedLocation.lng())
              }
            }
          }
        }
      }, { merge: true });
    }
    else if(playerName != Object.keys(round["round"]['docData']['playersInfo']).sort()[round["round"]['playerIndex'] - 1]) {
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

export function RenderMapStreetGuess(round_number, pickingTime, playerIndex, docData) {
  const fenway = { lat: +10.55542202732198, lng: -54.54408893196694 };
  return (
    <div>
    <Wrapper apiKey="AIzaSyDaopI6hRGw8i5DlhA5lAiCIuZ-qoBH3AE" render={render} libraries={["geometry"]}>
      <MyMapStreetComponentGuess fenway={fenway} round={round_number} pickingTime={pickingTime} playerIndex={playerIndex} docData={docData}/>
      <CalculateTimeLeftGuess round={round_number} pickingTime={pickingTime}/>
    </Wrapper>
    </div>
  );
}