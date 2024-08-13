import Image from 'next/image'
import React from 'react'

const Message = ({ isFromMe }: { isFromMe: boolean }) => {
    return (
        <div className={`flex items-end ${isFromMe ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
            {
                !isFromMe &&
                <Image
                    src='/images/favicon.ico'
                    width={35}
                    height={35}
                    className='size-[35px] rounded-full bg-center'
                    alt='avatar'
                />
            }
            <div className={`${isFromMe ? 'bg-darkBlue rounded-l-md rounded-tr-md' : 'bg-white/10 rounded-r-md rounded-tl-md'} relative w-fit max-w-[80%] xl:max-w-[60%] px-[6px]`}>
                {
                    isFromMe
                        ?
                        <div className='my-1'></div>
                        :
                        <p className='w-full text-left text-[14px] font-bold mt-px font-segoeBold text-[#C8504F]'>Erfan</p>
                }
                <p className='text-[14px] mt-1 mb-[18px]'>hi im erfan nice to meet ya'll, ok? thank you very fucking much Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, sapiente rerum! Esse, asperiores repudiandae</p>

                <span className={`flex items-center justify-end gap-1 absolute bottom-px right-2 w-full text-[12px]  ${isFromMe ? 'text-[#B7D9F3]' : 'text-darkGray'} text-right`}>
                    <p>5:30 PM</p>
                    {
                        isFromMe &&
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