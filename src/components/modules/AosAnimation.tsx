'use client'
import useGlobalVariablesStore from '@/zustand/globalVariablesStore';
import Aos from 'aos';
import { useEffect } from 'react'

const AosAnimation = () => {

    const selectedRoom = useGlobalVariablesStore(state => state.selectedRoom)

    useEffect(() => { Aos.init() }, [])
    useEffect(() => { Aos.refresh() }, [selectedRoom?._id])

    return null;
}

export default AosAnimation;