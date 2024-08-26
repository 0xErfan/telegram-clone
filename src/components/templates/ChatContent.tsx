'use client'
import { IoMdArrowRoundBack } from "react-icons/io";
import Message from "../modules/Message"
import Image from "next/image";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import MessageSender from "./MessageSender";
import useSockets from "@/zustand/useSockets";
import { useEffect, useRef, useState } from "react";

const ChatContent = () => {

    const { _id, name: myName } = useUserStore(state => state)
    const { setter } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)
    const lastMsgRef = useRef<HTMLDivElement>(null)
    const [typings, setTypings] = useState<string[]>([])

    const {
        _id: roomID,
        messages,
        avatar,
        name,
        participants
    } = useGlobalVariablesStore(state => state.selectedRoom!)

    const selectedRoom = useGlobalVariablesStore(state => state.selectedRoom!)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: isLoaded ? 'smooth' : 'instant' })
    }, [messages.length, isLoaded]) // scroll to latest not seen msg(add the seen check later hah)

    useEffect(() => {
        setIsLoaded(false)

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
            rooms?.off('typing')
            rooms?.off('stop-typing')
            setTypings([])
        }
    }, [roomID])

    useEffect(() => {

        rooms?.on('newMessage', newMsg => {
            setter({
                selectedRoom: {
                    ...selectedRoom,
                    messages: [...selectedRoom.messages, newMsg]
                }
            })
            setIsLoaded(true)
        })

        rooms?.on('newMessageIdUpdate', ({ tempID, _id }) => {

            const updatedMsgID = [...selectedRoom.messages]

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
            setIsLoaded(true)
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

        })

        return () => {
            rooms?.off('newMessage')
            rooms?.off('seenMsg')
            rooms?.off('newMessageIdUpdate')
            setIsLoaded(false)
        }
    }, [selectedRoom.messages?.length])

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

                            <p className="font-bold text-[14px] text-darkGray font-segoeBold">

                                {participants?.length + ' members, '}

                                {
                                    typings.length && [...typings].filter(tl => tl !== myName).length
                                        ?
                                        typings.join(', ') + `${typings.length > 1 ? ' are' : ' is'} typing`
                                        :
                                        '2 online'
                                }
                            </p>

                        </div>
                    </div>

                </div>

                <div className="flex items-center gap-2 *:cursor-pointer ch:bg-white/[7%] ch:p-[10px] justify-end">
                    <div className="size-[44px] ch:size-full rounded-full flex-center">
                        <PiDotsThreeVerticalBold />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 my-2 h-full">
                {
                    // don't forget you only are rendering messages and not medias and...
                    messages?.length
                        ?
                        messages.map((data, index) =>
                            <div
                                key={data._id}
                                ref={messages.length - 1 == index ? lastMsgRef : null}
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
            </div>

            <MessageSender />

        </section>

    )
}

export default ChatContent;