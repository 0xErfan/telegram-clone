'use client'
import { IoMdArrowRoundBack } from "react-icons/io";
import Message from "../modules/Message"
import Image from "next/image";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import MessageSender from "./MessageSender";
import useSockets from "@/zustand/useSockets";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToBottom from "./ScrollToBottom";

const ChatContent = () => {

    let lastMsgRef = useRef<HTMLDivElement>(null)
    const { _id: myID, name: myName } = useUserStore(state => state)
    const { setter } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)
    const { selectedRoom, onlineUsers, isRoomDetailsShown } = useGlobalVariablesStore(state => state) || {}
    const [typings, setTypings] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLastMsgInView, setIsLastMsgInView] = useState(false);
    const [forceRender, setForceRender] = useState(false)
    const [replayData, setReplayData] = useState<string | null>(null)

    const {
        _id: roomID,
        messages,
        type,
        participants
    } = useGlobalVariablesStore(state => state.selectedRoom!);

    const { avatar, name, _id } = useMemo(() => {
        return type == 'private'
            ?
            (
                participants?.find((data: any) => data?._id !== myID)
                ||
                participants?.find((data: any) => data?._id == myID)
            )
            :
            (selectedRoom || '') as any
    }, [selectedRoom?._id])

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
            const isFromMe = messages[messages?.length - 1]?.sender._id === myID;
            if (isFromMe || isLastMsgInView) lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
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

        return () => {
            rooms?.off('newMessage')
            rooms?.off('seenMsg')
            rooms?.off('newMessageIdUpdate')
            rooms?.off('typing')
            rooms?.off('stop-typing')
        }
    }, [messages?.length])

    useEffect(() => {
        if (!isLoaded && _id && messages?.length) {
            const lastSeenMsg = [...messages].reverse().find(msg => msg.sender._id === myID || msg.seen.includes(myID))
            const lastSeenMsgElem = document.getElementsByClassName(lastSeenMsg?._id!)[0]
            lastSeenMsgElem.scrollIntoView()
            setIsLoaded(true)
        } // not working properly, the element get selected correctly but the scroll is not
    }, [messages?.length, isLoaded, myID])

    useEffect(() => {
        return () => {
            setIsLoaded(false)
            setTypings([])
        }
    }, [roomID])

    const checkIsLastMsgInView = (e: any) => {
        const isInView = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 0
        setIsLastMsgInView(isInView)
    }

    return (
        <section data-aos="fade-right" className="relative">

            <div className="flex items-center justify-between sticky top-0 border-b border-white/5 bg-chatBg z-30 py-3 xl:py-0 xl:h-[97px]">

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
                                    className="size-[55px] object-center object-cover rounded-full"
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
                                                    participants?.length + ' members, ' + (onlineMembersCount ? onlineMembersCount + ' online' : '')
                                            }
                                        </>
                                }
                            </div>

                        </div>

                    </div>

                </div>

                <div className="flex items-center gap-2 *:cursor-pointer ch:bg-white/[7%] ch:p-[10px] justify-end">
                    <div className="size-[44px] ch:size-full rounded-full flex-center">
                        <PiDotsThreeVerticalBold />
                    </div>
                </div>
            </div>

            <div
                onScroll={checkIsLastMsgInView}
                className="flex flex-col z-40 gap-2 ch:relative relative fillScreen md:pb-2 overflow-x-hidden overflow-y-auto noScrollWidth"
            >
                {
                    messages?.length
                        ?
                        messages.map((data, index) =>
                            <div
                                className={data._id}
                                key={data._id}
                                ref={index == messages.length - 1 ? lastMsgRef : null}
                            >
                                <Message
                                    addReplay={data => setReplayData(data)}
                                    myId={myID}
                                    isPv={type === 'private'}
                                    {...data}

                                />
                            </div>
                        )
                        :
                        <div data-aos="fade-left" className="flex-center size-full">
                            <p className="rounded-full w-fit text-[14px] py-1 px-3 text-center bg-white/[18%]">Select chat to start messaging</p>
                        </div>
                }

                <ScrollToBottom
                    count={notSeenMessages}
                    scrollToBottom={() => lastMsgRef.current?.scrollIntoView()}
                />

            </div>

            <MessageSender
                replayData={replayDataMsg}
                closeReplay={() => setReplayData(null)}
            />

            {/* shadow layout */}
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