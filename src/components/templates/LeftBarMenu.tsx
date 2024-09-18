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

interface Props {
    isOpen: boolean
    closeMenu: () => void
}

const LeftBarMenu = ({ closeMenu, isOpen }: Props) => {

    const { name, avatar, username, lastName } = useUserStore(state => state)

    return (
        <>
            <div
                onClick={closeMenu}
                className={`absolute ${isOpen ? 'w-full' : 'w-0'} left-0 inset-y-0 z-[99999999999] backdrop-filter bg-black/50 h-screen`}
            >

            </div>

            <nav className={`absolute ${isOpen ? 'left-0' : '-left-[400px]'} duration-200 transition-all inset-y-0 z-[999999999999] bg-chatBg text-white h-screen w-[80%] max-w-[350px]`}>

                <div className="flex flex-col pt-4 px-4 gap-3 cursor-pointer">
                    {
                        avatar ?
                            <Image
                                className={`size-[60px] bg-center object-cover rounded-full`}
                                width={60}
                                height={60}
                                quality={100}
                                src={avatar}
                                alt="avatar"
                            />
                            :
                            <div className="size-[60px] shrink-0 bg-darkBlue rounded-full flex-center text-bold text-center text-white text-2xl">{name?.length && name[0]}</div>
                    }

                    <div>
                        <p className="font-bold font-segoeBold text-[17px]">{name + ' ' + lastName}</p>
                        <p className="text-darkGray text-[14px]">{username}</p>
                    </div>

                </div>

                <div className="mt-2">
                    <MenuItem icon={<CgProfile />} title='My Profile' />
                    <LineSeparator />
                    <MenuItem icon={<LuUsers />} title='New Group' />
                    <MenuItem icon={<RiUser3Line />} title='Contacts' />
                    <MenuItem icon={<IoCallOutline />} title='Calls' />
                    <MenuItem icon={<CiBookmark />} title='Saved Messages' />
                    <MenuItem icon={<IoSettingsOutline />} title='Settings' />
                    <LineSeparator />
                    <MenuItem icon={<FiUserPlus />} title='Invite Friends' />
                    <MenuItem icon={<GoQuestion />} title='Telegram Features' />
                </div>

            </nav>
        </>
    )
}

type ItemProps = {
    title: string
    icon: JSX.Element
}
const MenuItem = ({ title, icon }: ItemProps) => {
    return <div className="py-3 px-4 flex items-center gap-6 w-full cursor-pointer">
        <div className="ch:size-[26] ch:text-white/40">{icon}</div>
        <p className="font-bold font-segoeBold">{title}</p>
    </div>
}

const LineSeparator = () => {
    return <div className="w-full h-px bg-black/30 my-1"></div>
}

export default LeftBarMenu