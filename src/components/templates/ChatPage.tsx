import LeftBar from "./LeftBar";
import RightBar from "./RightBar";

const App = () => {

    return (
        <div className="flex items-center bg-leftBarBg size-full ch:size-full h-screen overflow-y-hidden relative overflow-hidden">
            <LeftBar />
            <RightBar />
        </div>
    )
}

export default App;