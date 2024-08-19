import ChatPage from "@/components/templates/ChatPage";
import Authentication from "./authentication/page";
import { NextUIProvider } from "@nextui-org/system";

const Home = () => {

    return (
        <Authentication>
            <NextUIProvider>
                <ChatPage />
            </NextUIProvider>
        </Authentication>
    )
}

export default Home;