import GroupDetails from "./GroupDetails";
import LeftBar from "./LeftBar";
import MiddleBar from "./RightBar";

const App = () => {
    return (
        <div className="flex items-center bg-leftBarBg size-full ch:size-full transition-all duration-400 h-screen overflow-y-hidden relative overflow-hidden">
            <LeftBar />
            <MiddleBar />
            <GroupDetails/>
        </div>
    )
}

export default App;