import { useEffect, useState } from "react"
import LeftBarContainer from "./LeftBarContainer"
import useUserStore from "@/zustand/userStore"
import useSockets from "@/zustand/useSockets"
import { Button } from "@nextui-org/button"
import { MdDone } from "react-icons/md"
import axios from "axios"

const EditUsername = ({ getBack }: { getBack: () => void }) => {

    const { username: currentUsername, _id, setter } = useUserStore(state => state)
    const socket = useSockets(state => state.rooms)

    const [username, setUsername] = useState(currentUsername)

    const [isLoading, setIsLoading] = useState(false)
    const [isUsernameValid, setIsUsernameValid] = useState(true)
    const [isValidationLoading, setIsValidationLoading] = useState(false)

    const updateUsername = () => {

        setIsLoading(true)

        socket?.emit('updateUserData', {
            userID: _id,
            username,
        })

        socket?.on('updateUserData', () => {
            setTimeout(() => {
                setIsLoading(false)
                setter({ username })
            }, 500);
        })

    }

    useEffect(() => {

        if (username.trim() === currentUsername) return

        setIsValidationLoading(true)
        let timer: NodeJS.Timeout

        const debounceSearch = async () => {

            const updatedUsername = username.trim().toLowerCase()
            setIsValidationLoading(true)

            try {

                const { data } = await axios.post('/api/users/updateUsername', { query: updatedUsername })
                setIsUsernameValid(data?.isValid)

            } catch (error) { setIsUsernameValid(false) }
            finally { setIsValidationLoading(false) }

        }

        timer = setTimeout(debounceSearch, 1000);

        return () => {
            setIsValidationLoading(false)
            clearTimeout(timer)
        }

    }, [username, currentUsername])

    return (
        <LeftBarContainer
            getBack={getBack}
            leftHeaderChild={
                currentUsername.trim() !== username.trim()
                && (
                    isLoading
                        ?
                        <Button
                            isLoading={true}
                            data-aos='zoom-right'
                            style={{ backgroundColor: 'inherit', position: 'absolute', right: 0, color: 'white', }}
                        />
                        :
                        !isValidationLoading
                        &&
                        isUsernameValid
                        &&
                        <MdDone
                            onClick={updateUsername}
                            className="size-6 mr-2 cursor-pointer"
                        />
                )
            }
        >
            <div className="flex flex-col gap-2 pb-4">

                <p className="text-darkBlue font-segoeRegular pt-1 font-bold text-[16px]">Update username</p>

                <input
                    type="text"
                    value={username}
                    onChange={e => {

                        setUsername(e.target.value)

                        if (!e.target.value.startsWith('@')) {
                            setUsername('@' + e.target.value)
                        }

                    }}
                    placeholder='Username'
                    className='outline-none bg-inherit w-full'
                    max={22}
                    maxLength={22}
                />

            </div>

            <div className="fixed max-w-full md:max-w-[31%] text-white/55 inset-x-0 text-[15px] h-full bg-black/70 px-4 pt-2 break-words">
                {
                    isValidationLoading
                        ?
                        <p data-aos='zoom-left' className="my-2">Checking username...</p>
                        : null
                }

                {
                    currentUsername.trim() !== username.trim()
                    &&
                    !isValidationLoading
                    &&
                    <p
                        data-aos='zoom-left'
                        className={`my-2 ${isUsernameValid ? 'text-green-500' : 'text-red-500'}`}>
                        {
                            isUsernameValid
                                ?
                                `${username} is available`
                                :
                                'Usernames must be between 3 & 20 Characters length b.'
                        }

                    </p>
                }

                You can choose a username on <span className="font-bold font-segoeBold">Telegram</span>. If you do, people will be able to find you by this username and contact you without needing your phone number.<br /><br /> You can use a-z, 0-9 and underscores. Minimum length is 3 Characters, Good luck with that bud.
            </div>

        </LeftBarContainer>
    )
}

export default EditUsername