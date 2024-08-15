'use client'
import useGlobalVariablesStore from '@/zustand/globalVariablesStore';
import Aos from 'aos';
import { useEffect } from 'react'

const AosAnimation = () => {

    const selectedChat = useGlobalVariablesStore(state => state.selectedChat)

    useEffect(() => { Aos.init() }, [])
    useEffect(() => { Aos.refresh() }, [selectedChat])

    return null;
}

export default AosAnimation;