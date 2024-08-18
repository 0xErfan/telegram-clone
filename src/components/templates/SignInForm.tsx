import { showToast } from "@/utils";
import useUserStore from "@/zustand/userStore";
import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import axios from "axios";
import { useState } from "react";

const SignInForm = () => {

    const [payload, setPayload] = useState('');
    const [password, setPassword] = useState('')

    const { setter, updater } = useUserStore(state => state)

    const submitForm = async () => {

        if (!payload.trim().length || !password.trim().length) return;

        try {

            const response = await axios.post('/api/auth/login', { payload, password })

            if (response.status == 200) {
                setter(response.data)
                updater('isLogin', true)
                showToast(true, 'You logged in successfully.')
            }

        } catch (error: any) { showToast(false, error.response.data.message, 3000) }
    }

    return (
        <div
            data-aos='zoom-out'
            className="flex w-full flex-col mt-10 space-y-6 ch:text-xl"
            onKeyUp={e => e.key == 'Enter' && submitForm()}
        >

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="username/phone"
                value={payload}
                onChange={e => setPayload(e.target.value)}
                placeholder="Enter your username/phone"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
            />

            <Button
                isLoading={false}
                color="primary"
                size="lg"
                radius="sm"
                className="w-full"
                variant="shadow"
                onClick={submitForm}
            >
                Sign in
            </Button>

        </div>
    )
}

export default SignInForm