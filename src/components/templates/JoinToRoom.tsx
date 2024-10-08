import { RoomModel } from "@/@types/data.t"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useUserStore from "@/zustand/userStore"
import { Button } from "@nextui-org/button"
import { Socket } from "dgram"
import { useEffect, useRef, useState } from "react"
import RoomDetails from "./RoomDetails"

interface Props {
    roomData: RoomModel
    roomSocket: Socket
    userID: string
}

const JoinToRoom = ({ roomData, roomSocket, userID }: Props) => {

    const setter = useGlobalVariablesStore(state => state.setter)
    const { rooms, setter: userRoomsUpdater } = useUserStore(state => state)
    const [isLoading, setIsLoading] = useState(false)
    const timer = useRef<NodeJS.Timeout>()

    const joinRoom = () => {
        clearTimeout(timer.current!)

        setIsLoading(true)

        timer.current = setTimeout(() => {
            roomSocket.emit('joinRoom', { roomID: roomData._id, userID })
            clearTimeout(timer.current)
        }, 1000);
    }

    useEffect(() => {

        roomSocket.on('joinRoom', () => {
            setIsLoading(false)
        })

    }, [])

    return (
        <Button
            isLoading={isLoading}
            disabled={isLoading}
            onClick={joinRoom}
            style={{ color: 'white' }}
            className="bg-darkBlue rounded h-12 w-full m-auto text-xl"
        >
            {!isLoading && 'Join'}
        </Button>
    )
}

export default JoinToRoom