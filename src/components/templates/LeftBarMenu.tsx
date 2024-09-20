import useUserStore from "@/zustand/userStore"
import Image from "next/image"
import { CgProfile } from "react-icons/cg";
import { LuUsers } from "react-icons/lu";
import { RiUser3Line } from "react-icons/ri";
import { IoCallOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { GoQuestion } from "react-icons/go";
import LineSeparator from "../modules/LineSeparator";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import { copyText, showToast } from "@/utils";
import useSockets from "@/zustand/useSockets";
import { useState } from "react";

interface Props {
    isOpen: boolean
    closeMenu: () => void
}

const LeftBarMenu = ({ closeMenu, isOpen }: Props) => {

    const [route, setRoute] = useState('/')
    const { name, avatar, username, lastName, rooms } = useUserStore(state => state)
    const setter = useGlobalVariablesStore(state => state.setter)
    const socket = useSockets(state => state.rooms)

    const getBack = () => {
        if (route.length === 1) return
        const lastRoutePart = route.lastIndexOf('/')
        setRoute(prev => prev.slice(0, lastRoutePart - 1))
    }

    const insert = () => {
        setRoute(prev => prev.concat(`${Math.floor(Math.random() * 10)}/`))
    }

    console.log(route)

    const showTelegramFeatures = () => {
        setter((prev: any) => ({
            ...prev,
            modalData: {
                ...prev.modalData,
                isOpen: true,
                title: 'Telegram Features',
                bodyText: `
                            1_End-to-End Encrypted Chats: Telegram offers secret chats that use end-to-end encryption, ensuring that only you and the intended recipient can read the messages. This feature enhances privacy and security for sensitive conversations.

                            2_Channels and Groups: Telegram allows users to create channels for broadcasting messages to a large audience or groups for chatting with friends or communities. Channels can have unlimited subscribers, while groups can accommodate up to 200,000 members.\n

                            3_Bots and Custom Integrations: Telegram supports bots, which are automated programs that can perform various tasks, from providing news updates to managing workflows. Users can create and customize bots using Telegram's Bot API, enabling endless possibilities for automation and interaction.\n

                            4_File Sharing and Unlimited Storage: Users can send files up to 2 GB in size and share a variety of file formats, including documents, photos, and videos. Telegram provides unlimited cloud storage, so users can access their files from any device without worrying about storage limits.\n

                            5_Multi-Platform Support: Telegram is available on various platforms, including mobile (iOS and Android), desktop (Windows, macOS, Linux), and web. This cross-platform functionality allows users to stay connected and access their messages seamlessly across different devices.\n
                `
            }
        }))
        closeMenu()
    }

    const copyInviteLink = async () => {
        await copyText(process.env.NEXT_PUBLIC_BASE_PATH!)
        showToast(true, 'Invite link copied!')
        closeMenu()
    }

    const openSavedMessages = () => {
        return getBack()
        const savedMessageRoomID = rooms.find(room => room.type == 'private' && room.participants.length == 1)?._id
        socket?.emit('joining', savedMessageRoomID)
        closeMenu()
    }

    const openProfile = () => {
        insert()
    }

    const createNewGroup = () => {
        alert(2)
    }

    return (
        <>
            <span
                onClick={closeMenu}
                className={`fixed ${isOpen ? 'w-full' : 'w-0 hidden'} h-[100vw] left-0 inset-y-0 z-[999999999999] backdrop-filter bg-black/30`}
            />

            <nav className={`fixed ${isOpen ? 'left-0' : '-left-[400px]'} max-h-screen h-full overflow-auto duration-200 transition-all inset-y-0 z-[999999999999] bg-chatBg text-white w-[80%] max-w-[350px]`}>

                <div className="flex flex-col pt-4 px-4 gap-3">
                    {
                        avatar ?
                            <Image
                                className={`size-[60px] bg-center object-cover rounded-full cursor-pointer`}
                                width={60}
                                onClick={openProfile}
                                height={60}
                                quality={100}
                                src={avatar}
                                alt="avatar"
                            />
                            :
                            <div onClick={openProfile} className="size-[60px] shrink-0 bg-darkBlue rounded-full flex-center text-bold text-center text-white cursor-pointer text-2xl">{name?.length && name[0]}</div>
                    }

                    <div>
                        <p className="font-bold font-segoeBold text-[17px]">{name + ' ' + lastName}</p>
                        <p className="text-darkGray text-[14px]">{username}</p>
                    </div>

                </div>

                <div className="mt-2">

                    <MenuItem
                        icon={<CgProfile />}
                        title='My Profile'
                        onClick={openProfile}
                    />

                    <LineSeparator />

                    <MenuItem
                        icon={<LuUsers />}
                        title='New Group'
                        onClick={createNewGroup}
                    />

                    <MenuItem
                        icon={<RiUser3Line />}
                        title='Contacts'
                    />

                    <MenuItem
                        icon={<IoCallOutline />}
                        title='Calls'
                        onClick={() => showToast(true, 'Call feature will add soon...!')}
                    />

                    <MenuItem
                        icon={<CiBookmark />}
                        title='Saved Messages'
                        onClick={openSavedMessages}
                    />

                    <MenuItem
                        icon={<IoSettingsOutline />}
                        title='Settings'
                    />

                    <LineSeparator />

                    <MenuItem
                        icon={<FiUserPlus />}
                        title='Invite Friends'
                        onClick={copyInviteLink}
                    />

                    <MenuItem
                        icon={<GoQuestion />}
                        title='Telegram Features'
                        onClick={showTelegramFeatures}
                    />

                </div>

            </nav>
        </>
    )
}

type ItemProps = {
    title: string
    icon: JSX.Element
    onClick?: () => void
}

const MenuItem = ({ title, icon, onClick }: ItemProps) => {
    return (
        <div
            onClick={onClick}
            className="py-3 px-4 flex items-center gap-6 w-full cursor-pointer"
        >
            <div className="ch:size-[26] ch:text-white/40">{icon}</div>
            <p className="font-bold font-segoeBold">{title}</p>
        </div>
    )
}

export default LeftBarMenu