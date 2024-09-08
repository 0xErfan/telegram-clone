import { RoomModel } from "@/@types/data.t"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import { Button } from "@nextui-org/button"
import { Socket } from "dgram"
import { useEffect, useState } from "react"

interface Props {
    roomData: RoomModel
    roomSocket: Socket
    userID: string
}

const JoinToRoom = ({ roomData, roomSocket, userID }: Props) => {

    const setter = useGlobalVariablesStore(state => state.setter)
    const [isLoading, setIsLoading] = useState(false)

    const joinRoom = () => {
        setIsLoading(true)
        roomSocket.emit('joinRoom', { roomID: roomData._id, userID })
    }

    useEffect(() => {
        roomSocket.on('joinRoom', ({ userID }) => {
            setter({
                selectedRoom:
                {
                    ...roomData,
                    participants: [...roomData?.participants!, userID]
                }
            })
            setIsLoading(true)
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