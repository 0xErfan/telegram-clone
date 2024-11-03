import { MessageModel } from "@/@types/data.t";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import { ElementRef, useEffect, useLayoutEffect, useRef, useState } from "react"
import { TiPinOutline } from "react-icons/ti";


const PinnedMessages = ({ pinnedMessages: messages }: { pinnedMessages: MessageModel[] }) => {

    const roomId = useGlobalVariablesStore(state => state.selectedRoom?._id)

    const pinnedMessageRef = useRef<ElementRef<'section'> | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [pinMessages, setPinMessages] = useState(messages ?? [])
    
    // dynamically update the pin container before the page paint. 
    useLayoutEffect(() => {

        const leftBarWidth = document.querySelector('#leftbar-container')?.clientWidth as number
        const chatContentHeaderHeight = document.querySelector('#chatContentHeader')?.clientHeight as number

        if (pinnedMessageRef?.current) {
            pinnedMessageRef.current.style.width = `${window.innerWidth - leftBarWidth}px`
            pinnedMessageRef.current.style.top = `${chatContentHeaderHeight}px`
        }

        setIsLoaded(true)

    }, [pinnedMessageRef?.current, ])

    useEffect(() => {
        if (messages?.length) setPinMessages(messages)
    }, [messages?.length, roomId])

    return (
        <section
            key={String(isLoaded)}
            ref={pinnedMessageRef}
            className={`absolute inset-x-0 p-1 left-1/2 h-[50px] -translate-x-1/2 z-[999999999] overflow-hidden bg-leftBarBg`}
        >
            <div className="flex items-center justify-between *:cursor-pointer gap-2">

                <div className="basis-[94%] w-full pl-2 m-auto flex items-start justify-start flex-col">
                    <h5 className="font-bold font-segoeBold text-sm text-lightBlue text-left">Pin messages</h5>
                    <p className="line-clamp-1 w-full overflow-hidden text-darkGray text-sm">Erfan: hi guys, how you doing btw?</p>
                </div>

                <div className="basis-[6%]">
                    <TiPinOutline className="size-5 text-darkGray" />
                </div>

            </div>
        </section>
    )
}

export default PinnedMessages