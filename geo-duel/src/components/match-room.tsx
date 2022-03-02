import { useRef, useState } from "react";
import { Link } from 'react-router-dom';
import '../interface/create-room.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { setDoc, addDoc, updateDoc, deleteDoc, deleteField, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";

import { useCollectionData } from 'react-firebase-hooks/firestore';

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
};

const search = window.location.search;
const params = new URLSearchParams(search); 
const roomName = String(params.get('room'));
const playerName = String(params.get('player'));

export function MatchRoom() {
    const [roomValues, setRoomValues] = useState<Room>({
        players: 0,
        places: 0,
        pickingTime: 0,
        guessingTime: 0,
    });

    const matchInfo = onSnapshot(doc(db, "matches", roomName), (doc) => {
        const docData = doc.data();
        let locat = 'location';
        console.log(docData?.GSichelero.location._lat);
        console.log(docData?.GSichelero[locat]['_long']);
        if (roomValues.players != docData?.players) {
            const values: Room = {
                players: docData?.players,
                places: docData?.places,
                pickingTime: docData?.pickingTime,
                guessingTime: docData?.guessingTime,
            }
    
            setRoomValues(values);
        }
    });

    const getValues = async (event: any) => {
        event.preventDefault();
        const docRef = doc(db, "matches", roomName);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();
    
        const values: Room = {
            players: docData?.players,
            places: docData?.places,
            pickingTime: docData?.pickingTime,
            guessingTime: docData?.guessingTime,
        }

        setRoomValues(values);
    }

    if (roomValues.players < 5) {
        return (
            <div className="container">
        
            <h1>Waiting all the players connect...</h1>
            <img src={"globe-spinning.gif"} alt="this slowpoke moves"  width="320" />
            <h2>Players connected: {roomValues.players}</h2>
            <h2>Places: {roomValues.places}</h2>
            <h2>Time of the picking phase: {roomValues.pickingTime} minutes</h2>
            <h2>Time of the guessing phase: {roomValues.guessingTime} minutes</h2>
        
        </div>
        )
    }
    else {
        return (
            <div className="container">
            
                <h1>Waiting for all players to connect...</h1>
                <h4>Players connected: {roomValues.players}</h4>
                <img src={"globe-spinning.gif"} alt="this slowpoke moves"  width="320" />
            
            </div>
        )
    }
}