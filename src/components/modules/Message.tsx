import { useOnScreen } from '@/hook/useOnScreen'
import { getTimeFromDate } from '@/utils'
import { MdOutlineReplay } from "react-icons/md";
import useSockets from '@/zustand/useSockets'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { MessageModel } from '@/@types/data.t';


const Message = ({
    createdAt,
    message,
    seen,
    _id,
    sender,
    myId,
    roomID,
    replayedTo,
    addReplay
}: MessageModel & { myId: string, addReplay: (_id: string) => void }) => {

    const messageRef = useRef(null)
    const isFromMe = sender._id == myId
    const isInViewport = useOnScreen(messageRef)
    const messageTime = getTimeFromDate(createdAt)
    const [isMounted, setIsMounted] = useState(false)
    const { rooms } = useSockets(state => state)

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

    return (
        <div
            ref={messageRef}
            className={`
                flex items-end gap-2 relative
                ${isFromMe ? 'flex-row-reverse bottomBorderRight' : 'flex-row bottomBorderLeft'}
                ${isMounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-0'}
                transition-all
                duration-500
                overflow-hidden
            `}
        >
            {
                !isFromMe &&
                <>
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
                            <div className='size-[35px] rounded-full bg-lightBlue flex-center text-center font-bold text-2xl'>{sender.name[0]}</div>
                    }
                </>
            }
            <div className={`${isFromMe ? 'bg-darkBlue rounded-l-md rounded-tr-xl text-right' : 'bg-white/10 rounded-r-md rounded-tl-xl text-left'} relative w-fit max-w-[80%] min-w-24 xl:max-w-[60%] px-[12px]`}>
                {
                    isFromMe
                        ?
                        <div className='my-1'></div>
                        :
                        <div className='flex items-center w-full justify-between'>
                            <p className='w-full text-left text-[14px] font-bold mt-px font-segoeBold text-[#C8504F]'>{sender.name}</p>
                            <MdOutlineReplay
                                onClick={() => addReplay(_id)}
                                className='size-[19px] mt-1 shrink-0 cursor-pointer text-white/60'
                            />
                        </div>
                }

                <div className='flex flex-col text-[16px] p-1 mt-1 break-words mb-[18px]'>
                    {replayedTo && <div className='text-sm'>{replayedTo.message}</div>}
                    <p>{message}</p>
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
        </div>
    )
}

export default Message