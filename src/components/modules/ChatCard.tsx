'use client'
import { MessageModel, RoomModel } from "@/@types/data.t"
import { getTimeFromDate } from "@/utils"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import Image from "next/image"

export const ChatCard = ({ messages, _id, name, avatar, lastMsgData }: RoomModel & { lastMsgData: MessageModel }) => {

    const { selectedRoom, setter } = useGlobalVariablesStore(state => state)
    const { rooms } = useSockets(state => state)

    const isActive = selectedRoom?._id == _id
    const latestMessageTime = getTimeFromDate(lastMsgData?.createdAt)
    const notSeenMessages = messages?.filter(data => !data.seen)?.length || null

    const joinToRoom = () => { rooms?.emit('joining', _id) }

    return (
        <div
            onClick={joinToRoom}
            className={`flex items-center gap-3 relative h-[70px] cursor-pointer transition-all duration-300 rounded overflow-hidden ${isActive && 'px-3'}`}
        >
            <>
                {
                    avatar ?
                        <Image
                            className={`size-[50px] bg-center rounded-full`}
                            width={50}
                            height={50}
                            src={avatar}
                            alt="avatar"
                        />
                        :
                        <div className="size-[50px] shrink-0 bg-darkBlue rounded-full flex-center text-bold text-center text-white text-2xl">{name.length && name[0]}</div>
                }
                {/* {
                    isOnline
                        ?
                        <span className={`absolute bg-lightBlue transition-all duration-300 ${isActive ? 'left-12' : 'left-9'} size-[10px] bottom-3 rounded-full`}></span>
                        : null
                } */}
            </>

            <div className="flex flex-col w-full ch:w-full gap-1 text-darkGray text-[14px]">

                <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-[16px] font-segoeBold line-clamp-1">{name}</p>
                    <p>{latestMessageTime || null}</p>
                </div>

                <div className="flex items-center justify-between">

                    <p className="line-clamp-1">{lastMsgData?.message || ''}</p>

                    <div className="flex items-center justify-between w-14">
                        <div className="flex-center text-center w-min px-2 bg-darkBlue text-white rounded-full">{notSeenMessages}</div>
                        <Image
                            priority
                            src='/shapes/pin.svg'
                            width={17}
                            height={17}
                            className="size-4 bg-center"
                            alt="pin shape"
                        />
                    </div>

                </div>
            </div>

            <span className={`absolute flex items-center ${isActive ? 'opacity-100' : 'opacity-0'} transition-all duration-200 activeChat inset-0 size-full bg-white/[6.05%]`}></span>

        </div>
    )
}
