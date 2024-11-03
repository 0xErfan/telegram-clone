import { copyText, getTimeReportFromDate, showToast } from "@/utils";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { GoReply } from "react-icons/go";
import { MdContentCopy, MdOutlineModeEdit, MdOutlinePlayCircle } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useSockets from "@/zustand/useSockets";
import { LuPin } from "react-icons/lu";
import { Key, useEffect, useMemo, useState } from "react";
import useUserStore from "@/zustand/userStore";
import { UserModel } from "@/@types/data.t";
import axios from "axios";
import { Button } from "@nextui-org/button";

const MessageActions = () => {

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [playedByUsersData, setPlayedByUsersData] = useState([])
    const [loading, setLoading] = useState(false)

    const { modalData, setter } = useGlobalVariablesStore(state => state)
    const roomSocket = useSockets(state => state.rooms)
    const myID = useUserStore(state => state._id)

    const { msgData } = modalData
    const copy = () => { copyText(msgData!.message); onClose() }
    const pin = () => { msgData?.pin(msgData?._id); onClose() }
    const reply = () => msgData?.addReplay(msgData._id)
    const edit = () => msgData?.edit(msgData._id)

    const roomData = useMemo(() => {
        const rooms = useUserStore.getState()?.rooms
        return rooms.find(room => room._id === msgData?.roomID)
    }, [msgData?.roomID])

    const deleteMessage = () => {
        setter(() => ({
            modalData: {
                ...modalData,
                isOpen: true,
                title: 'Delete message',
                bodyText: 'Are you sure you want to delete this message?',
                isCheckedText: 'Also delete for others',
                onSubmit: () => {
                    const isChecked = useGlobalVariablesStore.getState().modalData.isChecked
                    roomSocket?.emit('deleteMsg', { forAll: isChecked, msgID: msgData?._id, roomID: msgData?.roomID })
                }
            }
        }))
    }

    const onClose = () => {
        setter((prev: typeof setter) => ({
            modalData: { ...prev.modalData, msgData: null }
        }))
    }

    const openProfile = (profileData: UserModel) => {
        setter((prev: typeof setter) => ({
            mockSelectedRoomData: profileData,
            shouldCloseAll: true,
            isRoomDetailsShown: true,
            modalData: { ...prev.modalData, msgData: null }
        })
        )
    }

    useEffect(() => {
        (
            async () => {

                const playedByIds = msgData?.voiceData?.playedBy
                if (!playedByIds?.length) return;

                try {
                    setLoading(true)
                    const { data, statusText } = await axios.post('/api/playedByData', { msgID: msgData?._id })
                    if (statusText === 'OK') setPlayedByUsersData(data)
                } catch (error) { showToast(false, 'Failed to fetch data, try again i think') }
                finally { setLoading(false) }
            }
        )()
    }, [msgData?.voiceData?.playedBy?.length, msgData?._id])

    return (
        <>
            <Dropdown
                isOpen={Boolean(msgData)}
                size="lg"
                className="bg-[#2E323F] text-white"
                style={{ zIndex: '999999999999999' }}
                classNames={{ content: 'p-0 m-0' }}
                closeOnSelect={false}
                onClose={onClose}
                key={isCollapsed as unknown as Key}
            >
                <DropdownTrigger><span></span></DropdownTrigger>

                <DropdownMenu variant="faded" aria-label="Static Actions">

                    {
                        msgData?.voiceData?.playedBy?.length &&
                        <DropdownItem
                            className='absolute -top-14 z-20 right-0 inset-x-0 w-full h-12 rounded-xl p-2 flex items-center justify-center'
                            style={{ backgroundColor: '#2E323F', border: 'none', color: 'inherit' }}
                            startContent={isCollapsed ? <IoArrowBackOutline className="size-5" /> : <MdOutlinePlayCircle className="size-5" />}
                            key={`playedBy ${isCollapsed}`}
                            data-aos='fade-left'
                            onClick={() => setIsCollapsed(prev => !prev)}
                        >
                            <div className="flex items-center justify-between">

                                <p>{isCollapsed ? 'Back' : 'played by'}</p>

                                {
                                    !isCollapsed
                                        ?
                                        <div className="pr-2">
                                            {
                                                loading
                                                    ?
                                                    <div className="size-10 flex-center m-auto rounded-full overflow-hidden">
                                                        <Button isLoading size="sm" style={{ borderRadius: '100%', backgroundColor: 'transparent' }} />
                                                    </div>
                                                    :
                                                    playedByUsersData?.length
                                            }
                                        </div>
                                        : null
                                }

                            </div>
                        </DropdownItem>
                    }

                    {
                        isCollapsed
                            ?
                            <DropdownItem
                                className="absolute h-60 z-30 overflow-auto inset-0" style={{ backgroundColor: '#2E323F', border: 'none', color: 'inherit' }}
                                data-aos='fade-left'
                            >
                                <div className="absolute top-3 flex flex-col gap-2">
                                    {
                                        playedByUsersData?.map((userData: UserModel) =>
                                            <div
                                                className="w-full flex items-center gap-2"
                                                key={userData._id}
                                                onClick={() => openProfile(userData)}
                                            >
                                                <div className="size-8 flex items-center justify-center rounded-full bg-gray-300">
                                                    {
                                                        userData?.avatar
                                                            ?
                                                            <img src={userData?.avatar} alt="user avatar" />
                                                            :
                                                            <p className='font-segoeBold font-bold text-lg'>{userData.name[0]}</p>
                                                    }
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="line-clam-1 font-bold font-segoeBold">{userData?._id == myID ? 'You' : userData?.name}</p>
                                                    <p className="line-clamp-1 text-[12px] overflow-hidden text-darkGray">{'seenTime' in userData ? getTimeReportFromDate(userData.seenTime as string) : ''}</p>
                                                </div>
                                            </div>)
                                    }
                                </div>
                            </DropdownItem>
                            : null
                    }

                    {
                        // if the room is not chanel or if it is, user should be admin
                        ((roomData?.type && roomData?.type !== 'chanel') || roomData?.admins?.includes(myID))
                        &&
                        <DropdownItem
                            className="p-3"
                            onClick={reply}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit' }}
                            startContent={<GoReply className="size-5" />}
                            key="reply"
                        >
                            Reply
                        </DropdownItem> as any
                    }

                    {
                        ((roomData?.type && roomData?.type !== 'chanel') || roomData?.admins?.includes(myID))
                        &&
                        <DropdownItem
                            className="p-3"
                            onClick={pin}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit' }}
                            startContent={<LuPin className="size-5" />}
                            key="pin"
                        >
                            Pin
                        </DropdownItem> as any
                    }

                    <DropdownItem
                        className="p-3"
                        onClick={copy}
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit' }}
                        startContent={<MdContentCopy className="size-5" />}
                        key="edit"
                    >
                        Copy
                    </DropdownItem>

                    {
                        (roomData?.type == 'private' && msgData?.sender?._id == myID) || (roomData?.type !== 'private' && msgData?.sender._id === myID)
                            ?
                            <DropdownItem className="p-3" onClick={edit} style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit' }} startContent={<MdOutlineModeEdit className="size-5" />} key="copy">Edit</DropdownItem>
                            : null!
                    }

                    {
                        (roomData?.type === 'private' || msgData?.sender._id === myID || roomData?.admins?.includes(myID))
                            ?
                            <DropdownItem
                                className="p-3"
                                onClick={deleteMessage}
                                style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit' }}
                                startContent={<AiOutlineDelete className="size-5" />}
                                key="delete"
                            >
                                Delete
                            </DropdownItem>
                            : null
                    }

                </DropdownMenu>

            </Dropdown >
        </>
    )
}

export default MessageActions;