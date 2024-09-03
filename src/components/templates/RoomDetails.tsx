'use client'

import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TbMessage } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Switch } from "@nextui-org/switch";
import { useMemo, useState } from "react";
import useUserStore from "@/zustand/userStore";


const RoomDetails = () => {

    const { setter, isRoomDetailsShown, selectedRoom, onlineUsers } = useGlobalVariablesStore(state => state) || {}
    const myID = useUserStore(state => state._id)
    const [isCopied, setIsCopied] = useState(false)
    const [notifications, setNotifications] = useState(true)

    const { participants, type } = { ...selectedRoom }

    const { avatar, name, username, link, _id, biography } = useMemo(() => {
        return type == 'private'
            ?
            (
                participants?.find((data: any) => data?._id !== myID)
                ||
                participants?.find((data: any) => data?._id == myID)
            )
            :
            (selectedRoom || '') as any
    }, [selectedRoom?._id])

    const copyText = () => {
        navigator.clipboard.writeText(username || link).then(() => setIsCopied(true))
        setTimeout(() => setIsCopied(false), 1000);
    }

    return (
        <section
            className={`flex-col ${isRoomDetailsShown ? 'xl:flex right-0 opacity-100' : 'xl:hidden -right-[400px] opacity-0'} duration-200 transition-all md:max-w-[400px] xl:static fixed xl:max-w-[400px] w-full bg-leftBarBg text-white md:inset-y-0 z-50`}
        >

            <div className="bg-[#2E323F] p-3 relative">

                <div className="flex items-center justify-between w-full ch:size-6 ch:cursor-pointer">
                    <IoClose onClick={() => setter({ isRoomDetailsShown: false })} />
                    <PiDotsThreeVerticalBold />
                </div>

                <div className="flex items-center gap-3 my-3">
                    {
                        avatar ?
                            <Image
                                src={avatar}
                                className="cursor-pointer object-cover size-[60px] rounded-full"
                                width={60}
                                height={60}
                                alt="avatar"
                            />
                            :
                            <div className='flex-center bg-darkBlue rounded-full size-[60px] shrink-0 text-center font-bold text-2xl'>{name![0]}</div>
                    }

                    <div className="flex justify-center flex-col gap-1">

                        <h3 className="font-bold text-[16px] font-segoeBold text-xl line-clamp-1 overflow-ellipsis">{_id == myID ? 'Saved messages' : name}</h3>

                        <div className="font-bold text-[14px] text-darkGray font-segoeBold line-clamp-1 whitespace-normal text-nowrap">
                            {
                                type == 'private'
                                    ?
                                    onlineUsers.some(data => { if (data.userID == _id) return true }) ? <span className="text-lightBlue">Online</span> : 'last seen recently'
                                    :
                                    `${participants?.length} members, ${onlineUsers.filter(data => participants?.includes(data.userID))?.length + ' online'}`
                            }
                        </div>

                    </div>
                </div>

                {
                    type == 'private' &&
                    <span className="absolute right-3 -bottom-7 size-14 rounded-full cursor-pointer bg-darkBlue flex-center">
                        <TbMessage className="size-7" />
                    </span>
                }

            </div>

            <div className="px-3 mt-5 space-y-4">

                <p className="text-lightBlue font-segoeBold">Info</p>

                {
                    biography &&
                    <div>
                        <p className="text-[16px]">{biography}</p>
                        <p className="text-darkGray text-[13px]">Bio</p>
                    </div>
                }

                <div className="flex items-center justify-between">

                    <div>
                        <p className="font-segoeLight text-[17px]">@{username || link}</p>
                        <p className="text-darkGray text-[13px]">{type === 'private' ? 'Username' : 'Link'}</p>
                    </div>

                    <div
                        onClick={copyText}
                        className="bg-white/5 cursor-pointer rounded p-2 transition-all duration-300"
                    >
                        {
                            isCopied
                                ?
                                <p className="text-sm" data-aos='zoom-out'>copied</p>
                                :
                                <IoCopyOutline
                                    data-aos='zoom-out'
                                    className="size-5"
                                />
                        }
                    </div>

                </div>

                <div className="flex items-center justify-between">

                    <div>
                        <p>Notifications</p>
                        <p className="text-darkGray text-[13px]">{notifications ? 'On' : 'Off'}</p>
                    </div>

                    <Switch
                        onChange={e => setNotifications(e.target.checked)}
                        isSelected={notifications}
                    />

                </div>

            </div>

        </section >
    )
}

export default RoomDetails;