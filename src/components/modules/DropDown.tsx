import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown"
import { ReactNode } from "react"

type DropDownItem = {
    onClick: () => void
    title: string
    icon?: ReactNode
}

interface Props {
    isOpen: boolean
    onClose: () => void
    dropDownItems: DropDownItem[]
}

const DropDown = ({ isOpen, dropDownItems, onClose }: Props) => {

    return (
        <Dropdown
            isOpen={isOpen}
            size="lg"
            className="bg-[#2E323F] text-white"
            style={{ zIndex: '999999999999999' }}
            placement="left"
            classNames={{ content: 'p-0 m-0' }}
            onClose={onClose}
        >
            <DropdownTrigger><span></span></DropdownTrigger>

            <DropdownMenu variant="faded" aria-label="Static Actions">

                {
                    dropDownItems.map(({ onClick, title, icon }) =>
                        <DropdownItem
                            className="p-3 font-segoeLight"
                            onClick={onClick}
                            startContent={icon}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'inherit', fontWeight: 'bold'}}
                            key={title}
                        >
                            {title}
                        </DropdownItem>)
                }

            </DropdownMenu>

        </Dropdown>
    )
}

export default DropDown