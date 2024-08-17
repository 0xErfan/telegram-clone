import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { Key, useState } from "react";
import { SiTelegram } from "react-icons/si";

export const animals = [
    { label: "Cat", value: "cat", description: "The second most popular pet in the world" },
    { label: "Dog", value: "dog", description: "The most popular pet in the world" },
    { label: "Elephant", value: "elephant", description: "The largest land animal" },
    { label: "Lion", value: "lion", description: "The king of the jungle" },
    { label: "Tiger", value: "tiger", description: "The largest cat species" },
    { label: "Giraffe", value: "giraffe", description: "The tallest land animal" },
    {
        label: "Dolphin",
        value: "dolphin",
        description: "A widely distributed and diverse group of aquatic mammals",
    },
    { label: "Penguin", value: "penguin", description: "A group of aquatic flightless birds" },
    { label: "Zebra", value: "zebra", description: "A several species of African equids" },
    {
        label: "Shark",
        value: "shark",
        description: "A group of elasmobranch fish characterized by a cartilaginous skeleton",
    },
    {
        label: "Whale",
        value: "whale",
        description: "Diverse group of fully aquatic placental marine mammals",
    },
    { label: "Otter", value: "otter", description: "A carnivorous mammal in the subfamily Lutrinae" },
    { label: "Crocodile", value: "crocodile", description: "A large semiaquatic reptile" },
];


const AuthenticationForm = () => {

    const [countryValue, setCountry] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('')

    return (
        <section className="bg-leftBarBg flex-center size-full h-screen">

            <div className="flex items-center flex-col max-w-[360px] w-full py-16 text-white">

                <SiTelegram className="size-40 rounded-full text-lightBlue" />
                <h1 className="font-bold font-segoeBold text-[35px] mt-7">Sign in to Telegram</h1>
                <p className="text-darkGray text-center px-12 text-[16px] font-bold font-segoeBold mt-3">Please confirm your country code and enter your phone number.</p>

                <div className="flex w-full flex-col mt-12 space-y-6 ch:text-xl">

                    <Autocomplete
                        label="Select country"
                        variant="bordered"
                        color="primary"
                        defaultItems={animals}
                        onInputChange={value => setCountry(value)}
                    >
                        {
                            (item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
                        }
                    </Autocomplete>

                    <Input
                        variant='bordered'
                        color="primary"
                        label="phone"
                        isInvalid={isNaN(+phoneNumber.trim())}
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        errorMessage='Please enter a valid number'
                        validate={(e => e)}
                        placeholder="Enter your phone"
                        className=""
                    />

                    <Button
                        color="primary"
                        size="lg"
                        className="w-full"
                        value={'Next'}
                        variant="shadow"
                    >
                        Next
                    </Button>

                </div>

            </div>
        </section>
    )
}

export default AuthenticationForm