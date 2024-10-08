'use client'
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import { Suspense, lazy } from "react"

const ChatContent = lazy(() => import('./ChatContent'))

const MiddleBar = () => {

    const { selectedRoom, isRoomDetailsShown } = useGlobalVariablesStore(state => state)

    return (
        <div className={`flex-[2.4] bg-chatBg relative ${!selectedRoom && 'hidden'} ${isRoomDetailsShown ? 'xl:rounded-2xl' : 'xl:rounded-l-2xl'}  md:block px-2 md:px-4 xl:px-8 text-white overflow-x-hidden noScrollWidth z-[9999999999]`}
        >
            {
                selectedRoom !== null
                    ?
                    <Suspense fallback={<div className="size-full h-screen text-center flex-center font-bold font-segoeBold text-2xl">Loading...</div>}>
                        <ChatContent />
                    </Suspense>
                    :
                    <div data-aos="fade-left" className="flex-center size-full">
                        <p className="rounded-full w-fit text-[14px] py-1 px-3 text-center bg-white/[18%]">
                            Select chat to start messaging
                        </p>
                    </div>
            }
        </div>
    )
}

export default MiddleBar