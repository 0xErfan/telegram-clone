import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import { ChatCard } from "../modules/ChatCard";
import ChatHeader from "./ChatHeader";
import ChatContent from "./ChatContent";
import MessageSender from "./MessageSender";

const ChatPage = () => {
    return (
        <div className="flex items-center bg-leftBarBg size-full ch:size-full h-screen relative overflow-hidden">

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
                            className="bg-transparent basis-[95%] outline-none"
                            type="text"
                            placeholder="Search"
                        />
                        <BiSearch className="basis-[5%] cursor-pointer shrink-0 size-[18px]" />
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100vh - 80px)] overflow-auto">
                    {
                        Array(5).fill(0).map((_, index) => <ChatCard key={index} />)
                    }
                </div>

            </div>

            <div className="flex-[2.4] bg-chatBg relative rounded-l-2xl px-4 xl:px-8 text-white overflow-x-hidden">
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