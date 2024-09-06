import { RoomModel, UserModel } from "@/@types/data.t"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import useUserStore from "@/zustand/userStore"
import Image from "next/image"

interface Props {
    isOnline?: boolean
    myData: UserModel
    shouldOpenChat?: boolean
}

const RoomCard = (userTarget: Partial<UserModel> & Props) => {

    const { avatar, name, _id, isOnline, myData, shouldOpenChat = false } = userTarget
    const setter = useGlobalVariablesStore(state => state.setter)
    const { selectedRoom, mockSelectedRoomData } = useGlobalVariablesStore(state => state)
    const rooms = useUserStore(state => state.rooms)
    const roomSocket = useSockets(state => state.rooms)

    const roomData: Partial<RoomModel> = {
        admins: [myData._id, _id!],
        avatar,
        createdAt: Date.now().toString(),
        creator: myData._id,
        link: Date.now().toString(),
        locations: [],
        medias: [],
        messages: [],
        name: myData._id + '-' + _id,
        participants: [userTarget as any, myData],
        type: 'private',
        updatedAt: Date.now().toString()
    }

    const showProfile = () => {
        selectedRoom
            ?
            setter({ mockSelectedRoomData: roomData })
            :
            setter({ selectedRoom: roomData })
    }

    const openChat = () => {

        const roomHistory = rooms.find(data =>
            data.name === myData._id + '-' + _id
            ||
            data.name === _id + '-' + myData._id
        )

        if (roomHistory) {
            roomSocket?.emit('joining', roomHistory._id)
        } else {
            setter({
                selectedRoom: mockSelectedRoomData,
                mockSelectedRoomData: null
            })
        }

        setter({ isRoomDetailsShown: false })
    }

    return (
        <div
            onClick={shouldOpenChat ? openChat : showProfile}
            className="flex items-center gap-2 cursor-pointer"
        >
            {
                avatar ?
                    <Image
                        src={avatar}
                        className="cursor-pointer object-cover size-[45px] rounded-full"
                        width={45}
                        height={45}
                        alt="avatar"
                    />
                    :
                    <div className='flex-center bg-darkBlue rounded-full size-[45px] shrink-0 text-center font-bold text-2xl'>{name![0]}</div>
            }
            <div className="flex flex-col justify-between border-b border-black/40 w-full py-2">

                <p className="text-[17px] font-segoeBold">{name}</p>

                <p className="text-sm text-darkGray">
                    {
                        isOnline
                            ?
                            <span className="text-lightBlue">Online</span>
                            :
                            'last seen recently'
                    }
                </p>

            </div>

        </div>
    )
}

export default RoomCard;