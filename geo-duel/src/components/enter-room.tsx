import { useState } from "react";
import '../interface/create-room.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { getFirestore } from "firebase/firestore"
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
  
  const db = getFirestore();

type EnterRoom = {
  username: string;
  roomName: string;
};

export function EnterRoomForm() {
  const [inputs, setInputs] = useState<EnterRoom>({
    username: '',
    roomName: '',
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const enterRoomFirestore = async (event: any) => {
    event.preventDefault();

    await setDoc(doc(db, "matches", inputs.roomName), {
      playersInfo: {
        [inputs.username]: {}
      }
    }, { merge: true });

    window.location.href = `/match?player=${inputs.username}&room=${inputs.roomName}`
  }

  return (
    <div className="container">
    <form id="contact" onSubmit={enterRoomFirestore}>
    <h3>Enter a Match Room</h3>
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
        <button type="submit" id="contact-submit">Enter Room</button>
    </form>
    </div>
  )
}