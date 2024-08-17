import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react";

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

    return (
        <div data-aos='zoom-out' className="flex w-full flex-col mt-10 space-y-6 ch:text-xl">

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Name"
                value={userData.name}
                onChange={e => userUpdater('name', e.target.value)}
                placeholder="Enter your name"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Last name"
                value={userData.lastName}
                onChange={e => userUpdater('lastName', e.target.value)}
                placeholder="Enter your lastname"
            />

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="Password"
                value={userData.password}
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
            >
                Sign up
            </Button>

        </div>
    )
}

export default SignUpForm