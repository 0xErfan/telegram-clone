import Authentication from "@/components/templates/Authentication";
import App from "@/components/templates/ChatPage";

const Home = () => {

    return (
        <Authentication>
            <App />
        </Authentication>
    )
}

export default Home;