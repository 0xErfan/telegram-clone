import { MessageModel } from '@/@types/data.t'
import { useOnScreen } from '@/hook/useOnScreen'
import { getTimeFromDate } from '@/utils'
import useGlobalVariablesStore from '@/zustand/globalVariablesStore'
import Image from 'next/image'
import { useEffect, useRef } from 'react'


const Message = ({ createdAt, message, seen, _id, sender, myId }: MessageModel & { myId: string }) => {

    const messageRef = useRef(null)
    const { socket } = useGlobalVariablesStore(state => state)

    const isFromMe = sender._id == myId
    const isInViewport = useOnScreen(messageRef)
    const messageTime = getTimeFromDate(createdAt)

    useEffect(() => {

        if (!seen && isFromMe && isInViewport) {
            socket?.emit('seen', _id)
        }

    }, [isInViewport, seen])

    return (
        <div
            ref={messageRef}
            data-aos={isFromMe ? 'fade-left' : 'fade-right'}
            className={`flex items-end ${isFromMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}
        >
            {
                !isFromMe &&
                <>
                    {
                        sender.avatar
                            ?
                            <Image
                                src='/images/favicon.ico'
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
            <div className={`${isFromMe ? 'bg-darkBlue rounded-l-md rounded-tr-md text-right' : 'bg-white/10 rounded-r-md rounded-tl-md text-left'} relative w-fit max-w-[80%] min-w-16 xl:max-w-[60%] px-[6px]`}>
                {
                    isFromMe
                        ?
                        <div className='my-1'></div>
                        :
                        <p className='w-full text-left text-[14px] font-bold mt-px font-segoeBold text-[#C8504F]'>{sender.name}</p>
                }
                <p className='text-[16px] p-1 mt-1 mb-[18px]'>{message}</p>

                <span className={`flex items-center justify-end gap-1 absolute bottom-px right-2 w-full text-[12px]  ${isFromMe ? 'text-[#B7D9F3]' : 'text-darkGray'} text-right`}>
                    <p className='whitespace-nowrap'>{messageTime}</p>
                    {
                        isFromMe && seen &&
                        <Image
                            src='/shapes/seen.svg'
                            width={15}
                            height={15}
                            className='size-[15px] rounded-full bg-center'
                            alt='avatar'
                        />
                    }
                </span>
            </div>
        </div>
    )
}

export default Message