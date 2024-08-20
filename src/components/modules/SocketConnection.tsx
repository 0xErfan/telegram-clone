'use client'

import useGlobalVariablesStore from "@/zustand/globalVariablesStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

const SocketConnection = () => {

    const { setter } = useGlobalVariablesStore(state => state)

    useEffect(() => {

        const Socket = io('http://localhost:3001')
        setter({ socket: Socket })

        return () => { Socket.disconnect() }

    }, [])

    return null;
}

export default SocketConnection;