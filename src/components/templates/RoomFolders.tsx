import { useEffect, useRef, useState } from 'react'
import ChatFolders from '../modules/ChatFolders'
import useUserStore from '@/zustand/userStore'
import useGlobalVariablesStore from '@/zustand/globalVariablesStore'

const folders = ['all', 'private', 'group', 'chanel', 'bot']

const RoomFolders = ({ updateFilterBy }: { updateFilterBy: (filterBy: string) => void }) => {

    const [foldersCount, setFolderCount] = useState<Record<typeof folders[number], number>>({})
    const [activeFolder, setActiveFolder] = useState('all')
    const chatFolderRef = useRef<HTMLDivElement>(null)
    const { rooms } = useUserStore(state => state)

    const forceRender = useGlobalVariablesStore(state => state.forceRender)

    useEffect(() => {

        if (!rooms?.length) return;

        setFolderCount({})

        rooms.forEach(room => {

            if (room?.notSeenCount) {

                setFolderCount(prev => {
                    return {
                        ...prev,
                        [room.type]: (prev[room.type] ?? 0) + 1,
                        all: (prev.all ?? 0) + 1 // no matter what, all should update with other folder updates
                    }
                })

            }

            console.log('run again')

        })

    }, [rooms, activeFolder, forceRender])

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
                        count={foldersCount[data]}
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