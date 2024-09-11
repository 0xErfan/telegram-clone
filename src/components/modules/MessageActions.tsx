import { MessageModel } from "@/@types/data.t";
import { copyText } from "@/utils";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { GoReply } from "react-icons/go";
import { MdContentCopy, MdOutlineModeEdit } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

interface Props {
    isOpen: boolean
    isFromMe: boolean
    msgData: MessageModel
    reply: () => void
    closeDropDown: () => void
}

const MessageActions = ({ isOpen, isFromMe, closeDropDown, msgData, reply }: Props) => {

    const copy = () => {
        copyText(msgData.message)
    }

    return (
        <div
            className="absolute ch:-z-20 inset-0 size-full -z-10 bg-inherit"
        >
            <Dropdown
                isOpen={isOpen}
                onClose={closeDropDown}
                crossOffset={isFromMe ? -150 : 150}
            >
                <DropdownTrigger><span></span></DropdownTrigger>

                <DropdownMenu variant="faded" aria-label="Static Actions">
                    <DropdownItem onClick={reply} startContent={<GoReply className="size-5" />} key="new">Reply</DropdownItem>
                    <DropdownItem onClick={copy} startContent={<MdContentCopy className="size-5" />} key="edit">Copy</DropdownItem>
                    <DropdownItem startContent={<MdOutlineModeEdit className="size-5" />} key="copy">Edit</DropdownItem>
                    <DropdownItem startContent={<AiOutlineDelete className="size-5" />} key="delete">Delete</DropdownItem>
                </DropdownMenu>

            </Dropdown>
        </div>
    )
}

export default MessageActions;