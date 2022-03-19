import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import '../interface/create-room.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore } from "firebase/firestore"
import { doc, setDoc, addDoc, updateDoc, deleteDoc, deleteField } from "firebase/firestore";

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { render } from "react-dom";

firebase.initializeApp({
  apiKey: "AIzaSyCKrzHCFzQSADP43iFN2e_gduzX-1TTmj8",
  authDomain: "geoduel-dc6b2.firebaseapp.com",
  projectId: "geoduel-dc6b2",
  storageBucket: "geoduel-dc6b2.appspot.com",
  messagingSenderId: "863497247016",
  appId: "1:863497247016:web:d1b3082d2cc526353bd81d",
  measurementId: "G-DNZY4K9H73"
})

const db = getFirestore();


type CreateRoom = {
  username: string;
  roomName: string;
  playersNumber: number;
  placesNumber: number;
  pickingTime: number;
  guessingTime: number;
};

export function MyForm() {
  const [inputs, setInputs] = useState<CreateRoom>({
    username: '',
    roomName: '',
    playersNumber: 0,
    placesNumber: 0,
    pickingTime: 0,
    guessingTime: 0,
  });

  const createRoomInFirestore = async (event: any) => {
    event.preventDefault();

    await setDoc(doc(db, "matches", inputs.roomName), {
      players: inputs.playersNumber,
      places: inputs.placesNumber,
      pickingTime: inputs.pickingTime,
      guessingTime: inputs.guessingTime,
      playersInfo: {
        [inputs.username]: {}
      }
    });

    window.location.href = `/match?player=${inputs.username}&room=${inputs.roomName}`
  }

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert(inputs.roomName);
  }

  return (
    <div className="container">
    <form id="contact" onSubmit={createRoomInFirestore}>
    <h3>Create a Match Room</h3>
      <label>Your Name:
      <input 
        type="text" 
        name="username" 
        value={inputs.username || ""} 
        onChange={handleChange}
      />
      </label>
      <label>Room Name:
      <input 
        type="text" 
        name="roomName" 
        value={inputs.roomName || ""} 
        onChange={handleChange}
      />
      </label>
      <label>Number of players:
        <input 
          type="number" 
          name="playersNumber" 
          value={inputs.playersNumber || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Number of places per match:
        <input 
          type="number" 
          name="placesNumber" 
          value={inputs.placesNumber || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Time of the picking phase (minutes):
        <input 
          type="number" 
          name="pickingTime" 
          value={inputs.pickingTime || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Time of the guessing phase (minutes):
        <input 
          type="number" 
          name="guessingTime" 
          value={inputs.guessingTime || ""} 
          onChange={handleChange}
        />
        </label>
        <button type="submit" id="contact-submit">Create Room</button>
    </form>
    </div>
  )
}