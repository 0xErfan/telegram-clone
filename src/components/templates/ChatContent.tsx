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

    const { _id } = useUserStore(state => state)
    const { setter } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)
    const lastMsgRef = useRef<HTMLDivElement>(null)

    const {
        _id: roomID,
        messages: roomMessages,
        avatar,
        name,
        participants
    } = useGlobalVariablesStore(state => state.selectedRoom!)

    const [messages, setMessages] = useState(roomMessages)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {

        rooms?.on('newMessage', newMsg => {
            setMessages(prev => [...prev, newMsg])
            setIsLoaded(true)
        })

        return () => {
            rooms?.off('newMessage')
            setIsLoaded(false)
        }
    }, [])

    useEffect(() => {
        setMessages(roomMessages)
        setIsLoaded(false)
    }, [roomID])

    useEffect(() => {
        lastMsgRef.current?.scrollIntoView({ behavior: isLoaded ? 'smooth' : 'instant' })
    }, [messages.length, isLoaded]) // scroll to latest not seen msg(add the seen check later hah)

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
                            <p className="font-bold text-[14px] text-darkGray font-segoeBold">{participants?.length} members, 3 online</p>
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