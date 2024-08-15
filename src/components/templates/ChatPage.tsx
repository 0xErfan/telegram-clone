'use client'
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { ChatCard } from "../modules/ChatCard";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import MessageSender from "./MessageSender";
import { useState } from "react";
import ChatFolders from "../modules/ChatFolders";

const ChatPage = () => {

    const [isChatSelected, setIsChatSelected] = useState(true)

    return (
        <div className="flex items-center bg-leftBarBg size-full ch:size-full h-screen relative overflow-hidden">

            <div className={`flex-1 ${isChatSelected && 'hidden'} md:block bg-leftBarBg px-4 overflow-y-auto`}>

                <div className="w-full sticky top-0 bg-leftBarBg space-y-1 pt-1 border-b border-white/5 z-30">

                    <div className="flex items-center justify-between gap-6">

                        <div className="flex items-center flex-1 gap-5 mt-3 w-full text-white tex-[14px]">
                            <Image
                                className="cursor-pointer"
                                src="/shapes/hamberger.svg"
                                width={18}
                                height={15}
                                alt="hambergerMenu"
                            />
                            <h1 className="font-bold font-segoeBold">Telegram</h1>
                        </div>

                        {
                            's'
                                ?
                                <BiSearch className="cursor-pointer size-[23px] text-white/90 mt-3" />
                                :
                                <div className="flex items-center flex-[3] justify-betweens rounded h-10 px-4 border-b-2 border-white/[78.6%] mt-4 bg-white/[6.05%] text-white/[78.6%]">
                                    <input
                                        className="bg-transparent basis-[95%] outline-none"
                                        type="text"
                                        placeholder="Search"
                                    />
                                    <BiSearch className="basis-[5%] cursor-pointer shrink-0 size-[18px]" />
                                </div>
                        }
                    </div>

                    <div style={{ scrollbarWidth: "thin" }} className="flex items-center gap-5 overflow-x-auto h-10 text-darkGray ch:py-1 ch:w-fit">
                        <ChatFolders count={2} name="All" />
                        <ChatFolders count={32} name="Groups" />
                        <ChatFolders count={212} isActive name="Private" />
                        <ChatFolders count={5} name="Bots" />
                        <ChatFolders count={5} name="Bots" />
                    </div>

                </div>

                <div className="flex flex-col mt-2 overflow-auto">
                    {
                        Array(15).fill(0).map((_, index) => <ChatCard key={index} />)
                    }
                </div>

            </div>

            <div className={`flex-[2.4] bg-chatBg relative ${!isChatSelected && 'hidden'} md:block xl:rounded-l-2xl px-4 xl:px-8 text-white overflow-x-hidden`}>
                {/* add aos animations for messages */}
                {
                    'isChatSelected'
                        ?
                        <>
                            <ChatHeader />
                            <ChatContent />
                        </>
                        : <div className="flex-center size-full">
                            <p className="rounded-full w-fit text-[14px] py-1 px-3 text-center bg-white/[18%]">Select chat to start messaging</p>
                        </div>
                }

                <MessageSender />

            </div>

        </div>
    )
}

export default ChatPage