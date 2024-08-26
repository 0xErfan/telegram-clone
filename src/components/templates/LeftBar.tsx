'use client'
import Image from "next/image"
import { BiSearch } from "react-icons/bi"
import ChatFolders from "../modules/ChatFolders"
import { ChatCard } from "../modules/ChatCard"
import { useEffect, useRef, useState } from "react"
import { MessageModel, RoomModel } from "@/@types/data.t"
import { io } from 'socket.io-client'
import useUserStore from "@/zustand/userStore"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"

const roomSocket = io('http://localhost:3001')

const LeftBar = () => {

    const [rooms, setRooms] = useState<RoomModel[]>([])
    const chatFolderRef = useRef<HTMLDivElement>(null)

    const { _id } = useUserStore(state => state)
    const { updater } = useSockets(state => state)
    const { selectedRoom, setter } = useGlobalVariablesStore(state => state)

    useEffect(() => {

        updater('rooms', roomSocket)

        roomSocket.emit('getRooms', _id)

        roomSocket.on('getRooms', (rooms: RoomModel[]) => {

            setRooms(rooms)

            roomSocket.on('lastMsgUpdate', newMsg => {
                setRooms(prev => prev.map((roomData: any) => {
                    if (roomData._id === newMsg.roomID) {
                        roomData.lastMsgData = newMsg
                    }
                    return roomData
                }))
            })
        })

        roomSocket.on('joining', data => { setter({ selectedRoom: data }) })

        return () => {
            roomSocket.off('getRooms')
            roomSocket.off('joining')
            roomSocket.off('lastMsgUpdate')
        }
    }, [])

    useEffect(() => {

        const handleScroll = (event: WheelEvent) => {
            event.preventDefault();
            const scrollAmount = event.deltaY < 0 ? -30 : 30
            chatFolderRef.current!.scrollBy({ left: scrollAmount });
        }

        chatFolderRef.current!.addEventListener('wheel', handleScroll);
        return () => chatFolderRef.current!?.removeEventListener('wheel', handleScroll);

    }, [])

    // useEffect(() => {
    //     setRooms(prev => prev.map((room: any) => {
    //         if (room._id === selectedRoom?._id) {
    //             room.lastMsgData = selectedRoom?.messages[selectedRoom?.messages.length - 1]
    //         }
    //         return room;
    //     }))
    // }, [selectedRoom?.messages.length])

    useEffect(() => {
        roomSocket.emit('joining', selectedRoom?._id)
        return () => { roomSocket.emit('leavingRoom', selectedRoom?._id) }
    }, [selectedRoom?._id])

    return (
        <div
            data-aos-duration="400"
            data-aos='fade-right'
            className={`flex-1 ${selectedRoom && 'hidden'} md:block bg-leftBarBg noScrollWidth px-4 overflow-y-auto`}
        >

            <div className="w-full sticky top-0 bg-leftBarBg space-y-1 pt-1 border-b border-white/5 z-30">

                <div className="flex items-center justify-between gap-6">

                    <div className="flex items-center flex-1 gap-5 mt-3 w-full text-white tex-[14px]">
                        <Image
                            className="cursor-pointer"
                            src="/shapes/hamberger.svg"
                            width={18}
                            height={15}
                            alt="hambergerMenu"
                        />
                        <h1 className="font-bold font-segoeBold">Telegram</h1>
                    </div>

                    <BiSearch className="cursor-pointer size-[23px] text-white/90 mt-3" />

                </div>

                <div
                    ref={chatFolderRef}
                    className="flex items-center noScrollWidth gap-5 overflow-x-auto h-10 text-darkGray ch:py-1 ch:w-fit z-40"
                >
                    <ChatFolders key={2} count={2} name="All" />
                    <ChatFolders key={32} count={32} name="Groups" />
                    <ChatFolders key={212} count={212} isActive name="Private" />
                    <ChatFolders key={5} count={5} name="Bots" />
                    <ChatFolders key={53} count={5} name="Bots" />
                </div>

            </div>

            <div className="flex flex-col mt-2 overflow-auto">
                {
                    rooms?.length
                        ?
                        rooms
                            .sort((a: any, b: any) => {
                                const aTime = new Date(a?.lastMsgData?.createdAt).getTime()
                                const bTime = new Date(b?.lastMsgData?.createdAt).getTime()
                                return bTime - aTime
                            })
                            .map((data: any) =>
                                <ChatCard
                                    {...data}
                                    key={data?._id}
                                />
                            )
                        : <div className="text-xl text-white font-bold w-full text-center font-segoeBold pt-20">No chats found bud</div>
                }
            </div>

        </div>
    )
}

export default LeftBar;