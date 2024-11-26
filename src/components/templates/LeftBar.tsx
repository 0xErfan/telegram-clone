'use client'

import Image from "next/image"
import { BiSearch } from "react-icons/bi"
import { ChatCard } from "../modules/ChatCard"
import { lazy, useEffect, useMemo, useRef, useState } from "react"
import { RoomModel, UserModel } from "@/@types/data.t"
import { io } from 'socket.io-client'
import useUserStore from "@/zustand/userStore"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import RoomFolders from "./RoomFolders"
import RoomSkeleton from "../modules/RoomSkeleton"
import { clearInterval } from "timers"
import { registerServiceWorker } from "@/utils"

const CreateRoomBtn = lazy(() => import('@/components/templates/CreateRoomBtn'))
const LeftBarMenu = lazy(() => import('@/components/templates/LeftBarMenu'))
const SearchPage = lazy(() => import('@/components/templates/SearchPage'))
const Modal = lazy(() => import('../modules/Modal'))

const roomSocket = io('http://192.168.94.40:3001', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    transports: ['websocket']
});

const LeftBar = () => {

    const [rooms, setRooms] = useState<RoomModel[]>([])
    const interval = useRef<NodeJS.Timeout | null>(null)
    const [filterBy, setFilterBy] = useState('all')
    const [isPageLoaded, setIsPageLoaded] = useState(false)
    const [forceRender, setForceRender] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isLeftBarMenuOpen, setIsLeftBarMenuOpen] = useState(false)

    const _id = useUserStore(state => state._id)
    const updater = useSockets(state => state.updater)
    const { setter: userDataUpdater, rooms: userRooms, roomMessageTrack } = useUserStore(state => state)
    const { selectedRoom, setter } = useGlobalVariablesStore(state => state)

    const sortedRooms = useMemo(() => {

        const filteredRooms = filterBy == 'all' ? rooms : [...rooms].filter(data => data.type === filterBy)

        const sortAndFilteredRooms = filteredRooms
            .sort((a: any, b: any) => {
                const aTime = new Date(a?.lastMsgData?.createdAt).getTime() || 0
                const bTime = new Date(b?.lastMsgData?.createdAt).getTime() || 0
                return bTime - aTime
            })

        return sortAndFilteredRooms;
    }, [rooms?.length, forceRender, userRooms?.length, filterBy])

    // heartbeat effect to keep connection alive even with no activity
    useEffect(() => {

        registerServiceWorker()

        const intervalId = setInterval(() => {
            if (roomSocket.connected) {
                roomSocket.emit('ping');
                // console.log('Ping sent');
            }
        }, 20000);

        // roomSocket?.on('pong', () => console.log('pong received from server'))

        return () => {
            clearInterval(intervalId ?? 0);
            roomSocket?.off('pong')
        };
    }, []);

    useEffect(() => {

        if (!_id) return

        updater('rooms', roomSocket)
        userDataUpdater({ rooms })

        roomSocket.emit('joining', selectedRoom?._id)
        roomSocket.emit('getRooms', _id)

        roomSocket.on('joining', roomData => { roomData && setter({ selectedRoom: roomData }) })

        roomSocket.on('getRooms', (rooms: RoomModel[]) => {

            setIsPageLoaded(true)
            setRooms(rooms)
            userDataUpdater({ rooms })

            roomSocket.on('lastMsgUpdate', newMsg => {
                setForceRender(prev => !prev)
                setRooms(prev => prev.map((roomData: any) => {
                    if (roomData._id === newMsg.roomID) roomData.lastMsgData = newMsg
                    return roomData
                }))
            })
        })

        roomSocket.on('createRoom', roomData => {
            roomSocket.emit('getRooms', _id)
            roomData.creator == _id && roomSocket.emit('joining', roomData._id)
        })

        roomSocket.on('updateOnlineUsers', onlineUsers => setter({ onlineUsers })) // check if its accessible for all(bug) or not

        roomSocket.on('updateLastMsgPos', (updatedData: UserModel['roomMessageTrack']) => {
            console.log('incomming data', updatedData)
            userDataUpdater({roomMessageTrack: updatedData})
        })
    
        return () => {

            roomSocket.off('joining')
            roomSocket.off('getRooms')
            roomSocket.off('createRoom')
            roomSocket.off('updateLastMsgPos')
            roomSocket.off('lastMsgUpdate')
            roomSocket.off('updateOnlineUsers')
        }
    }, [_id, rooms?.length])

    useEffect(() => {
        if (rooms?.length && userRooms?.length) {
            rooms?.length < userRooms?.length && setRooms(userRooms)
        }
    }, [userRooms?.length, rooms?.length])

    useEffect(() => {

        roomSocket.on('deleteRoom', roomID => {
            roomSocket.emit('getRooms')
            roomID == selectedRoom?._id && setter({ selectedRoom: null })
        })

        roomSocket.on('seenMsg', ({ roomID, seenBy }) => {

            const updatedRoomLastMessageData = [...rooms];

            updatedRoomLastMessageData
                .some(room => {
                    if (room._id === roomID) {
                        //@ts-expect-error
                        room.lastMsgData = {
                            //@ts-expect-error
                            ...room.lastMsgData,
                            //@ts-expect-error
                            seen: [...new Set([...room?.lastMsgData?.seen, seenBy])]
                        }
                        return true
                    }
                })

            setRooms(updatedRoomLastMessageData)
            setForceRender(prev => !prev)
        })

        return () => {
            roomSocket.off('deleteRoom')
            roomSocket.off('seenMsg')
        }
    }, [selectedRoom?._id])

    return (

        <>

            {
                isPageLoaded
                    ?
                    <>
                        <LeftBarMenu isOpen={isLeftBarMenuOpen} closeMenu={() => setIsLeftBarMenuOpen(false)} />
                        <Modal />
                        <CreateRoomBtn />
                    </>
                    : null
            }

            {isSearchOpen && <SearchPage closeSearch={() => setIsSearchOpen(false)} />}

            <div
                data-aos-duration="400"
                data-aos='fade-right'
                id="leftbar-container"
                className={`flex-1 ${selectedRoom && 'hidden'} md:block bg-leftBarBg relative noScrollWidth px-4 overflow-y-auto`}
            >

                <div className="w-full sticky top-0 bg-leftBarBg space-y-1 pt-1 border-b border-white/5 z-30">

                    <div className="flex items-center justify-between gap-6">

                        <div className="flex items-center flex-1 gap-5 mt-3 w-full text-white tex-[14px]">
                            <Image
                                onClick={() => setIsLeftBarMenuOpen(true)}
                                className="cursor-pointer"
                                src="/shapes/hamberger.svg"
                                width={18}
                                height={15}
                                alt="hambergerMenu"
                            />
                            <h1 className="font-bold font-segoeBold">Telegram</h1>
                        </div>

                        <BiSearch onClick={() => setIsSearchOpen(true)} className="cursor-pointer size-[23px] text-white/90 mt-3" />

                    </div>

                    <RoomFolders updateFilterBy={filterBy => setFilterBy(filterBy)} />

                </div>

                <div className="flex flex-col mt-2 pb-14 overflow-auto">
                    {
                        isPageLoaded
                            ?
                            sortedRooms?.length
                                ?
                                sortedRooms.map((data: any) =>
                                    <ChatCard
                                        {...data}
                                        key={data?._id}
                                    />
                                )
                                :
                                <div className="text-xl text-white font-bold w-full text-center font-segoeBold pt-20">No chats found bud</div>
                            :
                            <RoomSkeleton />
                    }
                </div>

            </div>
        </>
    )
}

export default LeftBar;