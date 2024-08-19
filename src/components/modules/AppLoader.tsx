import { SiTelegram } from "react-icons/si";

const AppLoader = () => {
    return (
        <div className="fixed bg-leftBarBg h-screen size-full z-[99999999999999999] flex-center">
            <SiTelegram className="size-40 animate-bounce rounded-full text-lightBlue" />
        </div>
    )
}

export default AppLoader