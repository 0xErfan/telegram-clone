'use client'
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import { Suspense, lazy } from "react"

const ChatContent = lazy(() => import('./ChatContent'))

const RightBar = () => {

    const { selectedRoom } = useGlobalVariablesStore(state => state)

    return (
        <div
            data-aos-duration="400"
            data-aos='fade-right'
            className={`flex-[2.4] bg-chatBg relative ${!selectedRoom && 'hidden'} md:block xl:rounded-l-2xl px-2 md:px-4 xl:px-8 text-white overflow-x-hidden noScrollWidth`}
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

export default RightBar