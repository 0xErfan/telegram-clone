import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

interface Props {
    scrollToBottom: () => void
    count: number
}

const ScrollToBottom = ({ scrollToBottom, count }: Props) => {

    const [notSeenCount, setNotSeenCount] = useState(count)
    const timer = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {

        timer.current = null

        timer.current = setTimeout(() => setNotSeenCount(count), 200);

        return () => { clearTimeout(timer?.current!) }

    }, [count])

    return (
        <section
            onClick={() => { setNotSeenCount(0); scrollToBottom() }}
            className={`fixed ${notSeenCount ? 'right-0 opacity-100' : '-right-12 opacity-0'} bottom-[110px] md:bottom-[140px] xl:bottom-[125px] transition-all cursor-pointer bg-[#2E323F] flex-center z-[99999] rounded-full size-12 pt-1`}
        >
            <FaAngleDown className="size-5" />
            <span className="absolute -top-2 bg-darkBlue text-[13px] rounded-full w-fit m-auto py-px px-2">{notSeenCount}</span>
        </section>
    )
}

export default ScrollToBottom;