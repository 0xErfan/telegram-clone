import Image from 'next/image'
import { PiDotsThreeVerticalBold } from 'react-icons/pi'
import { IoMdArrowRoundBack } from "react-icons/io";
import useGlobalVariablesStore from '@/zustand/globalVariablesStore';

const ChatHeader = () => {

    const setter = useGlobalVariablesStore(state => state.setter)

    return (
        <div className="flex items-center justify-between sticky top-0 border-b border-white/5 bg-chatBg z-30 py-3 xl:py-0 xl:h-[97px]">

            <div className='flex items-center gap-5'>
                <IoMdArrowRoundBack onClick={() => setter({ selectedRoom: null })} className='cursor-pointer size-7 text-white/80' />
                <div className="flex items-start gap-3">
                    <Image
                        src='/images/favicon.ico'
                        width={50}
                        height={50}
                        alt="avatar"
                    />
                    <div className="flex justify-center flex-col gap-1">
                        <h3 className="font-bold text-[16px] font-segoeBold">Code Review Chat</h3>
                        <p className="font-bold text-[14px] text-darkGray font-segoeBold">5 members, 3 online</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 *:cursor-pointer ch:bg-white/[7%] ch:p-[10px] justify-end">
                <div className="size-[44px] ch:size-full rounded-full flex-center">
                    <PiDotsThreeVerticalBold />
                </div>
            </div>
        </div>
    )
}

export default ChatHeader