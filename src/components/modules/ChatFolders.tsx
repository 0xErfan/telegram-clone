interface Props {
    name: string
    count: number
    onClick: () => void
    isActive?: boolean
}

const ChatFolders = ({ name, count, isActive, onClick }: Props) => {
    return (
        <div
            onClick={onClick}
            className='flex items-center justify-center relative cursor-pointer ch:transition-all ch:duration-300'
        >

            <div className={`${isActive && 'text-lightBlue'} capitalize inline`}>
                {name}
            </div>

            {
                count
                    ?
                    <span className={`px-[5px] text-[13px] h-[18px] min-w-[18px] w-min flex items-center justify-center text-center ml-1 pb-px ${isActive ? 'bg-lightBlue' : 'bg-darkGray'} text-leftBarBg rounded-full`}>
                        {count}
                    </span>
                    : null
            }

            {
                isActive && <span className='absolute inset-x-0 -bottom-1 bg-lightBlue rounded-t-md w-full h-1'></span>
            }

        </div>
    )
}

export default ChatFolders