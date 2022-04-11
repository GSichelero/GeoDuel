import { useState, useEffect } from "react";
import '../interface/create-room.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore } from "firebase/firestore"
import { onSnapshot } from "firebase/firestore";
import { RenderMapStreet } from '../components/map';
import { RenderMapStreetGuess } from '../components/guess';
import { RenderMapResult } from '../components/results';
import { RenderMapEndGame } from '../components/end-game';
import { doc, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";

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
    currentRound: string;
};

const search = window.location.search;
const params = new URLSearchParams(search); 
const roomName = String(params.get('room'));
const playerName = String(params.get('player'));

let currentRound = 1;
let currentPlayer = 1;
let currentStage = 'loading';
let waitResult = false;
let allPlayersConnected = false;
let count_players_picking = 0;
let count_players_guessings = 0;
let previousStage = 'loading';
let values;
let oldValues;
let updateValues = false;

let docData: any = {
    players: 0,
    places: 0,
    pickingTime: 0,
    guessingTime: 0,
    playersInfo: {},
    currentRound: 'loading'
}; 
let playersConnected;

export function MatchRoom() {
    const [roomValues, setRoomValues] = useState<Room>({
        players: 0,
        places: 0,
        pickingTime: 0,
        guessingTime: 0,
        playersInfo: {},
        currentRound: 'loading'
    });

    if (values && updateValues) {
        if (oldValues) {
            if (values != oldValues) {
                setTimeout(() => {  setRoomValues(values); }, 2000);
            }
        }
        oldValues = values;
    }
    updateValues = false;

    const matchInfo = onSnapshot(doc(db, "matches", roomName), (docSnap) => {
        docData = docSnap.data();
        playersConnected = Object.keys(docData?.playersInfo).length;
    
        let playersPreviouslyConnected = Object.keys(roomValues.playersInfo).length || 0;
        previousStage = roomValues.currentRound || 'loading';

        if (playersConnected && playersConnected <= Number(docData.players) && allPlayersConnected == false && playersPreviouslyConnected != playersConnected) {
            if (playersConnected == Number(docData.players)) {
                allPlayersConnected = true;
            }
            values = {
                players: docData?.players,
                places: docData?.places,
                pickingTime: docData?.pickingTime,
                guessingTime: docData?.guessingTime,
                playersInfo: docData?.playersInfo,
                currentRound: `${Math.random() * 1000000}`
            }
            updateValues = true;
            setRoomValues(values);
        }

        count_players_picking = 0
        Object.keys(docData['playersInfo']).forEach(function(key) {
            if (`${currentRound}` in docData['playersInfo'][key]) {
                if ('picking' in docData['playersInfo'][key][`${currentRound}`]) {
                    count_players_picking += 1;
                }
            }
        });

        count_players_guessings = 0
        Object.keys(docData['playersInfo']).forEach(function(key) {
            if (`${currentRound}` in docData['playersInfo'][key]) {
                if ('guessings' in docData['playersInfo'][key][`${currentRound}`]) {
                    if (currentPlayer in docData['playersInfo'][key][`${currentRound}`]['guessings']) {
                        count_players_guessings += 1;
                    }
                }
            }
        });
        
        if (playersConnected > 0) {
            if (currentStage == 'loading' && playersConnected == Number(docData.players)) {
                values = {
                    players: docData?.players,
                    places: docData?.places,
                    pickingTime: docData?.pickingTime,
                    guessingTime: docData?.guessingTime,
                    playersInfo: docData?.playersInfo,
                    currentRound: `${Math.random() * 1000000}`
                }
                currentStage = 'picking';
                updateValues = true;
                setRoomValues(values);
            }
            
            if (currentStage == 'picking' && count_players_picking == Number(docData.players)) {
                values = {
                    players: docData?.players,
                    places: docData?.places,
                    pickingTime: docData?.pickingTime,
                    guessingTime: docData?.guessingTime,
                    playersInfo: docData?.playersInfo,
                    currentRound: `${Math.random() * 100000}`
                }
                currentStage = 'guessing';
                updateValues = true;
                setRoomValues(values);
            }

            if (currentStage == 'guessing' && count_players_guessings == Number(docData.players)) {
                values = {
                    players: docData?.players,
                    places: docData?.places,
                    pickingTime: docData?.pickingTime,
                    guessingTime: docData?.guessingTime,
                    playersInfo: docData?.playersInfo,
                    currentRound: `${Math.random() * 100000}`
                }
                currentStage = 'results';
                waitResult = false;
                updateValues = true;
                setRoomValues(values);
            }
        }

        if (currentStage == 'results' && !waitResult) {
            waitResult = true;
            if (currentPlayer < Number(docData.players)) {
                setTimeout(function() {
                    values = {
                        players: docData?.players,
                        places: docData?.places,
                        pickingTime: docData?.pickingTime,
                        guessingTime: docData?.guessingTime,
                        playersInfo: docData?.playersInfo,
                        currentRound: `${Math.random() * 100000}`
                    }
                    currentPlayer += 1;
                    currentStage = 'guessing';
                    updateValues = true;
                    setRoomValues(values);
                }, 20000);
            }
            else if (currentRound < Number(docData.places)) {
                setTimeout(function() {
                    values = {
                        players: docData?.players,
                        places: docData?.places,
                        pickingTime: docData?.pickingTime,
                        guessingTime: docData?.guessingTime,
                        playersInfo: docData?.playersInfo,
                        currentRound: `${Math.random() * 100000}`
                    }
                    currentPlayer = 1;
                    currentRound += 1;
                    currentStage = 'picking';
                    updateValues = true;
                    setRoomValues(values);
                }, 20000);
            }
            else if (currentRound == Number(docData.places) && currentPlayer == Number(docData.players)) {
                setTimeout(function() {
                    values = {
                        players: docData?.players,
                        places: docData?.places,
                        pickingTime: docData?.pickingTime,
                        guessingTime: docData?.guessingTime,
                        playersInfo: docData?.playersInfo,
                        currentRound: `${Math.random() * 100000}`
                    }
                    currentStage = 'end';
                    updateValues = true;
                    setRoomValues(values);
                }, 20000);
            }
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
    else if (Object.keys(roomValues.playersInfo).length == roomValues.players && roomValues.players > 0) {
        if (currentStage == 'picking') {
            return (
                <div>
                    <RenderMapStreet round_number={`${currentRound}`} pickingTime={roomValues.pickingTime} />
                </div>
            )
        }
        else if (currentStage == 'guessing') {
            return (
                <div>
                    <RenderMapStreetGuess round_number={`${currentRound}`} pickingTime={roomValues.guessingTime} playerIndex={currentPlayer} docData={roomValues} />
                </div>
            )
        }
        else if (currentStage == 'results') {
            return (
                <div>
                    <RenderMapResult round_number={`${currentRound}`} playerIndex={currentPlayer} docData={roomValues} />
                </div>
            )
        }
        else if (currentStage == 'end') {
            return (
                <div>
                    <RenderMapEndGame docData={roomValues} />
                </div>
            )
        }
        else {
            return (
                <div>
                    <h2>Loading...a</h2>
                </div>
            )
        }
    }
    else {
        return (
            <div>
                <h2>Loading...b</h2>
            </div>
        )
    }
}
