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
    const { _id, name: myName } = useUserStore(state => state)
    const { setter } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)
    const { selectedRoom, onlineUsers } = useGlobalVariablesStore(state => state) || {}
    const [typings, setTypings] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLastMsgInView, setIsLastMsgInView] = useState(false);
    const [forceRender, setForceRender] = useState(false)

    const {
        _id: roomID,
        messages,
        avatar,
        name,
        participants
    } = useGlobalVariablesStore(state => state.selectedRoom!)

    const onlineMembersCount = useMemo(() => {
        return onlineUsers.filter(data => participants.includes(data.userID)).length
    }, [onlineUsers.length])

    const notSeenMessages = useMemo(() => {

        let count = 0

        if (messages.length) {
            const msgs = [...messages].filter(msg => msg.sender._id !== _id && !msg.seen.includes(_id))
            count = msgs.length
        }

        return count;
    }, [messages.length, _id, forceRender])

    const manageScroll = () => {
        if (isLoaded) {
            const isFromMe = messages[messages?.length - 1]?.sender._id === _id;
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
        if (!isLoaded && _id && messages.length) {
            const lastSeenMsg = [...messages].reverse().find(msg => msg.sender._id === _id || msg.seen.includes(_id))
            const lastSeenMsgElem = document.getElementsByClassName(lastSeenMsg?._id!)[0]
            lastSeenMsgElem.scrollIntoView()
            setIsLoaded(true)
        } // not working properly, the element get selected correctly but the scroll is not
    }, [messages.length, isLoaded, _id])

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
        <section data-aos="fade-right">

            <div className="flex items-center justify-between sticky top-0 border-b border-white/5 bg-chatBg z-30 py-3 xl:py-0 xl:h-[97px]">

                <div className='flex items-center gap-5'>

                    <IoMdArrowRoundBack
                        onClick={() => setter({ selectedRoom: null })}
                        className='cursor-pointer size-6 text-white/80'
                    />

                    <div className="flex items-start gap-3">
                        {
                            avatar
                                ?
                                <Image
                                    src={avatar}
                                    width={50}
                                    height={50}
                                    alt="avatar"
                                />
                                :
                                <div className='flex-center bg-darkBlue rounded-full size-[50px] shrink-0 text-center font-bold text-2xl'>{name[0]}</div>
                        }
                        <div className="flex justify-center flex-col gap-1">

                            <h3 className="font-bold text-[16px] font-segoeBold">{name}</h3>

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
                                            {participants?.length + ' members, ' + (onlineMembersCount ? onlineMembersCount + ' online' : null)}
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
                className="flex flex-col z-40 gap-2 relative fillScreen md:pb-2 overflow-x-hidden overflow-y-auto noScrollWidth"
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
                                    myId={_id}
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

            <MessageSender />

        </section>
    )
}

export default ChatContent;