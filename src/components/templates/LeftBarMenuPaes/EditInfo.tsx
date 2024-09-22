import React from 'react'
import LeftBarContainer from './LeftBarContainer'

const EditInfo = ({ getBack }: { getBack: () => void }) => {
    return (
        <LeftBarContainer getBack={getBack} title='Edit Info'>
            <div>hi there</div>
        </LeftBarContainer>
    )
}

export default EditInfo;