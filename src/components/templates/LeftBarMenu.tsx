import { ReactNode, useEffect, useState } from "react";
import Main from "./LeftBarMenuPaes/Main";
import Settings from "./LeftBarMenuPaes/Settings";
import EditInfo from "./LeftBarMenuPaes/EditInfo";
import EditUsername from "./LeftBarMenuPaes/EditUsername";

interface Props {
    isOpen: boolean
    closeMenu: () => void
}

const LeftBarMenu = ({ closeMenu, isOpen }: Props) => {

    const [route, setRoute] = useState('/settings/edit-info')
    const [activeRoute, setActiveRoute] = useState<ReactNode>(<div></div>)

    const getBack = () => {

        if (route.length === 1) return

        const lastIndex = route.lastIndexOf('/')
        const updatedRoute = route.slice(0, lastIndex) || '/'

        setRoute(updatedRoute)
    }

    const updateRoute = (path: string) => {

        setRoute(prev => {
            return prev.includes(path)
                ?
                prev
                :
                prev.concat(`${prev.length !== 1 ? '/' : ''} ${path}`).replaceAll(' ', '')
        })

    }

    useEffect(() => {

        switch (route) {
            case '/': {
                setActiveRoute(
                    <Main
                        isOpen={isOpen}
                        closeMenu={closeMenu}
                        updateRoute={updateRoute}
                    />
                )
                break;
            }
            case '/settings': {
                setActiveRoute(<Settings updateRoute={updateRoute} getBack={getBack} />)
                break;
            }
            case '/settings/edit-info': {
                setActiveRoute(<EditInfo getBack={getBack} />)
                break;
            }
            case '/settings/edit-username': {
                setActiveRoute(<EditUsername getBack={getBack} />)
                break;
            }
        }

    }, [route, isOpen])

    return (
        <>
            <span
                onClick={closeMenu}
                className={`fixed ${isOpen ? 'w-full' : 'w-0 hidden'} h-[100vw] left-0 inset-y-0 z-[999999999999] backdrop-filter bg-black/30`}
            />

            {activeRoute}
        </>
    )
}

export default LeftBarMenu