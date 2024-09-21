import LeftBarContainer from "./LeftBarContainer";

interface Props {
    getBack: () => void
}

const Settings = ({ getBack }: Props) => {

    return (
        <section
            data-aos='fade-left'
            className="fixed max-h-screen h-full overflow-auto duration-300 transition-all inset-0 z-[999999999999] bg-leftBarBg text-white w-full"
        >
            <LeftBarContainer getBack={getBack} title="Settings">
                {
                    Array(50).fill(10).map(data => <p>{data + 'hi there'}</p>)
                }
            </LeftBarContainer>
        </section>
    )
}

export default Settings;