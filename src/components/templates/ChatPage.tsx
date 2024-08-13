import { IoReorderThreeOutline } from "react-icons/io5";

const ChatPage = () => {
    return (
        <div className="flex items-center bg-red-600 size-full ch:size-full h-screen overflow-hidden">

            <div className="flex-1 bg-leftBarBg">
                <div className="flex items-center gap-2 w-full">
                    <IoReorderThreeOutline />
                    <p>Chats</p>
                </div>
            </div>

            <div className="flex-[2.4] bg-chatBg">hi there</div>

        </div>
    )
}

export default ChatPage