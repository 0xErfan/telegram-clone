import { BsEmojiSmile } from "react-icons/bs";
import { IoIosSend, IoMdClose } from "react-icons/io";
import { ChangeEvent, lazy, useEffect, useRef, useState } from "react";
import { MdAttachFile, MdModeEditOutline, MdOutlineDone } from "react-icons/md";
import { BsFillReplyFill } from "react-icons/bs";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useUserStore from "@/zustand/userStore";
import useSockets from "@/zustand/useSockets";
import { MessageModel } from "@/@types/data.t";
import VoiceMessageRecorder from "./VoiceMessageRecorder";
const EmojiPicker = lazy(() => import('emoji-picker-react'))

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
    const [isMuted, setIsMuted] = useState(false)
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)

    const selectedRoom = useGlobalVariablesStore(state => state?.selectedRoom)
    const userRooms = useUserStore(state => state.rooms)
    const { rooms } = useSockets(state => state)
    const myData = useUserStore(state => state)

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
        if (replayData?._id || editData?._id) inputRef.current?.focus()
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
                sender: myData,
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
            rooms?.emit('createRoom', { newRoomData: selectedRoom, message: { sender: myData, message: text } });
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
        if (inputRef.current) {
            inputRef.current.height = inputRef.current?.scrollHeight
        }
        handleIsTyping()
    }

    const handleIsTyping = () => {

        clearTimeout(typingTimer?.current!)

        rooms?.emit('typing', ({ roomID: _id, sender: myData }))

        typingTimer.current = setTimeout(() => {
            rooms?.emit('stop-typing', ({ roomID: _id, sender: myData }))
        }, 2000);
    }

    const selectEmoji = (e: { emoji: string }) => {
        setText(prev => prev.concat(e.emoji))
        setIsEmojiOpen(false)
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
                            <MdModeEditOutline className="size-6 shrink-0 text-lightBlue" />
                            :
                            <BsFillReplyFill className="size-6 shrink-0 text-lightBlue" />

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

            <EmojiPicker
                open={isEmojiOpen}
                //@ts-expect-error
                theme="dark"
                className="absolute left-3 w-32 bottom-16"
                style={{ position: 'absolute' }}
                //@ts-expect-error
                previewConfig={{ defaultCaption: false, defaultEmoji: false, showPreview: false }}
                skinTonesDisabled={true}
                searchDisabled={true}
                lazyLoadEmojis={true}
                onEmojiClick={selectEmoji}
            />

            <div className='flex items-center relative w-full md:px-2 px-6 ch:w-full md:gap-1 gap-3 bg-white/[5.12%] h-[53px] rounded mt-2'>

                {
                    (selectedRoom?.type == 'chanel' && selectedRoom.admins.includes(myData._id)) || selectedRoom?.type !== 'chanel'
                        ?
                        <>
                            <BsEmojiSmile
                                onClick={() => setIsEmojiOpen(prev => !prev)}
                                className="shrink-0 cursor-pointer basis-[5%] size-5"
                            />

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

                            {!editData && !text?.trim().length && <MdAttachFile data-aos='zoom-in' className="shrink-0 basis-[5%] size-6 cursor-pointer" />}

                            {
                                editData?._id ?
                                    <div
                                        className="basis-[10%] xl:basis-[3%] md:basis-[5%] size-8 ch:size-full p-1 cursor-pointer text-white bg-lightBlue rounded-full flex-center"
                                        onClick={editMessage}
                                    >
                                        <MdOutlineDone data-aos='zoom-in' className="shrink-0" />
                                    </div>
                                    :
                                    <>
                                        {
                                            text.trim().length
                                                ?
                                                <IoIosSend data-aos='zoom-in' onClick={sendMessage} className="shrink-0 basis-[7%] size-6 cursor-pointer text-lightBlue ml-10 mb-3 *:rotate-45" />
                                                :
                                                <VoiceMessageRecorder
                                                    replayData={replayData as any}
                                                    closeEdit={closeEdit}
                                                    closeReplay={closeReplay}
                                                />
                                        }
                                    </>
                            }
                        </>
                        :
                        <div
                            onClick={() => setIsMuted(prev => !prev)}
                            className="absolute size-full cursor-pointer pt-3 mb-[14px] text-center">{isMuted ? 'Unmute' : 'Mute'}
                        </div>
                }

            </div>

        </section>
    )
}

export default MessageSender;