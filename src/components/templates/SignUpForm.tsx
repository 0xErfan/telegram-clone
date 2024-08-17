import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react";
import axios from 'axios'

const SignUpForm = () => {

    const [userData, setUserData] = useState({
        name: '',
        lastName: '',
        avatar: '',
        password: ''
    })

    const userUpdater = (key: keyof typeof userData, value: string) => {
        setUserData(prev => ({ ...prev, [key]: value }))
    }

    const submitForm = async () => {
        const response = await axios.put('/api/auth/register', userData)
        if (response.status !== 201) {}
    }

    return (
        <div data-aos='zoom-out' className="flex w-full flex-col mt-10 space-y-6 ch:text-xl">

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Name"
                value={userData.name}
                isInvalid={userData.name.trim().length < 3}
                errorMessage='Name length should be more that 3 letters'
                onChange={e => userUpdater('name', e.target.value)}
                placeholder="Enter your name"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Last name"
                value={userData.lastName}
                isInvalid={userData.lastName.trim().length < 3}
                errorMessage='Username length should be more that 3 letters'
                onChange={e => userUpdater('lastName', e.target.value)}
                placeholder="Enter your lastname"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Password"
                value={userData.password}
                isInvalid={userData.password.trim().length < 8}
                errorMessage='Password length should be more that 7 letters'
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