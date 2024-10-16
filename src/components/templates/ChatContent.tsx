'use client'
import { IoMdArrowRoundBack, IoIosArrowDown } from "react-icons/io";
import Message from "../modules/Message"
import Image from "next/image";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import MessageSender from "./MessageSender";
import useSockets from "@/zustand/useSockets";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToBottom from "./ScrollToBottom";
import JoinToRoom from "./JoinToRoom";
import { MessageModel } from "@/@types/data.t";
import useScrollChange from "@/hook/useScrollChange";

const ChatContent = () => {

    let lastMsgRef = useRef<HTMLDivElement>(null)
    let messageContainerRef = useRef<HTMLDivElement>(null)

    const { _id: myID, name: myName, setter: userDataUpdater, rooms: userRooms } = useUserStore(state => state)
    const { setter } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)
    const { selectedRoom, onlineUsers, isRoomDetailsShown } = useGlobalVariablesStore(state => state) || {}
    const [typings, setTypings] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLastMsgInView, setIsLastMsgInView] = useState(false);
    const [forceRender, setForceRender] = useState(false)
    const [replayData, setReplayData] = useState<string | null>(null)
    const [editData, setEditData] = useState<MessageModel | null>(null)
    const { canShow } = useScrollChange(messageContainerRef?.current!)

    const {
        _id: roomID,
        messages,
        type,
        participants
    } = selectedRoom!;

    const { avatar = '', name, _id } = useMemo(() => {
        return type == 'private'
            ?
            (
                participants?.find((data: any) => data?._id !== myID)
                ||
                participants?.find((data: any) => data?._id == myID)
                ||
                selectedRoom
            )
            :
            (selectedRoom || '') as any
    }, [selectedRoom?._id, type])

    const replayDataMsg = useMemo(() => {
        return messages?.find(msg => msg._id == replayData)
    }, [replayData, roomID])

    const onlineMembersCount = useMemo(() => {
        if (!onlineUsers?.length || !participants?.length) return 0
        return participants?.filter(pId => onlineUsers.some(data => { if (data.userID === pId) return true })).length
    }, [onlineUsers?.length, participants?.length])

    const notSeenMessages = useMemo(() => {

        let count = 0

        if (messages?.length) {
            const msgs = [...messages].filter(msg => msg.sender?._id !== myID && !msg.seen?.includes(myID))
            count = msgs.length
        }

        return count;
    }, [messages?.length, myID, forceRender])

    const manageScroll = () => {
        if (isLoaded) {
            const isFromMe = messages?.length && messages[messages.length - 1]?.sender?._id === myID;
            if (isFromMe || isLastMsgInView) lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const deleteRoom = () => {
        rooms?.emit('deleteRoom', roomID)
    }

    const checkIsLastMsgInView = (e: any) => {
        const isInView = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 0
        setIsLastMsgInView(isInView)
    }

    useEffect(() => {
        manageScroll()

        rooms?.on('newMessage', newMsg => {
            if (newMsg.roomID == roomID) {
                setter({
                    selectedRoom: {
                        ...selectedRoom,
                        messages: [...selectedRoom!.messages, newMsg]
                    }
                })
            }
        })

        rooms?.on('deleteMsg', msgID => {

            const msgToDeleteID = messages.findIndex(msg => msg._id === msgID)
            const updatedMessages = [...messages]
            updatedMessages?.splice(msgToDeleteID, 1)

            setter({
                selectedRoom: {
                    ...selectedRoom,
                    messages: updatedMessages,
                }
            })
        })

        rooms?.on('editMessage', ({ msgID, roomID, editedMsg }) => {

            const updatedMsg = messages.map(data => {
                if (data._id === msgID) {
                    data.message = editedMsg
                    data.isEdited = true
                }
                return data
            })

            setter({
                selectedRoom: {
                    ...selectedRoom,
                    messages: updatedMsg,
                }
            })

        })

        rooms?.on('newMessageIdUpdate', ({ tempID, _id }) => {

            const updatedMsgID = [...selectedRoom!.messages]

            updatedMsgID.some(msg => {
                if (msg._id === tempID) {
                    msg._id = _id
                    return true
                }
            })

            setter({
                selectedRoom: {
                    ...selectedRoom,
                    messages: updatedMsgID
                }
            })

        })

        rooms?.on('seenMsg', ({ msgID, seenBy }) => {

            const updatedSeenMessage = [...messages]

            updatedSeenMessage.some(msg => {
                if (msg._id === msgID) {
                    msg.seen = [...new Set([...msg.seen, seenBy])]
                    return true
                }
            })

            setter({
                selectedRoom: {
                    ...selectedRoom,
                    messages: updatedSeenMessage
                }
            })

            setForceRender(prev => !prev)
        })

        rooms?.on('joinRoom', ({ userID, roomID }) => {

            if (selectedRoom?._id == roomID) {

                const updatedRoom = {
                    ...selectedRoom,
                    participants: [...selectedRoom?.participants!, userID]
                }

                setter({ selectedRoom: updatedRoom })

                if (userID == myID) {
                    userDataUpdater({ rooms: [...userRooms, updatedRoom] })
                    rooms?.emit('joining', selectedRoom?._id)
                }

            }

        })

        rooms?.on('typing', data => {
            if (data.sender.name !== myName && data.roomID == roomID) {
                setTypings(prev => [...prev, data.sender.name as string])
            }
        })

        rooms?.on('stop-typing', data => {
            setTypings(prev => {
                return [...prev].filter(tl => tl !== data.sender.name && tl !== myName)
            })
        })

        rooms?.on('listenToVoice', ({ userID, voiceID, roomID }) => {

            if (selectedRoom?._id !== roomID) return

            messages.some(msg => {
                if (
                    msg._id === voiceID
                    &&
                    msg?.voiceData
                    &&
                    typeof msg.voiceData.playedBy == 'object'
                    &&
                    !msg.voiceData?.playedBy.includes(userID)
                ) {
                    msg.voiceData.playedBy = [...msg.voiceData.playedBy, userID]
                    setter({ messages: [...messages, msg] })
                    return true
                }
            })
        })

        return () => {
            rooms?.off('typing')
            rooms?.off('seenMsg')
            rooms?.off('newMessage')
            rooms?.off('stop-typing')
            rooms?.off('listenToVoice')
            rooms?.off('newMessageIdUpdate')
        }
    }, [messages?.length, participants?.length])

    useEffect(() => {
        if (!isLoaded && _id && messages?.length) {
            const lastSeenMsg = [...messages].reverse().find(msg => msg.sender._id === myID || msg.seen.includes(myID))
            const lastSeenMsgElem = document.getElementsByClassName(lastSeenMsg?._id!)[0]
            lastSeenMsgElem?.scrollIntoView()
            setIsLoaded(true)
        } // not working properly, the element get selected correctly but the scroll is not
    }, [messages?.length, isLoaded, myID])

    useEffect(() => {
        setter({ isChatPageLoaded: true })
        return () => {
            setIsLoaded(false)
            setTypings([])
        }
    }, [roomID])

    return (
        <section data-aos="fade-right" className="relative">

            <div className="flex items-center justify-between sticky top-0 border-b border-white/5 bg-chatBg z-50 py-2 md:py-3 xl:py-0 xl:h-[97px]">

                <div className='flex items-center gap-5'>

                    <IoMdArrowRoundBack
                        onClick={() => setter({ selectedRoom: null })}
                        className='cursor-pointer size-6 text-white/80'
                    />

                    <div
                        onClick={() => setter({ isRoomDetailsShown: !isRoomDetailsShown })}
                        className="flex items-start cursor-pointer gap-3"
                    >
                        {
                            avatar
                                ?
                                <Image
                                    src={avatar}
                                    width={55}
                                    height={55}
                                    className="size-[45px] mt-auto md:size-[55px] object-center object-cover rounded-full"
                                    alt="avatar"
                                />
                                :
                                <div className='flex-center bg-darkBlue rounded-full size-[50px] shrink-0 text-center font-bold text-2xl'>{name?.length && name[0]}</div>
                        }

                        <div className="flex justify-center flex-col gap-1">

                            <h3 className="font-bold text-[16px] font-segoeBold">{_id == myID ? 'Saved messages' : name}</h3>

                            <div className="font-bold text-[14px] text-darkGray font-segoeBold line-clamp-1 whitespace-normal text-nowrap">
                                {
                                    typings.length && [...typings].filter(tl => tl !== myName).length
                                        ?
                                        <div className="text-lightBlue whitespace-normal line-clamp-1">
                                            {typings.join(', ') + `${typings.length > 1 ? ' are' : ' is'} typing `}
                                            <span className="animate-ping font-extrabold font-segoeBold">...</span>
                                        </div>
                                        :
                                        <>
                                            {
                                                type == 'private'
                                                    ?
                                                    onlineUsers.some(data => { if (data.userID === _id) return true }) ? <span className="text-lightBlue">Online</span> : 'last seen recently'
                                                    :
                                                    participants?.length + ' members ' + (onlineMembersCount ? ', ' + onlineMembersCount + ' online' : '')
                                            }
                                        </>
                                }
                            </div>

                        </div>

                    </div>

                </div>

                <div className="flex items-center gap-2 *:cursor-pointer ch:p-[10px] justify-end">
                    <div className="size-[44px] ch:size-full rounded-full flex-center">
                        <PiDotsThreeVerticalBold onClick={deleteRoom} />
                    </div>
                </div>

            </div>

            <div
                onScroll={checkIsLastMsgInView}
                ref={messageContainerRef}
                className="flex flex-col gap-2 relative fillScreen mb-1 md:pb-2 overflow-x-hidden overflow-y-auto noScrollWidth"
            >

                {
                    messages?.length
                        ?
                        messages.map((data, index) =>
                            !data?.hideFor?.includes(myID)
                            &&
                            <div
                                className={data._id}
                                key={data._id}
                                ref={index == messages.length - 1 ? lastMsgRef : null}
                            >
                                <Message
                                    addReplay={replyData => setReplayData(replyData)}
                                    edit={() => setEditData(data)}
                                    myId={myID}
                                    isPv={type === 'private'}
                                    {...data}
                                />
                            </div>
                        )
                        :
                        <div data-aos="fade-left" className="flex-center size-full">
                            <p className="rounded-full w-fit text-[14px] py-1 px-3 text-center bg-white/[18%]">Send a message to start the chat bud</p>
                        </div>
                }

                <ScrollToBottom
                    count={notSeenMessages}
                    scrollToBottom={() => lastMsgRef.current?.scrollIntoView()}
                />

                <div
                    onClick={() => messageContainerRef?.current?.scrollTo({ top: messageContainerRef.current.scrollHeight, behavior: 'smooth' })}
                    className={`${(canShow && !isLastMsgInView) ? 'right-0' : '-right-32'} transition-all duration-300 size-12 fixed bottom-16 md:bottom-20 bg-[#00000094] backdrop-contrast-0 z-[99999999] cursor-pointer rounded-full flex items-center justify-center`}
                >
                    <IoIosArrowDown className="size-6 text-white" />
                </div>

            </div>

            {
                (type === 'private' || (participants as string[])?.includes(myID))
                    ?
                    <MessageSender
                        replayData={replayDataMsg}
                        editData={editData!}
                        closeEdit={() => setEditData(null)}
                        closeReplay={() => setReplayData(null)}
                    />
                    :
                    <JoinToRoom
                        roomData={selectedRoom!}
                        roomSocket={rooms as any}
                        userID={myID}
                    />
            }

            {
                isRoomDetailsShown &&
                <span
                    onClick={() => setter({ isRoomDetailsShown: false })}
                    className='inset-0 xl:static absolute transition-all duration-200 z-[999999]'
                >
                </span>
            }

        </section>
    )
}

export default ChatContent;