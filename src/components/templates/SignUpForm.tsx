import { Button } from "@nextui-org/button"
import { Input } from "@nextui-org/input"
import axios from 'axios'
import { showToast } from "@/utils";
import useUserStore from "@/zustand/userStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { UserModel } from "@/@types/data.t";

type Inputs = Partial<UserModel>

const SignUpForm = () => {

    const { setter } = useUserStore(state => state)

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors, isValid }
    } = useForm<Inputs>({ mode: 'onChange' })

    const submitForm: SubmitHandler<Inputs> = async (data) => {

        try {
            const response = await axios.post('/api/auth/register', {
                ...data,
                phone: data.phone?.startsWith('0') ? data.phone.slice(1) : data.phone
            })

            if (response.status == 201) {
                setter({
                    ...response.data,
                    isLogin: true
                })
                showToast(true, 'You signed up successfully.')
            }

        } catch (error: any) { showToast(false, error.response.data.message, 3000) }
    }

    return (
        <div
            data-aos='zoom-out'
            className="flex w-full flex-col mt-10 space-y-6 ch:text-xl"
            onKeyUp={e => e.key == 'Enter' && handleSubmit(submitForm)()}
        >

            <Input
                {...register('username', {
                    minLength: { value: 3, message: 'Username length should be bigger than 3 & less than 20' },
                    maxLength: { value: 20, message: 'Username length should be bigger than 3 & less than 20' },
                })}
                variant='bordered'
                color="primary"
                radius="sm"
                label="Username"
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
                placeholder="Enter your unique username"
            />

            <Input
                {...register('phone', {
                    pattern: {
                        value: /(^09[0-9]{9}$)|(^\u06F0\u06F9[\u06F0-\u06F9]{9})$/,
                        message: 'Invalid phone number'
                    }
                })}
                variant='bordered'
                color="primary"
                radius="sm"
                label="Phone"
                isInvalid={!!errors.phone}
                errorMessage={errors.phone?.message}
                placeholder="Enter your phone number"
            />

            <Input
                {...register('password', {
                    validate: (value) => (value?.length! > 20 || value?.length! < 8)
                        ?
                        'Password length should be bigger than 8 & less than 20'
                        :
                        true
                })}
                variant='bordered'
                color="primary"
                radius="sm"
                label="Password"
                autoComplete='false'
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                placeholder="Enter your password"
            />

            <Button
                isLoading={isSubmitting}
                disabled={!isValid}
                color="primary"
                size="lg"
                radius="sm"
                className="w-full"
                variant={isValid ? 'shadow' : 'flat'}
                onClick={handleSubmit(submitForm)}
            >
                Sign up
            </Button>

        </div>
    )
}

export default SignUpForm