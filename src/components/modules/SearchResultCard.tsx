import { RoomModel, UserModel } from "@/@types/data.t"
import { scrollToMessage } from "@/utils"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import useUserStore from "@/zustand/userStore"
import Image from "next/image"

interface Props {
    myData: UserModel
    query: string
}

const highlightChars = (query: string, name: string) => {

    const lowerCaseQuery = query.toLowerCase()
    const lowerCaseName = name!.toLowerCase()

    const isQueryIncludesInName = lowerCaseName.includes(lowerCaseQuery)
    let startToHighlightIndex = lowerCaseName.indexOf(lowerCaseQuery)
    let endToHighlightIndex = startToHighlightIndex + lowerCaseQuery.length - 1


    return isQueryIncludesInName
        ?
        name?.split('').map((char, index) => {

            const isInHighlightRange = index >= startToHighlightIndex! && index <= endToHighlightIndex!
            return <span key={index} className={isInHighlightRange ? 'text-lightBlue' : ''}>{char}</span>

        })
        :
        <span>{name}</span>
}

const SearchResultCard = (roomData: Partial<RoomModel & { findBy?: keyof RoomModel }> & Props) => {

    const { avatar, name, _id, myData, findBy = null, query } = roomData!
    const { setter, isChatPageLoaded } = useGlobalVariablesStore(state => state)
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

        setTimeout(() => {
            roomData.messages?.length && scrollToMessage(roomData.messages[0]._id)
        }, isChatPageLoaded ? 800 : 1400);
    }

    return (
        <div
            onClick={openChat}
            className="flex items-center gap-2 cursor-pointer overflow-x-hidden"
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

                <p className="text-[17px] font-segoeBold line-clamp-1 overflow-ellipsis break-words">
                    {
                        (findBy == 'participants' || findBy == 'name')
                            ?
                            highlightChars(query, name!)
                            :
                            name
                    }
                </p>

                <p className="text-sm text-darkGray line-clamp-1 overflow-ellipsis break-words">
                    {
                        findBy == 'messages' && roomData.messages?.length
                            ?
                            highlightChars(query, roomData.messages[0].message)
                            :
                            'last seen recently'
                    }
                </p>

            </div>

        </div>
    )
}

export default SearchResultCard;