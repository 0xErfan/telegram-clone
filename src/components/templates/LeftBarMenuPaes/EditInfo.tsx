import LineSeparator from '@/components/modules/LineSeparator';
import LeftBarContainer from './LeftBarContainer'
import useUserStore from '@/zustand/userStore';
import { MdDone } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import useSockets from '@/zustand/useSockets';
import { Button } from '@nextui-org/button';

const EditInfo = ({ getBack }: { getBack: () => void }) => {

    const { name = '', lastName = '', biography = '', _id } = useUserStore(state => state)

    const [updatedName, setUpdatedName] = useState(name)
    const [updatedLastName, setUpdatedLastName] = useState(lastName)
    const [updatedBiography, setUpdatedBiography] = useState(biography)
    const [isLoading, setIsLoading] = useState(false)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [updatedBiography?.length]);

    const submitChanges = () => {

        const socket = useSockets.getState().rooms

        setIsLoading(true)

        socket?.emit('updateUserData', {
            userID: _id,
            name: updatedName,
            lastName: updatedLastName,
            biography: updatedBiography
        })

        socket?.on('updateUserData', () => {

            const setter = useUserStore.getState().setter

            setTimeout(() => {
                setIsLoading(false)
                setter({ name: updatedName, lastName: updatedLastName, biography: updatedBiography })
            }, 500);

        })

    }

    return (
        <LeftBarContainer
            getBack={getBack}
            title='Edit Info'
            leftHeaderChild={
                (
                    updatedBiography?.trim() !== biography?.trim()
                    ||
                    updatedLastName?.trim() !== lastName?.trim()
                    ||
                    updatedName?.trim() !== name?.trim()
                )
                &&
                (
                    isLoading
                        ?
                        <Button
                            isLoading={true}
                            data-aos='zoom-right'
                            style={{ backgroundColor: 'inherit', position: 'absolute', right: 0, color: 'white', }}
                        />
                        :
                        <MdDone
                            data-aos='zoom-right'
                            onClick={submitChanges}
                            className='size-6 mx-2 cursor-pointer'
                        />
                )
            }
        >

            <div className="flex flex-col gap-2 pt-4">

                <p className="text-darkBlue font-segoeRegular py-1 font-bold text-[16px]">Your name</p>

                <input
                    type="text"
                    value={updatedName}
                    onChange={e => setUpdatedName(e.target.value)}
                    placeholder='Name'
                    className='outline-none bg-inherit w-full'
                    max={20}
                    maxLength={20}
                />

                <LineSeparator />

                <input
                    type="text"
                    value={updatedLastName}
                    onChange={e => setUpdatedLastName(e.target.value)}
                    placeholder='Last name'
                    className='outline-none bg-inherit w-full'
                    max={20}
                    maxLength={20}
                />

            </div>

            <p className="h-3 w-full bg-black/70 inset-x-0 my-3 absolute"></p>

            <div className="flex flex-col gap-2 py-4">

                <div className='flex items-center w-full justify-between pt-4'>
                    <p className="text-darkBlue font-segoeRegular font-bold text-[16px]">Your bio</p>
                    <p className='text-darkGray'>{70 - (updatedBiography?.length ?? 0)}</p>
                </div>

                <textarea
                    ref={textAreaRef}
                    value={updatedBiography}
                    onChange={e => {
                        setUpdatedBiography(prev => {
                            const updatedBio = e.target.value
                            return updatedBio.length > 70 ? prev : updatedBio
                        })
                    }}
                    className='resize-none w-full h-3 text-white bg-inherit outline-none'
                    placeholder='Your biography'
                />

            </div>

            <span className='absolute size-full inset-x-0 bg-black/70'></span>

        </LeftBarContainer>
    )
}

export default EditInfo;