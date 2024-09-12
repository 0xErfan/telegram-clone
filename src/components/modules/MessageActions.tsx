import { copyText } from "@/utils";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { GoReply } from "react-icons/go";
import { MdContentCopy, MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import useSockets from "@/zustand/useSockets";

const MessageActions = () => {

    const { modalData, setter } = useGlobalVariablesStore(state => state)
    const roomSocket = useSockets(state => state.rooms)
    const { msgData } = modalData

    const copy = () => copyText(msgData!.message)
    const reply = () => msgData?.addReplay(msgData._id)

    const deleteMessage = () => {
        setter(() => ({
            modalData: {
                ...modalData,
                isOpen: true,
                isCheckedText: 'Do you want to delete this message for all?',
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

    return (
        <Dropdown
            isOpen={Boolean(msgData)}
            onClose={onClose}
        >
            <DropdownTrigger><span></span></DropdownTrigger>

            <DropdownMenu variant="faded" aria-label="Static Actions">
                <DropdownItem onClick={reply} startContent={<GoReply className="size-5" />} key="new">Reply</DropdownItem>
                <DropdownItem onClick={copy} startContent={<MdContentCopy className="size-5" />} key="edit">Copy</DropdownItem>
                <DropdownItem startContent={<MdOutlineModeEdit className="size-5" />} key="copy">Edit</DropdownItem>
                <DropdownItem onClick={deleteMessage} startContent={<AiOutlineDelete className="size-5" />} key="delete">Delete</DropdownItem>
            </DropdownMenu>

        </Dropdown>
    )
}

export default MessageActions;