'use client'

import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { TbMessage } from "react-icons/tb";
import { IoCopyOutline } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { Switch } from "@nextui-org/switch";

const GroupDetails = () => {

    const { setter, isGroupDetailsShown } = useGlobalVariablesStore(state => state)

    return (
        <section className={`flex-col ${isGroupDetailsShown ? 'xl:flex right-0 opacity-100' : 'xl:hidden -right-[400px] opacity-0'} duration-200 transition-all md:max-w-[400px] xl:static fixed xl:max-w-[400px] w-full bg-leftBarBg text-white md:inset-y-0 z-50`}>

            <div className="bg-white/[6%] p-3 relative">

                <div className="flex items-center justify-between w-full ch:size-6 ch:cursor-pointer">
                    <IoClose onClick={() => setter({ isGroupDetailsShown: false })} />
                    <PiDotsThreeVerticalBold />
                </div>

                <div className="flex items-center gap-3 my-3">
                    {
                        'avatar'
                            ?
                            <Image
                                src={'/images/favicon.ico'}
                                className="cursor-pointer"
                                width={60}
                                height={60}
                                alt="avatar"
                            />
                            :
                            <div className='flex-center bg-darkBlue rounded-full size-[60px] shrink-0 text-center font-bold text-2xl'>Erfan</div>
                    }

                    <div className="flex justify-center flex-col gap-1">

                        <h3 className="font-bold text-[16px] font-segoeBold text-xl line-clamp-1 overflow-ellipsis">Erfan eftekhari</h3>

                        <div className="font-bold text-[14px] text-darkGray font-segoeBold line-clamp-1 whitespace-normal text-nowrap">
                            12 members, 12 online | last seen recently
                        </div>

                    </div>
                </div>

                {/* if the room is private */}
                <span className="absolute right-3 -bottom-7 size-14 rounded-full cursor-pointer bg-darkBlue flex-center">
                    <TbMessage className="size-7" />
                </span>

            </div>

            <div className="px-3 mt-5 space-y-4">

                <p className="text-lightBlue font-segoeBold">Info</p>

                <div>
                    <p className="text-[16px]">Some gangster shit text of a 12 y-o boy from rubika</p>
                    <p className="text-darkGray text-[13px]">Bio</p>
                </div>

                <div className="flex items-center justify-between">

                    <div>
                        <p className="font-segoeLight text-[17px]">@0xerfan</p>
                        <p className="text-darkGray text-[13px]">Username | Link</p>
                    </div>

                    <div className="bg-white/5 rounded p-2 transition-all duration-300">
                        {
                            'd'
                                ?
                                <IoCopyOutline
                                    data-aos='zoom-out'
                                    className="size-5 cursor-pointer"
                                />
                                :
                                <p className="text-sm" data-aos='zoom-out'>copied</p>
                        }
                    </div>

                </div>

                <div className="flex items-center justify-between">

                    <div>
                        <p>Notifications</p>
                        <p className="text-darkGray text-[13px]">On</p>
                    </div>

                    <Switch classNames={{ wrapper: 'bg-red-500 text-red-500' }} isSelected />

                </div>

            </div>

        </section >
    )
}

export default GroupDetails