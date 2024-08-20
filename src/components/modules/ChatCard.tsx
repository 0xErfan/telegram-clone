'use client'
import { RoomModel } from "@/@types/data.t"
import { getTimeFromDate } from "@/utils"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import Image from "next/image"
import { useState } from "react"

export const ChatCard = ({ messages, _id, participants, name, avatar }: RoomModel) => {

    const [isOnline, setIsOnline] = useState(true)
    const { selectedChat, setter } = useGlobalVariablesStore(state => state)

    const isActive = selectedChat == _id
    const latestMessageTime = getTimeFromDate(new Date(messages[messages.length]?.createdAt))
    const notSeenMessages = messages.filter(data => !data.seen).length || null

    return (
        <div
            onClick={() => setter({ selectedChat: _id })}
            className={`flex items-center gap-3 relative h-[70px] cursor-pointer transition-all duration-300 rounded overflow-hidden ${isActive && 'px-3'}`}
        >
            <>
                {
                    avatar ?
                        <Image
                            className={`size-[50px] bg-center rounded-full ${isOnline && 'onlineCircle'}`}
                            width={50}
                            height={50}
                            src={avatar}
                            alt="avatar"
                        />
                        :
                        <div className="size-full flex-center text-bold text-center text-2xl">{name[0]}</div>
                }
                {
                    isOnline
                        ?
                        <span className={`absolute bg-lightBlue transition-all duration-300 ${isActive ? 'left-12' : 'left-9'} size-[10px] bottom-3 rounded-full`}></span>
                        : null
                }
            </>

            <div className="flex flex-col w-full ch:w-full gap-1 text-darkGray text-[14px]">

                <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-[16px] font-segoeBold line-clamp-1">{name}</p>
                    <p>{latestMessageTime ?? null}</p>
                </div>

                <div className="flex items-center justify-between">

                    <p className="line-clamp-1">{'hi this is erfan'}</p>

                    <div className="flex items-center justify-between w-14">
                        <div className="flex-center text-center w-min px-2 bg-darkBlue text-white rounded-full">{notSeenMessages}</div>
                        <Image
                            priority
                            src='/shapes/pin.svg'
                            width={17}
                            height={17}
                            className="size-4 bg-center"
                            alt="pin shape"
                        />
                    </div>

                </div>
            </div>

            <span className={`absolute flex items-center ${isActive ? 'opacity-100' : 'opacity-0'} transition-all duration-200 activeChat inset-0 size-full bg-white/[6.05%]`}></span>

        </div>
    )
}
