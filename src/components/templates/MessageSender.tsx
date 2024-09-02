import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { MdAttachFile } from "react-icons/md";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import useSockets from "@/zustand/useSockets";
import { MessageModel } from "@/@types/data.t";

interface Props {
    replayData: Partial<MessageModel> | undefined
    closeReplay: () => void
}

let draftMsg: string;

const MessageSender = ({ replayData, closeReplay }: Props) => {

    const [text, setText] = useState('')

    const typingTimer = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const { _id } = useGlobalVariablesStore(state => state?.selectedRoom) || {}
    const { rooms } = useSockets(state => state)
    const userData = useUserStore(state => state)

    useEffect(() => {

        const draftMessage = localStorage.getItem(_id!)

        draftMessage?.length && setText(draftMessage)
        draftMsg = draftMessage?.length ? draftMessage : ''

        return () => {
            localStorage.setItem(_id!, draftMsg || '')
            setText('')
        }

    }, [_id])

    useEffect(() => {
        replayData?._id && inputRef.current?.focus()
    }, [replayData?._id])

    const sendMessage = () => {

        rooms?.emit('newMessage', {
            roomID: _id,
            message: text,
            sender: userData,
            replayData: replayData ?
                {
                    targetID: replayData?._id,
                    replayedTo: {
                        message: replayData?.message,
                        msgID: replayData?._id,
                        username: replayData.sender?.name
                    }
                }
                : null
        })

        closeReplay()
        setText('')
        draftMsg = ''
        localStorage.removeItem(_id!)
    }

    const msgTextUpdater = (e: ChangeEvent<HTMLInputElement>) => {

        const msgText = e.target.value
        draftMsg = msgText
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
        <section className='sticky -mx-4 md:mx-0 bg-chatBg z-[999999] bottom-0 md:pb-3 inset-x-0'
        >

            <div className={`${replayData?._id ? 'opacity-100 h-[50px] pb-1' : 'opacity-0 h-0'} flex flex-row-reverse justify-between duration-200 transition-all items-center gap-3 px-4 line-clamp-1 overflow-ellipsis absolute rounded-t-xl bg-white/[5.12%] inset-x-0 z-40 bottom-[53px] md:bottom-16`}>

                <IoMdClose onClick={closeReplay} className="size-8 transition-all cursor-pointer active:bg-inherit active:rounded-full p-1" />

                <div className="flex flex-col text-left">
                    <h4 className="text-lightBlue text-[15px]">Reply to {replayData?.sender?.name}</h4>
                    <p className="line-clamp-1 text-[13px] text-white/60 break-words overflow-ellipsis">{replayData?.message}</p>
                </div>

            </div>

            <span className={`${replayData?._id ? 'opacity-100 h-[50px] pb-1' : 'opacity-0 h-0'} duration-200 transition-all border-b border-white/5 z-30 absolute inset-x-0 bottom-[53px] md:bottom-16 bg-inherit`}></span>

            <div className='flex items-center relative w-full md:px-2 px-4 ch:w-full md:gap-1 gap-3 bg-white/[5.12%] h-[53px] rounded'>

                <BsEmojiSmile className="shrink-0 basis-[5%]" />

                <input
                    value={text}
                    onChange={msgTextUpdater}
                    onKeyUp={e => e.key == "Enter" && text.trim().length && sendMessage()}
                    ref={inputRef}
                    className="bg-transparent resize-none outline-none h-full flex-center"
                    type="text"
                    placeholder="Message"
                />

                <MdAttachFile className="shrink-0 basis-[5%] size-5 cursor-pointer" />

                {
                    text.trim().length
                        ?
                        <IoIosSend onClick={sendMessage} className="shrink-0 basis-[5%] size-6 cursor-pointer text-lightBlue rotate-45" />
                        :
                        <PiMicrophoneLight className="shrink-0 basis-[5%] size-6 cursor-pointer" />
                }

            </div>

        </section>
    )
}

export default MessageSender;