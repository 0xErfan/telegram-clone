import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { ChatCard } from "../modules/ChatCard";
import ChatHeader from "./ChatHeader";

const ChatPage = () => {
    return (
        <div className="flex items-center bg-leftBarBg size-full ch:size-full h-screen overflow-hidden">

            <div className="flex-1 bg-leftBarBg px-4 overflow-y-auto">

                <div className="sticky top-0 bg-leftBarBg py-4 z-30">
                    <div className="flex items-center gap-3 w-full text-white tex-[14px]">
                        <Image
                            className="cursor-pointer"
                            src="/shapes/hamberger.svg"
                            width={18}
                            height={15}
                            alt="hambergerMenu"
                        />
                        <p>Chats</p>
                    </div>

                    <div className="flex items-center justify-betweens rounded py-2 px-4 border-b-2 border-white/[78.6%] mt-4 bg-white/[6.05%] text-white/[78.6%]">
                        <input
                            className="bg-transparent flex-[20] outline-none"
                            type="text"
                            placeholder="Search"
                        />
                        <BiSearch className="flex-1 cursor-pointer size-[18px]" />
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100vh - 80px)] overflow-auto">
                    {
                        Array(5).fill(0).map((_, index) => <ChatCard key={index} />)
                    }
                </div>

            </div>

            <div className="flex-[2.4] bg-chatBg relative rounded-l-2xl px-8 text-white overflow-x-hidden">

                <ChatHeader />

            </div>

        </div>
    )
}

export default ChatPage