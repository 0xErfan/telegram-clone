import { MdAddAPhoto } from "react-icons/md";
import LeftBarContainer from "./LeftBarContainer";
import { BsChat } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoBell } from "react-icons/go";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { MdOutlineModeEdit } from "react-icons/md";
import { GoShieldCheck } from "react-icons/go";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { CiBatteryCharging } from "react-icons/ci";
import { MdLanguage } from "react-icons/md";
import Image from "next/image";
import useUserStore from "@/zustand/userStore";
import LineSeparator from "@/components/modules/LineSeparator";
import MenuItem from "@/components/modules/MenuItem";
import { useState } from "react";
import DropDown from "@/components/modules/DropDown";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import axios from "axios";
import { showToast } from "@/utils";

interface Props {
    getBack: () => void
    updateRoute: (route: string) => void
}

export const logout = async () => {
    try {
        await axios.get('/api/auth/logout', { method: 'get' })
        const setter = useUserStore.getState().setter
        setter({ isLogin: false })
    } catch (error) { showToast(false, 'Network issues bud!') }
}

const Settings = ({ getBack, updateRoute }: Props) => {

    const { avatar, name, lastName, username, biography, phone } = useUserStore(state => state)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false)

    const openLogOutModal = () => {

        const setter = useGlobalVariablesStore.getState().setter

        setter((prev: any) => ({
            modalData: {
                ...prev.modalData,
                isOpen: true,
                title: 'Log out',
                bodyText: 'Do you really want to log out?',
                okText: 'yup',
                onSubmit: logout
            }
        }))

    }

    const dropDownItems = [
        {
            title: 'Edit info',
            onClick: () => updateRoute('edit-info'),
            icon: <MdOutlineModeEdit className="size-6 mr-2" />
        },
        {
            title: 'Set Profile Photo',
            onClick: () => updateRoute('edit-info'),
            icon: <MdAddAPhoto className="size-6 mr-2" />
        },
        {
            title: 'Log out',
            onClick: openLogOutModal,
            icon: <TbLogout className="size-6 mr-2" />
        }
    ]

    return (
        <LeftBarContainer
            getBack={getBack}
            leftHeaderChild={
                <>
                    <BsThreeDotsVertical
                        onClick={() => setIsDropDownOpen(true)}
                        className="size-8 cursor-pointer ml-auto pr-2"
                    />

                    <DropDown
                        isOpen={isDropDownOpen}
                        onClose={() => setIsDropDownOpen(false)}
                        dropDownItems={dropDownItems}
                    />
                </>
            }
        >

            <div className="relative -mx-4">

                <div className="absolute px-4 inset-x-0 w-full">

                    <div className="flex items-center gap-3 my-3">
                        {
                            avatar ?
                                <Image
                                    src={avatar}
                                    className="cursor-pointer object-cover size-[55px] rounded-full"
                                    width={55}
                                    height={55}
                                    alt="avatar"
                                />
                                :
                                <div className='flex-center bg-darkBlue rounded-full size-[55px] shrink-0 text-center font-bold text-2xl'>{name?.length && name![0]}</div>
                        }

                        <div className="flex justify-center flex-col gap-1">

                            <h3 className="font-bold text-[17px] font-segoeBold line-clamp-1 overflow-ellipsis">{name + ' ' + lastName}</h3>

                            <div className="font-bold text-[14px] text-darkGray font-segoeBold line-clamp-1 whitespace-normal text-nowrap">Online</div>

                        </div>
                    </div>

                    <span className="absolute right-5 top-12 size-14 rounded-full cursor-pointer bg-darkBlue flex-center">
                        <MdAddAPhoto className="size-6" />
                    </span>

                </div>

                <div className="h-[79px]"></div>

                <div className="px-4">
                    <div className="flex flex-col gap-2 pt-4">

                        <p className="text-darkBlue font-segoeRegular pt-1 font-bold text-[16px]">Account</p>

                        <div className="cursor-pointer">
                            <p className="text-[16px]">
                                +98 {phone.toString().split('').map((str, index) => (
                                    str + (((index + 1) % 3 === 0) ? ' ' : '')
                                ))}
                            </p>
                            <p className="text-darkGray text-[13px]">Tap to change phone number</p>
                        </div>

                        <LineSeparator />

                        <div className="cursor-pointer">
                            <p className="text-[16px]">{username}</p>
                            <p className="text-darkGray text-[13px]">Username</p>
                        </div>

                        {
                            biography &&
                            <>

                                <LineSeparator />

                                <div className="cursor-pointer">
                                    <p className="text-[16px]">{biography}</p>
                                    <p className="text-darkGray text-[13px]">Bio</p>
                                </div>
                            </>
                        }

                    </div>

                    <p className="h-3 w-full bg-black/70 inset-x-0 my-3 absolute"></p>

                    <div className="flex flex-col gap-2 pt-4">

                        <p className="text-darkBlue font-segoeRegular pt-4 font-bold text-[16px]">Settings</p>

                        <MenuItem
                            spaceY="py-1"
                            icon={<BsChat />}
                            title="Chat Settings"
                            onClick={() => { }}
                        />

                        <LineSeparator />

                        <MenuItem
                            spaceY="py-1"
                            icon={<CiLock />}
                            title="Privacy and Security"
                            onClick={() => { }}
                        />

                        <LineSeparator />

                        <MenuItem
                            spaceY="py-1"
                            icon={<GoBell />}
                            title="Notifications and Sounds"
                            onClick={() => { }}
                        />

                        <LineSeparator />

                        <MenuItem
                            spaceY="py-1"
                            icon={<CiBatteryCharging />}
                            title="Power Saving"
                            onClick={() => { }}
                        />

                        <LineSeparator />

                        <MenuItem
                            spaceY="py-1"
                            icon={<MdLanguage />}
                            title="Languages"
                            onClick={() => { }}
                        />

                    </div>

                    <p className="h-3 w-full bg-black/70 inset-x-0 my-3 absolute"></p>

                    <div className="flex flex-col gap-2 pt-4">

                        <p className="text-darkBlue font-segoeRegular pt-4 font-bold text-[16px]">Help</p>

                        <MenuItem
                            spaceY="py-1"
                            icon={<IoChatbubbleEllipsesOutline />}
                            title="Ask a Question"
                            onClick={() => { }}
                        />

                        <LineSeparator />

                        <MenuItem
                            spaceY="py-1"
                            icon={<AiOutlineQuestionCircle />}
                            title="Telegram FAQ"
                            onClick={() => { }}
                        />

                        <LineSeparator />

                        <MenuItem
                            spaceY="py-1"
                            icon={<GoShieldCheck />}
                            title="Privacy Policy"
                            onClick={() => { }}
                        />

                    </div>
                </div>

                <div className="w-full inset-x-0 mt-3 px-4 py-2 absolute bg-black/70">Created with lots of effort & ❤️ by <a target="_blank" href="https://github.com/0xErfan" className="underline text-darkBlue">0xErfan</a> </div>

            </div>
        </LeftBarContainer>
    )
}

export default Settings;