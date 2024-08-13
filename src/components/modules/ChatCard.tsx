'use client'
import Image from "next/image"
import { useState } from "react"

export const ChatCard = () => {

    const [isOnline, setIsOnline] = useState(true)
    const [isActive, setIsActive] = useState(false)

    return (
        <div
            onClick={() => setIsActive(prev => !prev)}
            className={`flex items-center gap-3 relative h-[70px] cursor-pointer transition-all duration-300 rounded overflow-hidden ${isActive && 'px-3'}`}
        >

            <Image
                className={`size-[50px] bg-center rounded-full ${isOnline && 'onlineCircle'}`}
                width={50}
                height={50}
                src='/images/favicon.ico' alt="avatar"
            />

            <div className="flex flex-col w-full ch:w-full gap-1 text-darkGray text-[14px] ch:ch:line-clamp-1">

                <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-[16px] font-segoeBold">Sweetie</p>
                    <p>8:32 PM</p>
                </div>

                <div className="flex items-center justify-between">
                    <p>I love You so fucking much</p>
                    {'' && 'show pin(pin or replay svg)'}
                </div>
            </div>

            {/* Active chat */}
            <span className={`absolute flex items-center ${isActive ? 'opacity-100' : 'opacity-0'} transition-all duration-200 activeChat inset-0 size-full bg-white/[6.05%]`}></span>
            {/* Active chat */}

        </div>
    )
}
