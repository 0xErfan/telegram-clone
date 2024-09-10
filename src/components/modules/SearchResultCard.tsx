import { RoomModel, UserModel } from "@/@types/data.t"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import useUserStore from "@/zustand/userStore"
import Image from "next/image"
import { useRef } from "react"

interface Props {
    myData: UserModel
    query: string
}

const SearchResultCard = (roomData: Partial<RoomModel & { findBy?: keyof RoomModel }> & Props) => {

    const { avatar, name, _id, myData, findBy = null, query } = roomData!
    const setter = useGlobalVariablesStore(state => state.setter)
    const rooms = useUserStore(state => state.rooms)
    const roomSocket = useSockets(state => state.rooms)

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
            creator: myData._id,
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

    const highlightChars = (() => {

        const lowerCaseQuery = query.toLowerCase()
        const lowerCaseName = name!.toLowerCase()

        const isQueryIncludesInName = lowerCaseName.includes(lowerCaseQuery)

        const startToHighlightIndex = lowerCaseName.indexOf(lowerCaseQuery)
        const endToHighlightIndex = lowerCaseName.lastIndexOf(lowerCaseQuery.at(-1)!)

        return isQueryIncludesInName && (findBy == 'name' || findBy == 'participants')
            ?
            name?.split('').map((char, index) => {
                const isInHighlightRange = index >= startToHighlightIndex! && index <= endToHighlightIndex!
                return <span className={isInHighlightRange ? 'text-lightBlue' : ''}>{char}</span>
            })
            :
            <span>{name}</span>
    }
    )()

    return (
        <div
            onClick={openChat}
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

                <p className="text-[17px] font-segoeBold line-clamp-1 overflow-ellipsis">
                    {highlightChars}
                </p>

                <p className="text-sm text-darkGray">
                    {
                        'isOnline'
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

export default SearchResultCard;