import { MessageModel } from "@/@types/data.t";
import { scrollToMessage } from "@/utils";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import { ElementRef, useEffect, useLayoutEffect, useRef, useState } from "react"
import { TiPinOutline } from "react-icons/ti";


const PinnedMessages = ({ pinnedMessages: messages }: { pinnedMessages: MessageModel[] }) => {

    const isRoomDetailsShown = useGlobalVariablesStore(state => state.isRoomDetailsShown)
    const pinnedMessageRef = useRef<ElementRef<'section'> | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [pinMessages, setPinMessages] = useState<MessageModel[]>([])
    const [activePinMsg, setActivePinMsg] = useState(0)

    const scrollToPinMessage = () => {

        scrollToMessage(pinMessages[activePinMsg]?._id, 'smooth', 'center')

        const nextActiveMsg = (activePinMsg + 1) >= pinMessages?.length ? 0 : (activePinMsg + 1)
        setActivePinMsg(nextActiveMsg)

    }

    // dynamically update the pin container before the page paint. 
    useLayoutEffect(() => {

        const leftBarWidth = document.querySelector('#leftbar-container')?.clientWidth as number
        const chatContentHeaderHeight = document.querySelector('#chatContentHeader')?.clientHeight as number

        if (pinnedMessageRef?.current) {
            const roomDetailsContainerHeight = isRoomDetailsShown ? (window.innerWidth >= 1280 ? 400 : 0) : 0
            pinnedMessageRef.current.style.width = `${window.innerWidth - leftBarWidth - roomDetailsContainerHeight}px`
            pinnedMessageRef.current.style.top = `${chatContentHeaderHeight}px`
        }

        setIsLoaded(true)

    }, [pinnedMessageRef?.current, messages, isRoomDetailsShown])

    useEffect(() => {

        if (!messages?.length) return

        const sortedPinMessages = [...messages].filter(msg => msg.pinnedAt).sort((a, b) => {
            return (new Date(Number(b.pinnedAt)).getTime()) - (new Date(Number(a.pinnedAt)).getTime())
        })

        setPinMessages(sortedPinMessages)

    }, [messages])

    if (!messages?.length) return;

    return (
        <section
            id="pinMessagesContainer"
            key={String(isLoaded)}
            ref={pinnedMessageRef}
            className={`absolute ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-200 inset-x-0 p-1 left-1/2 h-[50px] -translate-x-1/2 z-[999999999] overflow-hidden bg-leftBarBg`}
        >
            <div className="flex items-center justify-between relative *:cursor-pointer gap-2">

                <div
                    onClick={scrollToPinMessage}
                    className={`${!isRoomDetailsShown && 'basis-[96%]'} w-full pl-4 m-auto flex items-start justify-start flex-col`}
                >
                    <h5 className="font-bold font-segoeBold text-sm text-lightBlue text-left">Pin messages</h5>
                    <p className="line-clamp-1 w-full overflow-hidden text-darkGray text-sm">{`${pinMessages?.[activePinMsg]?.sender.name}: ${pinMessages?.[activePinMsg]?.message ? pinMessages?.[activePinMsg]?.message : pinMessages?.[activePinMsg]?.voiceData && 'Voice Message'}`}</p>
                </div>

                <div className="basis-[4%] flex justify-center items-center">
                    <TiPinOutline className="size-5 text-darkGray" />
                </div>

                <span className="absolute inset-y-0 left-1 w-[3px] rounded-full h-full bg-lightBlue"></span>

            </div>
        </section>
    )
}

export default PinnedMessages