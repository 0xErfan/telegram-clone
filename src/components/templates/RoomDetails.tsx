'use client'

import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TbMessage } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Switch } from "@nextui-org/switch";
import { useCallback, useEffect, useMemo, useState } from "react";
import useUserStore from "@/zustand/userStore";
import { RoomModel, UserModel } from "@/@types/data.t";
import axios from "axios";
import { showToast } from "@/utils";
import { Button } from "@nextui-org/button";
import useSockets from "@/zustand/useSockets";


const RoomDetails = () => {

    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [notifications, setNotifications] = useState(true)
    const [groupMembers, setGroupMembers] = useState<UserModel[]>([])

    const { setter, isRoomDetailsShown, selectedRoom, mockSelectedRoomData, onlineUsers } = useGlobalVariablesStore(state => state) || {}
    const myData = useUserStore(state => state)
    const roomSocket = useSockets(state => state.rooms)

    const { _id: myID, rooms } = myData
    const selectedRoomData = mockSelectedRoomData || selectedRoom
    const { participants, type, _id: roomID } = { ...selectedRoomData }

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
    }, [roomID])

    useEffect(() => {
        (
            async () => {
                if (type !== 'private' && roomID) {

                    setIsLoading(true)

                    try {
                        const { data: membersData, statusText } = await axios.post('/api/getMembers', { _id: roomID })
                        setGroupMembers(membersData)
                    } catch (error) { showToast(false, error as string) }
                    finally { setIsLoading(false) }
                }
            }
        )()
    }, [roomID, type])

    useEffect(() => {
        setter({ mockSelectedRoomData: null })
    }, [selectedRoom?._id])

    const copyText = () => {
        navigator.clipboard.writeText(username || link).then(() => setIsCopied(true))
        setTimeout(() => setIsCopied(false), 1000);
    }

    const openChat = () => {

        const roomHistory = rooms.find(data => data.name === myID + '-' + _id || data.name === _id + '-' + myID)

        if (roomHistory) {
            roomSocket?.emit('joining', roomHistory._id)
        } else {
            setter({
                selectedRoom: mockSelectedRoomData,
                mockSelectedRoomData: null
            })
        }

        setter({ isRoomDetailsShown: false })
    }

    const closeRoomDetails = () => {
        mockSelectedRoomData ? setter({ mockSelectedRoomData: null }) : setter({ isRoomDetailsShown: false })
    }

    const isUserOnline = useCallback((userId: string) => {
        return onlineUsers.some(data => { if (data.userID === userId) return true })
    }, [onlineUsers.length])

    return (
        <section
            className={`flex-col ${isRoomDetailsShown ? 'xl:flex right-0 opacity-100' : 'xl:hidden -right-[400px] opacity-0'} duration-200 transition-all md:max-w-[400px] xl:static fixed xl:max-w-[400px] w-full bg-leftBarBg text-white md:inset-y-0 z-50`}
        >

            <div className="bg-[#2E323F] p-3 relative">

                <div className="flex items-center justify-between w-full ch:size-6 ch:cursor-pointer">
                    <IoClose onClick={closeRoomDetails} />
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
                            <div className='flex-center bg-darkBlue rounded-full size-[60px] shrink-0 text-center font-bold text-2xl'>{name?.length && name![0]}</div>
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
                    <span onClick={openChat} className="absolute right-3 -bottom-7 size-14 rounded-full cursor-pointer bg-darkBlue flex-center">
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
                        size="sm"
                        isSelected={notifications}
                    />

                </div>

            </div>

            {
                type !== 'private' &&
                <div className="border-t border-black/40 px-3 mt-6">
                    {
                        isLoading ?
                            <div className="size-10 flex-center m-auto mt-4 rounded-full overflow-hidden">
                                <Button isLoading style={{ borderRadius: '100%' }} />
                            </div>
                            :
                            <div className="flex flex-col mt-3 w-full ch:w-full">
                                {
                                    groupMembers.length
                                        ?
                                        groupMembers.map(member =>
                                            <GroupMember
                                                key={member._id}
                                                {...member}
                                                myData={myData}
                                                isOnline={isUserOnline(member._id)}
                                            />
                                        )
                                        : null
                                }
                            </div>
                    }
                </div>
            }

        </section >
    )
}

const GroupMember = (userTarget: Partial<UserModel> & { isOnline: boolean, myData: UserModel }) => {

    const { avatar, name, _id, isOnline, myData } = userTarget
    const setter = useGlobalVariablesStore(state => state.setter)

    const roomData: Partial<RoomModel> = {
        admins: [myData._id, _id!],
        avatar,
        createdAt: Date.now().toString(),
        creator: myData._id,
        link: Date.now().toString(),
        locations: [],
        medias: [],
        messages: [],
        name: myData._id + '-' + _id,
        participants: [userTarget as any, myData],
        type: 'private',
        updatedAt: Date.now().toString()
    }

    const showProfile = () => {
        setter({ mockSelectedRoomData: roomData })
    }

    return (
        <div onClick={showProfile} className="flex items-center gap-2 cursor-pointer">
            {
                avatar ?
                    <Image
                        src={avatar}
                        className="cursor-pointer object-cover size-[45px] rounded-full"
                        width={45}
                        height={45}
                        alt="avatar"
                    />
                    :
                    <div className='flex-center bg-darkBlue rounded-full size-[45px] shrink-0 text-center font-bold text-2xl'>{name![0]}</div>
            }
            <div className="flex flex-col justify-between border-b border-black/40 w-full py-2">

                <p className="text-[17px] font-segoeBold">{name}</p>

                <p className="text-sm text-darkGray">
                    {
                        isOnline
                            ?
                            <span className="text-lightBlue">Online</span>
                            :
                            'last seen recently'
                    }
                </p>

            </div>

        </div>
    )
}

export default RoomDetails;