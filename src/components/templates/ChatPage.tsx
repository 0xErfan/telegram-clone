'use client'
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { ChatCard } from "../modules/ChatCard";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import MessageSender from "./MessageSender";
import { useEffect, useRef, useState } from "react";
import ChatFolders from "../modules/ChatFolders";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";

const ChatPage = () => {

    const chatFolderRef = useRef<HTMLDivElement>(null)
    const { selectedChat, socket } = useGlobalVariablesStore(state => state) || null
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        socket?.on('message', data => console.log(data))
    }, [])

    useEffect(() => {

        const handleScroll = (event: WheelEvent) => {
            event.preventDefault();
            const scrollAmount = event.deltaY < 0 ? -30 : 30
            chatFolderRef.current!.scrollBy({ left: scrollAmount });
        }

        chatFolderRef.current!.addEventListener('wheel', handleScroll);
        return () => chatFolderRef.current!?.removeEventListener('wheel', handleScroll);

    }, [])

    return (
        <div className="flex items-center bg-leftBarBg size-full ch:size-full h-screen relative overflow-hidden">

            <div data-aos-duration="400" data-aos='fade-right' className={`flex-1 ${selectedChat && 'hidden'} md:block bg-leftBarBg noScrollWidth px-4 overflow-y-auto`}>

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
                            !isSearchOpen
                                ?
                                <BiSearch onClick={() => setIsSearchOpen(true)} className="cursor-pointer size-[23px] text-white/90 mt-3" />
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

                    <div
                        ref={chatFolderRef}
                        className="flex items-center noScrollWidth gap-5 overflow-x-auto h-10 text-darkGray ch:py-1 ch:w-fit z-40"
                    >
                        <ChatFolders key={2} count={2} name="All" />
                        <ChatFolders key={32} count={32} name="Groups" />
                        <ChatFolders key={212} count={212} isActive name="Private" />
                        <ChatFolders key={5} count={5} name="Bots" />
                        <ChatFolders key={53} count={5} name="Bots" />
                    </div>

                </div>

                <div className="flex flex-col mt-2 overflow-auto">
                    {
                        Array(15).fill(0).map((_, index) => <ChatCard id={index} key={index} />)
                    }
                </div>

            </div>

            <div data-aos-duration="400" data-aos='fade-right' className={`flex-[2.4] bg-chatBg relative ${!selectedChat && 'hidden'} md:block xl:rounded-l-2xl px-4 xl:px-8 text-white overflow-x-hidden noScrollWidth`}>
                {/* add aos animations for messages */}
                {
                    selectedChat !== null
                        ?
                        <section data-aos="fade-right">
                            <ChatHeader />
                            <ChatContent />
                            <MessageSender />
                        </section>
                        : <div data-aos="fade-left" className="flex-center size-full">
                            <p className="rounded-full w-fit text-[14px] py-1 px-3 text-center bg-white/[18%]">Select chat to start messaging</p>
                        </div>
                }

            </div>

        </div>
    )
}

export default ChatPage