import { MdAddAPhoto } from "react-icons/md";
import LeftBarContainer from "./LeftBarContainer";
import { BsChat } from "react-icons/bs";
import { CiLock } from "react-icons/ci";
import { GoBell } from "react-icons/go";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { GoShieldCheck } from "react-icons/go";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { CiBatteryCharging } from "react-icons/ci";
import { MdLanguage } from "react-icons/md";
import Image from "next/image";
import useUserStore from "@/zustand/userStore";
import LineSeparator from "@/components/modules/LineSeparator";
import MenuItem from "@/components/modules/MenuItem";

interface Props {
    getBack: () => void
}

const Settings = ({ getBack }: Props) => {

    const { avatar, name, lastName, username, biography } = useUserStore(state => state)

    return (
        <section
            data-aos='fade-left'
            className="fixed max-h-screen h-full overflow-auto duration-300 transition-all inset-0 z-[9999999999] bg-leftBarBg text-white w-full"
        >
            <LeftBarContainer getBack={getBack} title="Settings">
                <>
                    <div className="absolute px-4 inset-x-0 w-full bg-white/5">

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

                        <span className="absolute right-3 top-12 size-14 rounded-full cursor-pointer bg-darkBlue flex-center">
                            <MdAddAPhoto className="size-6" />
                        </span>

                    </div>

                    <div className="h-[79px]"></div>

                    <div className="flex flex-col gap-2 pt-4">

                        <p className="text-darkBlue font-segoeRegular pt-1 font-bold text-[16px]">Account</p>

                        {/* static */}
                        <div>
                            <p className="text-[17px]">+98 903 635 4362</p>
                            <p className="text-darkGray text-[13px]">Tap to change phone number</p>
                        </div>

                        <LineSeparator />

                        <div>
                            <p className="text-[17px]">{username}</p>
                            <p className="text-darkGray text-[13px]">Username</p>
                        </div>

                        {
                            biography &&
                            <div>
                                <p className="text-[17px]">{biography}</p>
                                <p className="text-darkGray text-[13px]">Bio</p>
                            </div>
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

                    <div className="w-full inset-x-0 mt-3 px-4 py-2 absolute bg-black/70">Created with lots of effort & ❤️ by <a target="_blank" href="https://github.com/0xErfan" className="underline text-darkBlue">0xErfan</a> </div>
                </>
            </LeftBarContainer>
        </section>
    )
}

export default Settings;