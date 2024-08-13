import Message from "../modules/Message"

const ChatContent = () => {

    return (
        <div className="flex flex-col gap-2 my-2">
            {
                Array(15).fill(0).map((_, index) => <Message isFromMe={Boolean(index % 2 == 0)} key={index} />)
            }
        </div>
    )
}

export default ChatContent;