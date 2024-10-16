import LineSeparator from "@/components/modules/LineSeparator"
import MenuItem from "@/components/modules/MenuItem"
import { copyText, showToast } from "@/utils"
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import useSockets from "@/zustand/useSockets"
import useUserStore from "@/zustand/userStore"
import Image from "next/image"
import { CgProfile } from "react-icons/cg"
import { CiBookmark } from "react-icons/ci"
import { FiUserPlus } from "react-icons/fi"
import { GoQuestion } from "react-icons/go"
import { IoCallOutline, IoSettingsOutline } from "react-icons/io5"
import { LuUsers } from "react-icons/lu"
import { RiUser3Line } from "react-icons/ri"

interface Props {
    updateRoute: (route: string) => void
    closeMenu: () => void
    isOpen: boolean
}

const Main = ({ closeMenu, updateRoute, isOpen }: Props) => {

    const { name, avatar, username, lastName, rooms } = useUserStore(state => state)
    const socket = useSockets(state => state.rooms)
    const setter = useGlobalVariablesStore(state => state.setter)

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

    const openProfile = () => updateRoute('settings')

    const createNewGroup = () => {
        const createRoom = useGlobalVariablesStore.getState().createRoom
        createRoom('group')
        closeMenu()
    }

    const openSavedMessages = () => {
        const savedMessageRoomID = rooms.find(room => room.type == 'private' && room.participants.length == 1)?._id
        socket?.emit('joining', savedMessageRoomID)
        closeMenu()
    }

    return (
        <nav className={`fixed ${isOpen ? 'left-0' : '-left-[400px]'} max-h-screen h-full overflow-auto duration-200 transition-all inset-y-0 z-[999999999999] bg-chatBg text-white w-[80%] max-w-[300px] md:max-w-[230px] lg:max-w-[300px]`}>

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

            <div className="mt-2 px-4">

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
                    onClick={() => updateRoute('settings')}
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
    )
}

export default Main