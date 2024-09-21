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
        <section
            data-aos='fade-left'
            className="fixed max-h-screen h-full overflow-auto duration-300 transition-all inset-0 z-[9999999999] bg-leftBarBg text-white w-full"
        >
            <div className=" w-full h-full max-w-full md:max-w-[30%]">

                <div className="flex items-center p-4 sticky top-0 bg-white/5 z-50 justify-between w-full text-white backdrop-filter-none">

                    <div className="flex items-center gap-4">
                        <IoArrowBackOutline onClick={getBack} className="size-6 cursor-pointer" />
                        {title ? <p className="font-bold font-segoeBold text-[17px]">{title}</p> : null}
                    </div>

                    {leftHeaderChild}

                </div>

                <div className="px-4 z-30">
                    {children}
                </div>

            </div>
        </section>
    )
}

export default LeftBarContainer;