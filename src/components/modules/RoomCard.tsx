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

const RoomCard = (roomData: Partial<UserModel | RoomModel> & Props) => {

    const { avatar, name, _id, isOnline, myData, shouldOpenChat = false } = roomData!
    const setter = useGlobalVariablesStore(state => state.setter)
    const rooms = useUserStore(state => state.rooms)
    const roomSocket = useSockets(state => state.rooms)

    const showProfile = () => {
        setter({ mockSelectedRoomData: roomData })
    }

    const openChat = () => {

        const roomHistory = rooms.find(data =>
            data._id === _id // For chanel & groups
            ||
            data.name === myData._id + '-' + _id // for private chats
            ||
            data.name === _id + '-' + myData._id // for private chats
        )

        const fuckYou: any = {
            admins: [myData._id, _id],
            avatar,
            createdAt: Date.now().toString(),
            creator: myData._id || _id,
            link: (Math.random() * 9999999).toString(),
            locations: [],
            medias: [],
            messages: [],
            name: myData._id + '-' + _id,
            participants: [myData, roomData],
            type: 'private',
            updatedAt: Date.now().toString()
        }

        roomSocket?.emit('joining', roomHistory?._id || roomData?._id, fuckYou)

        setter({ isRoomDetailsShown: false, selectedRoom: fuckYou })
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