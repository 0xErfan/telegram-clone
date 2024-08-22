'use client'
import { IoMdArrowRoundBack } from "react-icons/io";
import Message from "../modules/Message"
import Image from "next/image";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import { useEffect, useState } from "react";
import { MessageModel, RoomModel } from "@/@types/data.t";
import useUserStore from "@/zustand/userStore";

const ChatContent = () => {

    const [messages, setMessages] = useState<MessageModel[]>([])
    const [chatData, setChatData] = useState<RoomModel | null>(null)
    const { rooms, _id } = useUserStore(state => state)
    const { setter, selectedChat, socket } = useGlobalVariablesStore(state => state)

    useEffect(() => {

        socket?.on('message', data => {
            setMessages(prev => [...prev, { message: data.message, sender: data.sender, ...data }])
        })

        socket?.on('seen', data => console.log(data))

    }, [])

    useEffect(() => {
        const currentRoom = rooms.find(data => data._id == selectedChat)
        setChatData(currentRoom!)
        setMessages(currentRoom?.messages!)
    }, [selectedChat])

    return (
        <section>

            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 border-b border-white/5 bg-chatBg z-30 py-3 xl:py-0 xl:h-[97px]">

                <div className='flex items-center gap-5'>

                    <IoMdArrowRoundBack
                        onClick={() => setter({ selectedChat: null })}
                        className='cursor-pointer size-6 text-white/80'
                    />

                    <div className="flex items-start gap-3">
                        {
                            chatData?.avatar
                                ?
                                <Image
                                    src={chatData.avatar}
                                    width={50}
                                    height={50}
                                    alt="avatar"
                                />
                                :
                                <div className='size-full flex-center text-center font-bold text-2xl'>{chatData?.name[0]}</div>
                        }
                        <div className="flex justify-center flex-col gap-1">
                            <h3 className="font-bold text-[16px] font-segoeBold">{chatData?.name}</h3>
                            <p className="font-bold text-[14px] text-darkGray font-segoeBold">{chatData?.participants.length} members, 3 online</p>
                        </div>
                    </div>

                </div>

                <div className="flex items-center gap-2 *:cursor-pointer ch:bg-white/[7%] ch:p-[10px] justify-end">
                    <div className="size-[44px] ch:size-full rounded-full flex-center">
                        <PiDotsThreeVerticalBold />
                    </div>
                </div>
            </div>
            {/* Header */}

            <div className="flex flex-col gap-2 my-2 h-screen">
                {
                    // don't forget you only are rendering messages and not medias and...
                    messages?.length
                        ?
                        messages.map(data =>
                            <Message
                                myId={_id}
                                {...data}
                                key={data._id}
                            />
                        )
                        :
                        <div data-aos="fade-left" className="flex-center size-full">
                            <p className="rounded-full w-fit text-[14px] py-1 px-3 text-center bg-white/[18%]">Select chat to start messaging</p>
                        </div>
                }
            </div>

        </section>

    )
}

export default ChatContent;