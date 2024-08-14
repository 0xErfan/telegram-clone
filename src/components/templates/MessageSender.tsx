import { BsEmojiSmile } from "react-icons/bs";
import { PiMicrophoneLight } from "react-icons/pi";
import { MdAttachFile } from "react-icons/md";

const MessageSender = () => {
    return (
        <section className='fixed md:sticky flex-center bg-chatBg z-30 bottom-0 md:pb-3 inset-x-0'>
            <div className='flex items-center w-full px-2 ch:w-full gap-1 bg-white/[5.12%] h-[53px] rounded'>
                <BsEmojiSmile className="shrink-0 basis-[5%]" />
                <textarea className="bg-transparent resize-none outline-none h-full flex-center mt-7" placeholder="Message" />
                <MdAttachFile className="shrink-0 basis-[5%] size-5 cursor-pointer" />
                <PiMicrophoneLight className="shrink-0 basis-[5%] size-6 cursor-pointer" />
            </div>
        </section>
    )
}

export default MessageSender