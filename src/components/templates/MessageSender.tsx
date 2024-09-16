import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdAttachFile, MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { BsFillReplyFill } from "react-icons/bs";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import useSockets from "@/zustand/useSockets";
import { MessageModel } from "@/@types/data.t";

interface Props {
    replayData: Partial<MessageModel> | undefined
    editData: Partial<MessageModel> | undefined
    closeReplay: () => void
    closeEdit: () => void
}

let draftMsg: string;

const MessageSender = ({ replayData, editData, closeReplay, closeEdit }: Props) => {

    const [text, setText] = useState('')
    const typingTimer = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const selectedRoom = useGlobalVariablesStore(state => state?.selectedRoom)
    const userRooms = useUserStore(state => state.rooms)
    const { rooms } = useSockets(state => state)
    const userData = useUserStore(state => state)

    const _id = selectedRoom?._id;

    useEffect(() => {
        setText(editData?.message || '')
    }, [editData?._id])

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
        inputRef.current?.focus()
    }, [replayData?._id, editData?._id])

    const cleanUpAfterSendingMsg = () => {
        closeReplay()
        closeEdit()
        setText('')
        draftMsg = ''
        localStorage.removeItem(_id!)
    }

    const sendMessage = () => {

        const roomHistory = userRooms.some(room => { if (room._id === _id) return true })

        if (roomHistory) {
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
        } else {
            rooms?.emit('createRoom', { newRoomData: selectedRoom, message: { sender: userData, message: text } });
        }

        cleanUpAfterSendingMsg()
    }

    const editMessage = () => {

        if (text.trim() === editData?.message?.trim()) return closeEdit()

        rooms?.emit('editMessage', { msgID: editData?._id, editedMsg: text, roomID: selectedRoom?._id })
        cleanUpAfterSendingMsg()
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

            <div className={`${(replayData?._id || editData?._id) ? 'opacity-100 h-[50px] pb-1' : 'opacity-0 h-0'} flex flex-row-reverse justify-between duration-200 transition-all items-center gap-3 px-4 line-clamp-1 overflow-ellipsis absolute rounded-t-xl bg-white/[5.12%] inset-x-0 z-40 bottom-[53px] md:bottom-16`}>

                <IoMdClose onClick={() => { closeReplay(), closeEdit() }} className="size-7 shrink-0 transition-all cursor-pointer active:bg-inherit active:rounded-full p-1" />

                <div className="flex items-center gap-4 line-clamp-1 overflow-ellipsis">

                    {
                        editData
                            ?
                            <MdModeEditOutline className="size-6 text-lightBlue" />
                            :
                            <BsFillReplyFill className="size-6 text-lightBlue" />

                    }

                    <div className="flex flex-col text-left">

                        <h4 className="text-lightBlue break-words overflow-ellipsis line-clamp-1 text-[15px]">
                            {replayData && `Reply to ${replayData?.sender?.name}`}
                            {editData && 'Edit Message'}
                        </h4>

                        <p className="line-clamp-1 text-[13px] text-white/60 break-words overflow-ellipsis">
                            {replayData?.message ?? editData?.message}
                        </p>
                    </div>
                </div>

            </div>

            <span className={`${(replayData?._id || editData?._id) ? 'opacity-100 h-[50px] pb-1' : 'opacity-0 h-0'} duration-200 transition-all border-b border-white/5 z-30 absolute inset-x-0 bottom-[53px] md:bottom-16 bg-inherit`}></span>

            <div className='flex items-center relative w-full md:px-2 px-4 ch:w-full md:gap-1 gap-3 bg-white/[5.12%] h-[53px] rounded'>

                <BsEmojiSmile className="shrink-0 basis-[5%]" />

                <input
                    dir="auto"
                    value={text}
                    onChange={msgTextUpdater}
                    onKeyUp={e => (e.key == "Enter" && text.trim().length) && (editData ? editMessage() : sendMessage())}
                    ref={inputRef}
                    className="bg-transparent resize-none outline-none h-full flex-center"
                    type="text"
                    placeholder="Message"
                />

                {!editData && <MdAttachFile className="shrink-0 basis-[5%] size-5 cursor-pointer" />}

                {
                    editData?._id ?
                        <MdOutlineDone onClick={editMessage} className="shrink-0 basis-[5%] size-6 cursor-pointer text-white bg-lightBlue rounded-full" />
                        :
                        <>
                            {
                                text.trim().length
                                    ?
                                    <IoIosSend onClick={sendMessage} className="shrink-0 basis-[5%] size-6 cursor-pointer text-lightBlue rotate-45" />
                                    :
                                    <PiMicrophoneLight className="shrink-0 basis-[5%] size-6 cursor-pointer" />
                            }
                        </>
                }

            </div>

        </section>
    )
}

export default MessageSender;