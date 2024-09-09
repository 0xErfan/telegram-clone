import { FaAngleDown } from "react-icons/fa6";

interface Props {
    scrollToBottom: () => void
    count: number
}

const ScrollToBottom = ({ scrollToBottom, count }: Props) => {
    return (
        <section
            onClick={scrollToBottom}
            className={`fixed ${count ? 'right-0 opacity-100' : '-right-12 opacity-0'} bottom-20 transition-all cursor-pointer bg-[#2E323F] flex-center z-[99999] rounded-full size-12 pt-1`}
        >
            <FaAngleDown className="size-5" />
            <span className="absolute -top-2 bg-darkBlue text-[13px] rounded-full w-fit m-auto py-px px-2">{count}</span>
        </section>
    )
}

export default ScrollToBottom;