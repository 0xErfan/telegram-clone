import { RoomModel, UserModel } from "@/@types/data.t"
import Image from "next/image"
import { useMemo } from "react"
import { MdDone } from "react-icons/md"

type ContactCardProps = {
    updateSelectedUsers: (id: string) => void
    userData: RoomModel
    isUserOnline: boolean
    selectedUsers: string[]
    myID: string
}

const ContactCard = ({ updateSelectedUsers, userData, isUserOnline, selectedUsers, myID }: ContactCardProps) => {

    const { name, _id } = useMemo(() => {
        return (userData.participants as UserModel[]).find((pd) => pd._id !== myID) as UserModel || ''
    }, [userData._id])

    return (
        <div onClick={() => updateSelectedUsers(_id)}>
            <div
                className="flex items-center gap-2 relative cursor-pointer"
            >
                {
                    userData.avatar ?
                        <Image
                            src={userData.avatar}
                            className="cursor-pointer object-cover size-[45px] rounded-full"
                            width={45}
                            height={45}
                            alt="avatar"
                        />
                        :
                        <div className='flex-center bg-darkBlue rounded-full size-[45px] shrink-0 text-center font-bold text-2xl'>{name![0]}</div>
                }
                <div className="flex flex-col justify-between border-b border-black/40 w-full py-2">

                    <p className="text-[17px] font-segoeBold line-clamp-1 overflow-ellipsis">{name}</p>

                    <p className="text-sm text-darkGray">
                        {
                            isUserOnline
                                ?
                                <span className="text-lightBlue">Online</span>
                                :
                                'last seen recently'
                        }
                    </p>

                </div>

                {
                    selectedUsers.includes(_id)
                    &&
                    <span
                        data-aos='zoom-in'
                        className="absolute flex-center right-3 h-[45%] button-[50%] ch:size-5 -translate-x-[50%] aspect-square rounded-full bg-green-600"
                    >
                        <MdDone />
                    </span>
                }

            </div>
        </div>
    )
}


export default ContactCard;