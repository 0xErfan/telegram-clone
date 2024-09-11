import { useEffect, useRef, useState } from 'react'
import ChatFolders from '../modules/ChatFolders'
import useUserStore from '@/zustand/userStore'

const folders = ['all', 'private', 'group', 'channel', 'bot']

const RoomFolders = ({ updateFilterBy }: { updateFilterBy: (filterBy: string) => void }) => {

    const [activeFolder, setActiveFolder] = useState('all')
    const chatFolderRef = useRef<HTMLDivElement>(null)
    const { rooms } = useUserStore(state => state)

    useEffect(() => { updateFilterBy(activeFolder) }, [activeFolder])

    useEffect(() => {

        const handleScroll = (event: WheelEvent) => {
            event.preventDefault();
            const scrollAmount = event.deltaY < 0 ? -30 : 30
            chatFolderRef.current!.scrollBy({ left: scrollAmount });
        }

        chatFolderRef.current!.addEventListener('wheel', handleScroll);
        return () => chatFolderRef.current!?.removeEventListener('wheel', handleScroll);

    }, [])

    return (
        <div
            data-aos='zoom-in'
            ref={chatFolderRef}
            className="flex items-center noScrollWidth gap-5 overflow-x-auto h-10 text-darkGray ch:py-1 ch:w-fit z-40"
        >
            {
                folders.map(data =>
                    <ChatFolders
                        key={data}
                        count={data == 'all' ? rooms.length : [...rooms].filter((roomData) => roomData.type == data)?.length}
                        name={data}
                        isActive={activeFolder == data}
                        onClick={() => setActiveFolder(data)}
                    />
                )
            }
        </div>
    )
}

export default RoomFolders