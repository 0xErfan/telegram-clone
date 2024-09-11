import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";

interface Props {
    isOpen: boolean
    isFromMe: boolean
    closeDropDown: () => void
}

const MessageActions = ({ isOpen, isFromMe, closeDropDown }: Props) => {

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
                    <DropdownItem key="new">New file</DropdownItem>
                    <DropdownItem key="copy">Copy link</DropdownItem>
                    <DropdownItem key="edit">Edit file</DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger">
                        Delete file
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}

export default MessageActions;