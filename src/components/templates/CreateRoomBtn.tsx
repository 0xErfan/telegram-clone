import { Button } from "@nextui-org/button";
import { Suspense, lazy, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { RoomModel } from "@/@types/data.t";
const CreateRoom = lazy(() => import('@/components/modules/CreateRoom'))

const CreateRoomBtn = () => {

    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [roomType, setRoomType] = useState<RoomModel['type'] | null>()

    return (
        <div className={`fixed md:max-w-[29%] -z-10 inset-y-0 left-0 size-full text-white`}>

            <Button
                style={{ height: '64px' }}
                size="sm"
                className='absolute bottom-4 right-4 md:right-0 text-white rounded-full bg-darkBlue flex-center z-[9999]'
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

            <div
                data-aos='fade-left'
                key={isOptionsOpen.toString()}
                className={`absolute ${isOptionsOpen ? 'h-auto' : 'h-0'} flex flex-col right-4 md:right-0 bottom-24 rounded-md ch:w-full ch:p-3 hover:ch:bg-chatBg/50 cursor-pointer overflow-hidden transition-all bg-[#272D3A] text-white z-[99999999]`}
            >
                <div onClick={() => setRoomType('chanel')}>New Channel</div>
                <div onClick={() => setRoomType('group')}>New Group</div>
            </div>

            {
                isOptionsOpen
                &&
                <Suspense>
                    <CreateRoom
                        close={() => { setIsOptionsOpen(false); setRoomType(null) }}
                        roomType={roomType!}
                    />
                </Suspense>
            }

        </div>
    )
}

export default CreateRoomBtn