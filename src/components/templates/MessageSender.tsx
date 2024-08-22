import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { MdAttachFile } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { useEffect, useState } from "react";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import { RoomModel } from "@/@types/data.t";


const MessageSender = () => {

    const [text, setText] = useState('')
    const [chatData, setChatData] = useState<RoomModel | null>(null)

    const { socket, selectedChat } = useGlobalVariablesStore(state => state)
    const { rooms, _id } = useUserStore(state => state)

    const emitMessageHandler = () => {
        socket?.emit('message', {
            roomID: chatData?._id,
            messageData: { message: text, sender: _id }
        })
        setText('')
    }

    return (
        <section className='sticky -mx-4 md:mx-0 flex-center bg-chatBg z-30 bottom-0 md:pb-3 inset-x-0'
        >
            <div className='flex items-center w-full px-2 ch:w-full gap-1 bg-white/[5.12%] h-[53px] rounded'>
                <BsEmojiSmile className="shrink-0 basis-[5%]" />
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyUp={e => e.key == "Enter" && text.trim().length && emitMessageHandler()}
                    className="bg-transparent resize-none outline-none h-full flex-center"
                    type="text"
                    placeholder="Message"
                />
                <MdAttachFile className="shrink-0 basis-[5%] size-5 cursor-pointer" />
                {
                    text.trim().length
                        ?
                        <IoIosSend onClick={emitMessageHandler} className="shrink-0 basis-[5%] size-6 cursor-pointer text-lightBlue rotate-45" />
                        :
                        <PiMicrophoneLight className="shrink-0 basis-[5%] size-6 cursor-pointer" />
                }
            </div>
        </section>
    )
}

export default MessageSender;