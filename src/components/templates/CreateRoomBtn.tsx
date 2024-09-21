import { Button } from "@nextui-org/button";
import { Suspense, lazy, useEffect, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { RoomModel } from "@/@types/data.t";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
const CreateRoom = lazy(() => import('@/components/modules/CreateRoom'))

const CreateRoomBtn = () => {

    const [isOptionsOpen, setIsOptionsOpen] = useState(false)
    const [roomType, setRoomType] = useState<RoomModel['type'] | null>()
    const setter = useGlobalVariablesStore(state => state.setter)

    useEffect(() => { // better than 4 prop drilling i think
        setter({
            createRoom: () => {
                setIsOptionsOpen(true)
                setRoomType('group')
            }
        })
    }, [])

    return (
        <div className={`absolute md:max-w-[29.6%] inset-y-0 left-0 size-full text-white`}>

            <Button
                style={{ height: '64px' }} // full of shitty style bugs in md (you know, so fix it)
                size="sm"
                className='fixed md:absolute bottom-4 right-4 md:right-0 xl:right-3 text-white rounded-full bg-darkBlue flex-center z-[9999]'
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
                className={`fixed md:absolute ${isOptionsOpen ? 'h-auto' : 'h-0'} flex flex-col right-4 md:right-0 xl:right-3 bottom-24 rounded-md ch:w-full ch:p-3 hover:ch:bg-chatBg/50 cursor-pointer overflow-hidden transition-all bg-[#272D3A] text-white z-[9999999]`}
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