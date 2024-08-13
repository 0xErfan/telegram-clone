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

            <>
                <Image
                    className={`size-[50px] bg-center rounded-full ${isOnline && 'onlineCircle'}`}
                    width={50}
                    height={50}
                    src='/images/favicon.ico' alt="avatar"
                />
                {
                    isOnline
                        ?
                        <span className={`absolute bg-lightBlue transition-all duration-300 ${isActive ? 'left-12' : 'left-9'} size-[10px] bottom-3 rounded-full`}></span>
                        : null
                }
            </>

            <div className="flex flex-col w-full ch:w-full gap-1 text-darkGray text-[14px] ">

                <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-[16px] font-segoeBold line-clamp-1">Sweetie</p>
                    <p>8:32 PM</p>
                </div>

                <div className="flex items-center justify-between">

                    <p className="line-clamp-1">Hi buddy how you doing?</p>

                    <div className="flex items-center justify-between w-14">
                        <div className="flex-center text-center w-min px-2 bg-darkBlue text-white rounded-full">23</div>
                        <Image
                            src='/shapes/pin.svg'
                            width={17}
                            height={17}
                            className="size-4 bg-center"
                            alt="pin shape"
                        />
                    </div>

                </div>
            </div>

            {/* Active chat */}
            <span className={`absolute flex items-center ${isActive ? 'opacity-100' : 'opacity-0'} transition-all duration-200 activeChat inset-0 size-full bg-white/[6.05%]`}></span>
            {/* Active chat */}

        </div>
    )
}
