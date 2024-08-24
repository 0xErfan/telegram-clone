import { MessageModel } from '@/@types/data.t'
import { useOnScreen } from '@/hook/useOnScreen'
import { getTimeFromDate } from '@/utils'
import useSockets from '@/zustand/useSockets'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'


const Message = ({ createdAt, message, seen, _id, sender, myId, roomID }: MessageModel & { myId: string }) => {

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
                flex items-end
                ${isFromMe ? 'flex-row-reverse' : 'flex-row'}
                ${isMounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-0'}
                gap-2
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
            <div className={`${isFromMe ? 'bg-darkBlue rounded-l-md rounded-tr-md text-right' : 'bg-white/10 rounded-r-md rounded-tl-md text-left'} relative w-fit max-w-[80%] min-w-20 xl:max-w-[60%] px-[6px]`}>
                {
                    isFromMe
                        ?
                        <div className='my-1'></div>
                        :
                        <p className='w-full text-left text-[14px] font-bold mt-px font-segoeBold text-[#C8504F]'>{sender.name}</p>
                }
                <p className='text-[16px] p-1 mt-1 break-words mb-[18px]'>{message}</p>

                <span className={`flex items-center justify-end gap-1 absolute bottom-px right-1 w-full text-[12px]  ${isFromMe ? 'text-[#B7D9F3]' : 'text-darkGray'} text-right`}>
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