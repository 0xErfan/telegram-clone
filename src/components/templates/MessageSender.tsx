import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { MdAttachFile } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";

const MessageSender = () => {

    const [text, setText] = useState('')
    const socket = useGlobalVariablesStore(state => state.socket)

    const emitMessageHandler = () => {
        socket?.emit('message', { message: text })
        setText('')
    }

    return (
        <section className='sticky -mx-4 md:mx-0 flex-center bg-chatBg z-30 bottom-0 md:pb-3 inset-x-0'>
            <div className='flex items-center w-full px-2 ch:w-full gap-1 bg-white/[5.12%] h-[53px] rounded'>
                <BsEmojiSmile className="shrink-0 basis-[5%]" />
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
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