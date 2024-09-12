import { useOnScreen } from '@/hook/useOnScreen'
import { getTimeFromDate, scrollToMessage } from '@/utils'
import useSockets from '@/zustand/useSockets'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { MessageModel } from '@/@types/data.t';
import useGlobalVariablesStore from '@/zustand/globalVariablesStore';
import type { Props as globalVariablesStoreType } from '@/zustand/globalVariablesStore';
import MessageActions from './MessageActions';

interface Props {
    myId: string,
    addReplay: (_id: string) => void
    edit: (data: MessageModel) => void
    isPv?: boolean
}

const Message = (msgData: MessageModel & Props) => {

    const { createdAt, message, seen, _id, sender, myId, roomID, replayedTo, addReplay, edit, isPv = false } = msgData

    const messageRef = useRef(null)
    const modalMsgID = useGlobalVariablesStore(state => state.modalData.msgData?._id)
    const isFromMe = sender._id == myId
    const isInViewport = useOnScreen(messageRef)
    const messageTime = getTimeFromDate(createdAt)
    const [isMounted, setIsMounted] = useState(false)
    const { rooms } = useSockets(state => state)
    const setter = useGlobalVariablesStore(state => state.setter)

    useEffect(() => {

        if (sender?._id) {

            const isAlreadySeenByThisUser = isFromMe ? true : seen?.includes(myId);

            if (!isAlreadySeenByThisUser && isInViewport) {
                rooms?.emit('seenMsg', {
                    seenBy: myId,
                    sender,
                    msgID: _id,
                    roomID
                });
            }
        }

    }, [isInViewport, isFromMe]);

    useEffect(() => { setIsMounted(true) }, [])

    const openProfile = () => {
        setter({
            mockSelectedRoomData: sender,
            shouldCloseAll: true,
            isRoomDetailsShown: true
        })
    }

    const updateModalMsgData = () => {
        setter((prev: globalVariablesStoreType) => ({
            modalData: {
                ...prev.modalData,
                msgData,
                edit,
                reply: () => addReplay(_id)
            }
        }))
    }

    return (
        <div
            ref={messageRef}
            className={`
                flex items-end gap-2 relative
                ${isFromMe ? 'flex-row-reverse' : 'flex-row'}
                ${!isPv && (isFromMe ? 'bottomBorderRight' : 'bottomBorderLeft')}
                ${isMounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-0'}
                transition-all
                duration-500
                overflow-hidden
                ch:overflow-hidden
            `}
        >
            {
                !isFromMe && !isPv &&
                <div onClick={openProfile} className='cursor-pointer'>
                    {
                        sender.avatar
                            ?
                            <Image
                                src={sender.avatar}
                                width={35}
                                height={35}
                                className='size-[35px] rounded-full bg-center'
                                alt='avatar'
                            />
                            :
                            <div className='size-[35px] rounded-full bg-lightBlue flex-center text-center font-bold text-xl pb-1'>{sender.name[0]}</div>
                    }
                </div>
            }

            <div
                onClick={updateModalMsgData}
                onContextMenu={e => { e.preventDefault(), updateModalMsgData() }}
                className={`${isFromMe ? 'bg-darkBlue rounded-l-md rounded-tr-xl text-right pl-1 pr-3' : 'bg-white/10 rounded-r-md rounded-tl-xl text-left pr-1 pl-3'} relative w-fit max-w-[80%] min-w-24 xl:max-w-[60%]`}
            >

                <div className='flex flex-col text-[16px] gap-1 p-1 mt-1 break-words mb-[13px]'>
                    {
                        replayedTo
                        &&
                        <div
                            onClick={e => { e.stopPropagation(), scrollToMessage(replayedTo?.msgID) }}
                            className={`${isFromMe ? 'bg-lightBlue/25 rounded-l-md' : 'bg-green-500/15 rounded-r-md'} cursor-pointer rounded-md rounded-t-md text-sm relative w-full py-1 px-3 overflow-hidden`}
                        >
                            <span className={`absolute ${isFromMe ? 'bg-white' : 'bg-green-500'} left-0  inset-y-0 w-[3px] h-full `}></span>
                            <p className='font-extrabold font-segoeBold break-words line-clamp-1 overflow-ellipsis'>{replayedTo.username}</p>
                            <p className='font-thin break-words line-clamp-1 overflow-ellipsis'>{replayedTo.message}</p>
                        </div>
                    }
                    <p dir='auto'>{message}</p>
                </div>

                <span className={`flex items-center justify-end gap-1 absolute bottom-px right-3 w-full text-[12px]  ${isFromMe ? 'text-[#B7D9F3]' : 'text-darkGray'} text-right`}>
                    <p className='whitespace-nowrap'>{messageTime}</p>
                    {
                        (isFromMe && seen?.length) ?
                            <Image
                                src='/shapes/seen.svg'
                                width={15}
                                height={15}
                                className={`size-[15px] rounded-full bg-center duration-500 ${(isFromMe && seen?.length) ? 'opacity-100' : 'opacity-0'}`}
                                alt='avatar'
                            />
                            : null
                    }
                </span>

            </div>

            {
                modalMsgID === _id ? <MessageActions /> : null
            }

        </div>
    )
}

export default Message;