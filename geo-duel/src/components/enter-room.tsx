import { useState } from "react";
import '../interface/create-room.css';

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

  const handleSubmit = (event: any) => {
    event.preventDefault();
    alert(inputs.roomName);
  }

  return (
    <div className="container">
    <form id="contact" onSubmit={handleSubmit}>
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
        <button type="submit" id="contact-submit">Submit</button>
    </form>
    </div>
  )
}