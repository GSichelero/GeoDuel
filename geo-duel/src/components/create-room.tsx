import { useState } from "react";
import ReactDOM from "react-dom";

type CreateRoom = {
  username: string;
  roomName: string;
  playersNumber: number;
  placesNumber: number;
  pickingTime: number;
  guessingTime: number;
};

export function MyForm() {
  let createRoomInputs: CreateRoom;

  const [inputs, setInputs] = useState<CreateRoom>({
    username: 'user0',
    roomName: 'room0',
    playersNumber: 2,
    placesNumber: 2,
    pickingTime: 2,
    guessingTime: 2,
  });

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert(inputs);
  }

  return (
    <form onSubmit={handleSubmit}>
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
        <input type="submit" />
    </form>
  )
}