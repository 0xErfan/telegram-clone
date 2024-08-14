interface Props {
    name: string
    count: number
    isActive?: boolean
}

const ChatFolders = ({ name, count, isActive }: Props) => {
    return (
        <div className='relative cursor-pointer ch:transition-all ch:duration-100'>

            <div className={`${isActive && 'text-lightBlue'} inline`}>
                {name}
            </div>

            <span className={`px-[5px] text-[13px] ml-1 pb-px ${isActive ? 'bg-lightBlue' : 'bg-darkGray'} text-leftBarBg rounded-full`}>
                {count}
            </span>

            {
                isActive && <span className='absolute inset-x-0 -bottom-1 bg-lightBlue rounded-t-md w-full h-1'></span>
            }

        </div>
    )
}

export default ChatFolders