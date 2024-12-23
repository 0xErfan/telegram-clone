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
    _id,
    name: roomName,
    type,
    avatar: roomAvatar,
    lastMsgData: lastMsgDataProp,
    notSeenCount: currentNotSeenCount,
    participants
}: RoomModel & { lastMsgData: MessageModel, notSeenCount: number }) => {

    const [draftMessage, setDraftMessage] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [lastMsgData, setLastMsgData] = useState<MessageModel>(lastMsgDataProp)
    const [notSeenCount, setNotSeenCount] = useState(currentNotSeenCount)
    const { selectedRoom, onlineUsers, forceRender, setter: globalVarSetter } = useGlobalVariablesStore(state => state)
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
    }, [myID, participants, type])

    const isOnline = onlineUsers.some(data => { if (data.userID === roomID) return true })
    const latestMessageTime = getTimeFromDate(lastMsgData?.createdAt!)
    const cardMessage = lastMsgData?.message ? lastMsgData?.message : lastMsgData?.voiceData ? 'Audio' : ''

    const joinToRoom = () => {
        setIsActive(true)
        rooms?.emit('joining', _id)
    }

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

        const handleUpdateLastMsgData = ({ msgData, roomID }: { msgData: MessageModel, roomID: string }) => {
            if (_id === roomID && msgData) {
                setLastMsgData(msgData);
            }
        };

        const handleSeenMsg = ({ roomID }: { roomID: string }) => {
            if (roomID === _id) {
                setNotSeenCount(prev => prev - 1);
                // globalVarSetter({ forceRender: !forceRender });
            }
        };

        const handleNewMessage = ({ roomID, sender }: { roomID: string, sender: string | { _id: string } }) => {
            if (roomID === _id) {
                if ((typeof sender === 'string' && sender !== myID) || (typeof sender == 'object' && '_id' in sender && sender?._id) !== myID) {
                    setNotSeenCount(prev => prev + 1);
                }
                // globalVarSetter({ forceRender: !forceRender });
            }
        };

        setIsActive(selectedRoom?._id === _id);

        rooms?.on('updateLastMsgData', handleUpdateLastMsgData);
        rooms?.on('seenMsg', handleSeenMsg);
        rooms?.on('newMessage', handleNewMessage);

        return () => {
            rooms?.off('updateLastMsgData', handleUpdateLastMsgData);
            rooms?.off('seenMsg', handleSeenMsg);
            rooms?.off('newMessage', handleNewMessage);
        };

    }, [_id, selectedRoom?._id, myID, rooms]);

    useEffect(() => {
        setDraftMessage(localStorage.getItem(_id) || '')
    }, [localStorage.getItem(_id), _id])

    useEffect(() => {
        window.updateCount = (roomTargetId: string) => {
            if (roomID != roomTargetId) return;
            setNotSeenCount(notSeenCount - 1)
        }
    }, [notSeenCount, roomID])

    useEffect(() => setNotSeenCount(currentNotSeenCount), [currentNotSeenCount])

    return (
        <div
            onClick={joinToRoom}
            className={`flex items-center gap-3 relative h-[70px] cursor-pointer transition-all duration-300 rounded overflow-hidden ${isActive && 'px-3'}`}
        >
            <>
                {
                    avatar ?
                        <Image
                            className={`size-[50px] bg-center object-cover rounded-full shrink-0`}
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
                        <span className={`absolute bg-lightBlue transition-all duration-300 ${isActive ? 'left-12' : 'left-9'} size-3 bottom-3 rounded-full border-[2px] border-chatBg`}></span>
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

                        {
                            notSeenCount > 0
                                ?
                                <div data-aos='zoom-in' className="flex-center text-center w-min px-2 bg-darkBlue text-white rounded-full">{notSeenCount}</div>
                                : null
                        }

                        {
                            lastMsgData?.pinnedAt
                                ?
                                <div key={lastMsgData?.pinnedAt} data-aos='zoom-in'>
                                    <Image
                                        priority
                                        src='/shapes/pin.svg'
                                        width={17}
                                        height={17}
                                        className="size-4 bg-center"
                                        alt="pin shape"
                                    />
                                </div>
                                : null
                        }

                    </div>

                </div>
            </div>

            <span className={`absolute flex items-center ${isActive ? 'opacity-100' : 'opacity-0'} transition-all activeChat inset-0 size-full bg-white/[6.05%]`}></span>

        </div>
    )
}
