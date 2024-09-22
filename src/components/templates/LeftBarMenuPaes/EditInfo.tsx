import LineSeparator from '@/components/modules/LineSeparator';
import LeftBarContainer from './LeftBarContainer'
import useUserStore from '@/zustand/userStore';
import { MdDone } from "react-icons/md";
import { useState } from 'react';

const EditInfo = ({ getBack }: { getBack: () => void }) => {

    const { name, lastName, biography } = useUserStore(state => state)

    const [updatedName, setUpdatedName] = useState(name)
    const [updatedLastName, setUpdatedLastName] = useState(lastName)
    const [updatedBiography, setUpdatedBiography] = useState(biography)

    const submitChanges = () => {
        alert('done')
    }

    return (
        <LeftBarContainer
            getBack={getBack}
            title='Edit Info'
            leftHeaderChild={<MdDone onClick={submitChanges} className='size-8 pl-2 cursor-pointer' />}
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
                    <p className='text-darkGray'>{70 - (updatedBiography == 'Your biography' ? 0 : updatedBiography?.length ?? 0)}</p>
                </div>

                <div
                    contentEditable
                    className="outline-none bg-inherit min-h-7 max-h-52 text-white whitespace-pre-wrap h-auto overflow-hidden resize-none w-full pt-2"
                    onFocus={() => { if (updatedBiography === 'Your biography') setUpdatedBiography('') }}
                    onBlur={() => { if (updatedBiography === '') setUpdatedBiography('Your biography') }}
                    onInput={(e: any) => {
                        if (updatedBiography.length === 70) return
                        setUpdatedBiography(e.target?.innerText!)
                    }}
                >
                    {updatedBiography ?? 'Your biography'}
                </div>

            </div>

            <span className='absolute size-full inset-x-0 bg-black/70'></span>

        </LeftBarContainer>
    )
}

export default EditInfo;