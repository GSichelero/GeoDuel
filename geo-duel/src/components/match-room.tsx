import React, { useRef, useState, createElement, Component, useEffect } from "react";
import '../interface/create-room.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore, doc, getDoc, getDocFromServer } from "firebase/firestore"
import { setDoc, addDoc, updateDoc, deleteDoc, deleteField, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { RenderMapStreet } from '../components/map';
import { RenderMapStreetGuess } from '../components/guess';

import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Map, GoogleApiWrapper } from 'google-maps-react';

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

interface Room {
    players: number;
    places: number;
    pickingTime: number;
    guessingTime: number;
    playersInfo: any;
};

const search = window.location.search;
const params = new URLSearchParams(search); 
const roomName = String(params.get('room'));
const playerName = String(params.get('player'));

let currentRound = 1;
let pickingStage = true;
let guessingStage = false;
let resultsStage = false;

export function MatchRoom() {
    const [roomValues, setRoomValues] = useState<Room>({
        players: 0,
        places: 0,
        pickingTime: 0,
        guessingTime: 0,
        playersInfo: {}
    });

    const matchInfo = onSnapshot(doc(db, "matches", roomName), (doc) => {
        const playersPreviouslyConnected = Object.keys(roomValues.playersInfo).length || 0;

        const docData: any = doc.data();
        const playersConnected = Object.keys(docData?.playersInfo).length;

        let count_players_picking = 0
        Object.keys(docData['playersInfo']).forEach(function(key) {
            if (`${currentRound}` in docData['playersInfo'][key]) {
                if ('picking' in docData['playersInfo'][key][`${currentRound}`]) {
                    count_players_picking += 1;
                }
            }
        });

        if (playersConnected != playersPreviouslyConnected) {
            const values: Room = {
                players: docData?.players,
                places: docData?.places,
                pickingTime: docData?.pickingTime,
                guessingTime: docData?.guessingTime,
                playersInfo: docData?.playersInfo
            }
    
            setRoomValues(values);
        }
        else if (count_players_picking == docData.players && pickingStage == true) {
            const values: Room = {
                players: docData?.players,
                places: docData?.places,
                pickingTime: docData?.pickingTime,
                guessingTime: docData?.guessingTime,
                playersInfo: docData?.playersInfo
            }
    
            setRoomValues(values);
            guessingStage = true;
            pickingStage = false;
        }
    });

    if (Object.keys(roomValues.playersInfo).length < roomValues.players) {
        let playersNames: Array<string> = []
        Object.keys(roomValues.playersInfo).forEach(function(key) {
            playersNames.push(key);
        });

        return (
            <div className="container">
        
                <h1>Waiting for all players to connect...</h1>
                <img src={"globe-spinning.gif"} alt="this slowpoke moves"  width="320" />
                <h2>Players connected: {playersNames.toString()}</h2>
                <h2>Total players: {roomValues.players}</h2>
                <h2>Places: {roomValues.places}</h2>
                <h2>Time of the picking phase: {roomValues.pickingTime} minutes</h2>
                <h2>Time of the guessing phase: {roomValues.guessingTime} minutes</h2>
            
            </div>
        )
    }
    else if ((Object.keys(roomValues.playersInfo).length > roomValues.players) && (pickingStage == true)) {
        return (
            <div>
                <RenderMapStreet round_number={`${currentRound}`} pickingTime={roomValues.pickingTime} />
            </div>
        )
    }
    else if ((Object.keys(roomValues.playersInfo).length > roomValues.players) && (guessingStage == true)) {
        return (
            <div>
                <RenderMapStreetGuess round_number={`${currentRound}`} pickingTime={roomValues.guessingTime} correctLocation={{ lat: -31.55542202732198, lng: -54.54408893196694 }} />
                {/* <RenderMap /> */}
                {/* <RenderStreetView /> */}
                {/* <RenderMapStreet round_number={1} pickingTime={roomValues.pickingTime} /> */}
            </div>
        )
    }
    else {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        )
    }
}