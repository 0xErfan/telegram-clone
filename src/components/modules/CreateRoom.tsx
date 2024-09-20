import { RoomModel, UserModel } from "@/@types/data.t"
import useUserStore from "@/zustand/userStore"
import { IoMdArrowRoundBack } from "react-icons/io"
import { BsEmojiSmile } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import { MdAddAPhoto } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore"
import { ChangeEvent, useMemo, useState } from "react"
import ContactCard from "./ContactCard";
import { Button } from "@nextui-org/button"
import Image from "next/image";
import { generateRandomHex, showToast, uploadImage } from "@/utils";
import useSockets from "@/zustand/useSockets";

type Props = {
    roomType: RoomModel['type']
    close: () => void
}

const CreateRoom = ({ roomType, close }: Props) => {

    if (!roomType) return

    const { _id: myID, rooms } = useUserStore(state => state)
    const userContacts = rooms.filter(room => room.type === 'private' && room.participants.length > 1)
    const onlineUsers = useGlobalVariablesStore(state => state.onlineUsers)
    const socket = useSockets(state => state.rooms)

    const [isRoomInfoPartShown, setIsRoomInfoPartShown] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [roomImage, setRoomImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [roomName, setRoomName] = useState('')
    const [search, setSearch] = useState('')

    const filteredUserCards = useMemo(() => {
        return userContacts?.length
            ?
            [...userContacts].filter(data => (data.participants as UserModel[]).find(pd => pd._id !== myID)?.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
            : []
    }, [search, userContacts?.length])

    const isUserOnline = (id: string) => {
        return onlineUsers.some(data => {
            if (data.userID === id) return true
        })
    }

    const updateSelectedUsers = (userID: string) => {

        let currentSelectedUsers = [...selectedUsers]

        if (currentSelectedUsers.includes(userID)) {
            const userTargetIndex = currentSelectedUsers.findIndex(id => id === userID)
            currentSelectedUsers.splice(userTargetIndex, 1) // splice instead of filter have a better performance here bud
            setSelectedUsers(currentSelectedUsers)
            return
        }

        setSelectedUsers(prev => [...prev, userID])
    }

    const getBackBtn = () => {
        isRoomInfoPartShown ? setIsRoomInfoPartShown(false) : close()
    }

    const getImgUrl = (e: ChangeEvent<HTMLInputElement>) => {

        const imgFile = e.target.files![0]

        if (imgFile) {

            const fileReader = new FileReader()
            fileReader.onload = ev => setRoomImage(ev.target?.result as string)

            fileReader.readAsDataURL(imgFile)
            setImageFile(imgFile)

        }

        e.target.files = null; // reset the input value to default
    }

    const createRoom = async () => {

        const name = roomName.trim()
        if (!name?.length) return showToast(false, 'A room name please?')

        setIsLoading(true)

        let imageUrl
        let uploadError = false

        if (roomImage) {
            try {
                const uploadedImageUrl = await uploadImage(imageFile as File)
                imageUrl = uploadedImageUrl
            } catch (error) {
                showToast(false, 'Failed to upload image, you can try again bud')
                setIsLoading(false)
                uploadError = true
                return
            }
        }

        if (uploadError) return

        const roomData: Partial<RoomModel> = {
            name: roomName,
            admins: [myID],
            avatar: imageUrl as string,
            participants: [...selectedUsers, myID],
            type: roomType,
            creator: myID,
            link: '@' + generateRandomHex(20),
            locations: [],
            medias: [],
            messages: []
        }

        socket?.emit('createRoom', { newRoomData: roomData })

        socket?.on('createRoom', () => {
            setTimeout(() => {
                setIsLoading(false)
                setSelectedUsers([])
                setSearch('')
                setRoomName('')
                setIsRoomInfoPartShown(false)
                setRoomImage(null)
                close()
            }, 300);
        })
    }

    return (
        <section className="fixed inset-y-0 max-w-full md:max-w-[29.6%] left-0 z-[9999999] bg-leftBarBg size-full bg-inherit text-white">

            <div className="flex gap-3 bg-inherit items-center justify-between w-full ch:w-full px-4 py-4">

                <IoMdArrowRoundBack
                    onClick={getBackBtn}
                    className="size-6 -mx-2 cursor-pointer basis-[10%]"
                />

                {
                    isRoomInfoPartShown
                        ?
                        <p className="capitalize">New {roomType}</p>
                        :
                        <p className="capitalize">New {roomType} {selectedUsers.length ? ` | ${selectedUsers.length} selected` : null}</p>
                }

            </div>

            {
                isRoomInfoPartShown
                    ?
                    <div className="flex items-center gap-3 w-full px-4 mt-3">
                        {
                            roomImage ?
                                <Image
                                    src={roomImage}
                                    onClick={() => setRoomImage(null)}
                                    className="cursor-pointer z-20 object-cover size-[60px] rounded-full"
                                    width={60}
                                    height={60}
                                    alt="avatar"
                                />
                                :
                                <div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="imgUpload"
                                        onChange={getImgUrl}
                                    />
                                    <label htmlFor="imgUpload">
                                        <MdAddAPhoto className='flex-center cursor-pointer bg-darkBlue rounded-full size-[60px] p-4 overflow-visible shrink-0 text-center font-bold text-2xl' />
                                    </label>
                                </div>
                        }

                        <div className="flex items-center gap-3 border-b-2 border-darkBlue w-full">
                            <input
                                type="text"
                                value={roomName}
                                onChange={e => setRoomName(e.target.value)}
                                className="w-full basis-[90%] p-2 rounded bg-inherit outline-none"
                                placeholder={`Enter ${roomType} name`}
                            />
                            <BsEmojiSmile className="basis-[10%] cursor-pointer shrink-0 size-5" />
                        </div>

                    </div>
                    :
                    <>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-inherit p-1 w-full px-4 outline-none"
                            placeholder="Who would you like to add ?"
                        />

                        <div className="px-3 mt-6">
                            <div className="flex flex-col mt-3 w-full ch:w-full">
                                {
                                    filteredUserCards?.map(userData =>
                                        <ContactCard
                                            key={userData._id}
                                            isUserOnline={isUserOnline(userData._id)}
                                            selectedUsers={selectedUsers}
                                            updateSelectedUsers={updateSelectedUsers}
                                            userData={userData}
                                            myID={myID}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </>
            }

            <Button
                isLoading={isLoading}
                disabled={isLoading}
                style={{ height: '64px' }}
                size="sm"
                className='absolute right-4 md:right-0 xl:right-3 bottom-4 text-white rounded-full bg-darkBlue flex-center z-[99999999]'
                onClick={() => {
                    isRoomInfoPartShown ?
                        createRoom()
                        :
                        setIsRoomInfoPartShown(true)
                }}
            >
                {
                    isLoading
                        ? null
                        :
                        isRoomInfoPartShown
                            ?
                            <MdDone
                                data-aos='zoom-out'
                                className="size-7"
                            />
                            :
                            <FaArrowRight
                                data-aos='zoom-out'
                                className="size-[27px]"
                            />
                }
            </Button>

        </section>
    )
}

export default CreateRoom;