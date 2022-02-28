import { useState } from "react";
import '../interface/create-room.css';

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
    <form id="contact" onSubmit={handleSubmit}>
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
        <button type="submit" id="contact-submit">Submit</button>
    </form>
    </div>
  )
}