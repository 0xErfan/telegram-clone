'use client'
import { MessageModel, RoomModel } from "@/@types/data.t"
import { getTimeFromDate } from "@/utils"
import { MdDone } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import useUserStore from "@/zustand/userStore"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"


export const ChatCard = ({
    messages,
    _id,
    name: roomName,
    type,
    avatar: roomAvatar,
    lastMsgData: lastMsgDataProp,
    participants
}: RoomModel & { lastMsgData: MessageModel }) => {

    const [draftMessage, setDraftMessage] = useState('')
    const [lastMsgData, setLastMsgData] = useState<MessageModel>(lastMsgDataProp)
    const { selectedRoom, onlineUsers } = useGlobalVariablesStore(state => state)
    const { _id: myID } = useUserStore(state => state) || ''
    const { rooms } = useSockets(state => state)

    const { avatar, name, _id: roomID } = useMemo(() => {
        // if type is private, we should view the user infos instead of room infos
        return type == 'private'
            ?
            (
                // if we couldn't find the participant id that is not equal to myID, so its the saved msgs room
                participants.find((data: any) => data?._id !== myID)
                ||
                participants.find((data: any) => data?._id == myID)
            )
            :
            ({ name: roomName, avatar: roomAvatar } as any)
    }, [])

    const isOnline = onlineUsers.some(data => { if (data.userID === roomID) return true })
    const notSeenMessages = messages?.length || null
    const latestMessageTime = getTimeFromDate(lastMsgData?.createdAt!)
    const isActive = selectedRoom?._id == _id
    const cardMessage = lastMsgData?.message ? lastMsgData?.message : lastMsgData?.voiceData ? 'Audio' : ''

    useEffect(() => { // not useful for now

        if (!lastMsgDataProp) return
        if (lastMsgDataProp?.roomID && lastMsgDataProp?.roomID !== selectedRoom?._id) return

        if (selectedRoom?.messages?.length) {
            for (let i = -1; i <= selectedRoom.messages.length; i--) {
                if (!selectedRoom.messages.at(i)?.hideFor?.includes(myID)) { // if we didn't removed the message for ourselves.
                    setLastMsgData(selectedRoom.messages.at(i)!)
                    break;
                }
            }
        }

    }, [selectedRoom?.messages?.length, myID, selectedRoom?._id, lastMsgDataProp?.roomID])

    useEffect(() => {

        rooms?.on('updateLastMsgData', ({ msgData, roomID }) => {
            _id === roomID && setLastMsgData(msgData)
        })

        return () => {
            rooms?.off('updateLastMsgData')
        }
        
    }, [_id])

    useEffect(() => {
        setDraftMessage(localStorage.getItem(_id) || '')
    }, [localStorage.getItem(_id), _id])

    const joinToRoom = () => { rooms?.emit('joining', _id) }

    return (
        <div
            onClick={joinToRoom}
            className={`flex items-center gap-3 relative h-[70px] cursor-pointer transition-all duration-300 rounded overflow-hidden ${isActive && 'px-3'}`}
        >
            <>
                {
                    avatar ?
                        <Image
                            className={`size-[50px] bg-center object-cover rounded-full`}
                            width={50}
                            height={50}
                            quality={100}
                            src={avatar}
                            alt="avatar"
                        />
                        :
                        <div className="size-[50px] shrink-0 bg-darkBlue rounded-full flex-center text-bold text-center text-white text-2xl">{name?.length && name[0]}</div>
                }

                {
                    (type === 'private' && isOnline)
                        ?
                        <span className={`absolute bg-lightBlue transition-all duration-300 ${isActive ? 'left-12' : 'left-9'} size-[10px] bottom-3 rounded-full`}></span>
                        : null
                }
            </>

            <div className="flex flex-col w-full ch:w-full gap-1 text-darkGray text-[14px]">

                <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-[16px] font-segoeBold line-clamp-1">{roomID == myID ? 'Saved messages' : name}</p>
                    <div className="flex gap-1 items-center">
                        {
                            (lastMsgData?.sender as any) === myID || lastMsgData?.sender?._id === myID
                                ?
                                <>
                                    {
                                        (lastMsgData?.seen.length || lastMsgDataProp?.seen?.length)
                                            ?
                                            <IoCheckmarkDone className="size-5 text-darkBlue" />
                                            :
                                            <MdDone className="size-5 text-darkBlue" />
                                    }
                                </>
                                : null
                        }
                        <p className="whitespace-nowrap">{latestMessageTime || null}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">

                    <div className="line-clamp-1 w-[80%]">
                        {
                            draftMessage?.length
                                ?
                                <span className="text-red-500">Draft: <span className="text-darkGray">{draftMessage}</span></span>
                                :
                                `${(lastMsgData?.sender as any) === myID || lastMsgData?.sender._id == myID ? 'you: ' : ''}${cardMessage}` || ''
                        }
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-center text-center w-min px-2 bg-darkBlue text-white rounded-full">{notSeenMessages}</div>
                        {/* pin */}
                        {/* <Image
                            priority
                            src='/shapes/pin.svg'
                            width={17}
                            height={17}
                            className="size-4 bg-center"
                            alt="pin shape"
                        /> */}
                    </div>

                </div>
            </div>

            <span className={`absolute flex items-center ${isActive ? 'opacity-100' : 'opacity-0'} transition-all activeChat inset-0 size-full bg-white/[6.05%]`}></span>

        </div>
    )
}
