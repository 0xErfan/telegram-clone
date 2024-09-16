import { Button } from "@nextui-org/button";
import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const CreateRoomBtn = () => {

    const [isOptionsOpen, setIsOptionsOpen] = useState(false)

    return (
        <>
            <Button
                style={{ height: '64px' }}
                size="sm"
                className='absolute right-4 bottom-4 text-white rounded-full bg-darkBlue flex-center z-[99999999]'
                onClick={() => setIsOptionsOpen(prev => !prev)}
            >
                {
                    isOptionsOpen
                        ?
                        <IoClose data-aos='zoom-out' className="size-[27px]" />
                        :
                        <MdModeEditOutline data-aos='zoom-out' className="size-[27px]" />
                }

            </Button>

            <div className="absolute flex flex-col right-4 bottom-24 rounded-md ch:w-full ch:p-3 hover:ch:bg-chatBg/50 cursor-pointer overflow-hidden transition-all duration-300 bg-[#272D3A] text-white z-[99999999]">
                <div>New Chanel</div>
                <div>New Group</div>
                <div>New something else</div>
            </div>
        </>
    )
}

export default CreateRoomBtn