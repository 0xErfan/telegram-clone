'use client'
import Image from "next/image"
import { BiSearch } from "react-icons/bi"
import { ChatCard } from "../modules/ChatCard"
import { lazy, useEffect, useMemo, useState } from "react"
import { RoomModel } from "@/@types/data.t"
import { io } from 'socket.io-client'
import useUserStore from "@/zustand/userStore"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import RoomFolders from "./RoomFolders"
import CreateRoomBtn from "./CreateRoomBtn"

const SearchPage = lazy(() => import('@/components/templates/SearchPage'))
const Modal = lazy(() => import('../modules/Modal'))

const roomSocket = io('http://localhost:3001')

const LeftBar = () => {

    const [rooms, setRooms] = useState<RoomModel[]>([])
    const [filterBy, setFilterBy] = useState('all')
    const [isPageLoaded, setIsPageLoaded] = useState(false)
    const [forceRender, setForceRender] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const _id = useUserStore(state => state._id)
    const updater = useSockets(state => state.updater)
    const { setter: userDataUpdater, rooms: userRooms } = useUserStore(state => state)
    const { selectedRoom, setter, modalData } = useGlobalVariablesStore(state => state)

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

    useEffect(() => {

        if (!_id) return

        setIsPageLoaded(true)
        updater('rooms', roomSocket)
        userDataUpdater({ rooms })

        roomSocket.emit('joining', selectedRoom?._id)
        roomSocket.emit('getRooms', _id)

        roomSocket.on('joining', roomData => { roomData && setter({ selectedRoom: roomData }) })

        roomSocket.on('getRooms', (rooms: RoomModel[]) => {

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

        return () => {
            roomSocket.off('joining')
            roomSocket.off('getRooms')
            roomSocket.off('createRoom')
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

        return () => {
            roomSocket.off('deleteRoom')
        }
    }, [selectedRoom?._id])

    const openModal = () => {
        setter({ modalData: { ...modalData, isOpen: true, isCheckedText: 'Hi, do you like to be remembered?' } })
    }

    return (
        <div
            data-aos-duration="400"
            data-aos='fade-right'
            className={`flex-1 ${selectedRoom && 'hidden'} md:block bg-leftBarBg relative noScrollWidth px-4 overflow-y-auto`}
        >

            <div className="w-full sticky top-0 bg-leftBarBg space-y-1 pt-1 border-b border-white/5 z-30">

                <div className="flex items-center justify-between gap-6">

                    <div onClick={openModal} className="flex items-center flex-1 gap-5 mt-3 w-full text-white tex-[14px]">
                        <Image
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

            <div className="flex flex-col mt-2 overflow-auto">
                {
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
                }
            </div>

            {isSearchOpen && <SearchPage closeSearch={() => setIsSearchOpen(false)} />}

            {
                isPageLoaded && <Modal />
            }

            <CreateRoomBtn />

        </div>
    )
}

export default LeftBar;