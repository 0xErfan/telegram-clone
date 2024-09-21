import { ReactNode } from "react"
import { IoArrowBackOutline } from "react-icons/io5";


interface Props {
    children: ReactNode
    title?: string
    leftHeaderChild?: ReactNode
    getBack: () => void
}

const LeftBarContainer = ({ children, leftHeaderChild, title, getBack }: Props) => {
    return (
        <div className=" w-full h-full px-4 max-w-full md:max-w-[30%]">

            <div className="flex items-center py-4 sticky top-0 bg-leftBarBg z-50 justify-between w-full text-white">

                <div className="flex items-center gap-4">
                    <IoArrowBackOutline onClick={getBack} className="size-6 cursor-pointer" />
                    {title ? <p className="font-bold font-segoeBold text-[17px]">{title}</p> : null}
                </div>

                {leftHeaderChild}

            </div>

            <>
                {children}
            </>

        </div>
    )
}

export default LeftBarContainer;