import { MessageModel } from "@/@types/data.t";
import { scrollToMessage } from "@/utils";
import { ElementRef, memo, useEffect, useLayoutEffect, useRef, useState } from "react"
import { TiPinOutline } from "react-icons/ti";

const PinnedMessages = ({ pinnedMessages: messages }: { pinnedMessages: MessageModel[] }) => {

    const pinnedMessageRef = useRef<ElementRef<'section'> | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [pinMessages, setPinMessages] = useState<MessageModel[]>([])

    const scrollToPinMessage = () => {
        scrollToMessage(pinMessages[0]._id, 'smooth')
    }

    // dynamically update the pin container before the page paint. 
    useLayoutEffect(() => {

        const leftBarWidth = document.querySelector('#leftbar-container')?.clientWidth as number
        const chatContentHeaderHeight = document.querySelector('#chatContentHeader')?.clientHeight as number

        if (pinnedMessageRef?.current) {
            pinnedMessageRef.current.style.width = `${window.innerWidth - leftBarWidth}px`
            pinnedMessageRef.current.style.top = `${chatContentHeaderHeight}px`
        }

        setIsLoaded(true)

    }, [pinnedMessageRef?.current, messages])

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
            key={String(isLoaded)}
            ref={pinnedMessageRef}
            className={`absolute ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-200 inset-x-0 p-1 left-1/2 h-[50px] -translate-x-1/2 z-[999999999] overflow-hidden bg-leftBarBg`}
        >
            <div className="flex items-center justify-between *:cursor-pointer gap-2">

                <div onClick={scrollToPinMessage} className="basis-[94%] w-full pl-2 m-auto flex items-start justify-start flex-col">
                    <h5 className="font-bold font-segoeBold text-sm text-lightBlue text-left">Pin messages</h5>
                    <p className="line-clamp-1 w-full overflow-hidden text-darkGray text-sm">{`${pinMessages?.[0]?.sender.name}: ${pinMessages?.[0]?.message}`}</p>
                </div>

                <div className="basis-[6%]">
                    <TiPinOutline className="size-5 text-darkGray" />
                </div>

            </div>
        </section>
    )
}

export default memo(PinnedMessages)