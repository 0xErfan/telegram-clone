import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { MdAttachFile } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { ChangeEvent, useRef, useState } from "react";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import useSockets from "@/zustand/useSockets";


const MessageSender = () => {

    const [text, setText] = useState('')
    const typingTimer = useRef<NodeJS.Timeout | null>(null)
    const { selectedRoom } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)
    const userData = useUserStore(state => state)

    const emitMessageHandler = () => {
        rooms?.emit('newMessage', {
            roomID: selectedRoom?._id,
            message: text,
            sender: userData
        })
        setText('')
    }

    const msgTextUpdater = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
        handleIsTyping()
    }

    const handleIsTyping = () => {

        clearTimeout(typingTimer?.current!)

        rooms?.emit('typing', ({ roomID: selectedRoom?._id, sender: userData }))

        typingTimer.current = setTimeout(() => {
            rooms?.emit('stop-typing', ({ roomID: selectedRoom?._id, sender: userData }))
        }, 2000);
    }

    return (
        <section className='sticky -mx-4 md:mx-0 flex-center bg-chatBg z-30 bottom-0 md:pb-3 inset-x-0'
        >
            <div className='flex items-center w-full px-2 ch:w-full gap-1 bg-white/[5.12%] h-[53px] rounded'>
                <BsEmojiSmile className="shrink-0 basis-[5%]" />
                <input
                    value={text}
                    onChange={msgTextUpdater}
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