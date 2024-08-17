import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import { useState } from "react";

const SignInForm = () => {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('')

    return (
        <div data-aos='zoom-out' className="flex w-full flex-col mt-10 space-y-6 ch:text-xl">

            <Input
                variant='bordered'
                color="primary"
                radius="sm"
                label="UserName"
                value={username}
                onChange={e => setUserName(e.target.value)}
                placeholder="Enter your username"
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
            >
                Sign in
            </Button>

        </div>
    )
}

export default SignInForm