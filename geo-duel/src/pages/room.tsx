import { MyForm } from '../components/create-room';
import { EnterRoomForm } from '../components/enter-room';
import { MatchRoom } from '../components/match-room';

export function HomeForm() {
    return (
        <MyForm></MyForm>
    )
}

export function EnterRoom() {
    return (
        <EnterRoomForm></EnterRoomForm>
    )
}

export function Match() {
    return (
        <MatchRoom></MatchRoom>
    )
}