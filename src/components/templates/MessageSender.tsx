import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { MdAttachFile } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import useSockets from "@/zustand/useSockets";


const MessageSender = () => {

    const [text, setText] = useState('')
    const typingTimer = useRef<NodeJS.Timeout | null>(null)
    const { _id } = useGlobalVariablesStore(state => state?.selectedRoom) || {}
    const { rooms } = useSockets(state => state)
    const userData = useUserStore(state => state)
    const draftMsg = useRef('')

    useEffect(() => {

        const draftMessage = localStorage.getItem(_id!)
        
        if (draftMessage) {
            setText(draftMessage)
            draftMsg.current = draftMessage
        }

        return () => {
            draftMsg?.current.trim().length && localStorage.setItem(_id!, draftMsg.current!)
            setText('')
        }

    }, [_id])

    const emitMessageHandler = () => {
        rooms?.emit('newMessage', {
            roomID: _id,
            message: text,
            sender: userData
        })

        setText('')
        draftMsg.current = ''
        localStorage.removeItem(_id!)
    }

    const msgTextUpdater = (e: ChangeEvent<HTMLInputElement>) => {

        const msgText = e.target.value
        draftMsg.current = msgText
        setText(msgText)

        handleIsTyping()
    }

    const handleIsTyping = () => {

        clearTimeout(typingTimer?.current!)

        rooms?.emit('typing', ({ roomID: _id, sender: userData }))

        typingTimer.current = setTimeout(() => {
            rooms?.emit('stop-typing', ({ roomID: _id, sender: userData }))
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