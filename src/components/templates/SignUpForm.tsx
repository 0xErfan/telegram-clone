import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react";
import axios from 'axios'
import { showToast } from "@/utils";
import useUserStore from "@/zustand/userStore";

const SignUpForm = () => {

    const { setter, updater } = useUserStore(state => state)
    const [checkForValidation, setCheckForValidation] = useState(false)

    const [userData, setUserData] = useState({
        name: '',
        lastName: '',
        username: '',
        avatar: '',
        password: '',
        phone: ''
    })

    const userUpdater = (key: keyof typeof userData, value: string) => {
        setUserData(prev => ({ ...prev, [key]: value }))
    }

    const submitForm = async () => {

        setCheckForValidation(true)

        if (userData.username.trim().length < 3 || userData.username.trim().length > 20) return
        if (userData.password.trim().length < 8 || userData.password.trim().length > 20) return
        if (!/(^09[0-9]{9}$)|(^\u06F0\u06F9[\u06F0-\u06F9]{9})$/.test(userData.phone)) return

        try {
            const response = await axios.post('/api/auth/register', userData)

            if (response.status == 201) {
                setter(response.data)
                updater('isLogin', true)
                showToast(true, 'You signed up successfully.')
            }

        } catch (error: any) { showToast(false, error.response.data.message) }
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
                label="Username"
                value={userData.username}
                isInvalid={(userData.username.trim().length < 3 || userData.username.trim().length > 20) && checkForValidation}
                errorMessage='username length should be more that 3 & less that 20 letters'
                onChange={e => userUpdater('username', e.target.value)}
                placeholder="Enter your unique username"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Phone"
                value={userData.phone}
                isInvalid={(isNaN(+userData.phone) || !/(^09[0-9]{9}$)|(^\u06F0\u06F9[\u06F0-\u06F9]{9})$/.test(userData.phone)) && checkForValidation}
                errorMessage='Invalid phone number'
                onChange={e => userUpdater('phone', e.target.value)}
                placeholder="Enter your phone number"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Password"
                value={userData.password}
                isInvalid={(userData.password.trim().length < 8 || userData.password.trim().length > 20) && checkForValidation}
                errorMessage='Password length should be more that 7 & less that 20 letters'
                onChange={e => userUpdater('password', e.target.value)}
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
                Sign up
            </Button>

        </div>
    )
}

export default SignUpForm