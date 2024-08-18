import { Secret, sign, verify } from "jsonwebtoken"
import toast from "react-hot-toast"
import { UserModel } from "./@types/data.t";


const getTimer = (date?: string) => {

    const currentDate = new Date();
    const endOfTimer = date || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);

    const differenceBetweenDates = (endOfTimer instanceof Date ? endOfTimer.getTime() : new Date(endOfTimer).getTime()) - currentDate.getTime();
    const secondsRemaining = Math.floor(differenceBetweenDates / 1000);

    const hours = Math.floor(secondsRemaining / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((secondsRemaining % 3600) / 60).toString().padStart(2, "0");
    const seconds = (secondsRemaining % 60).toString().padStart(2, "0");

    return {
        days: Math.floor(differenceBetweenDates / (60 * 60 * 24 * 1000)).toString().padStart(2, "0"),
        hours,
        minutes,
        seconds
    };
}

const showToast = (status: boolean, message: string, duration: number = 2500) => {

    toast[status ? 'success' : 'error'](message,
        {
            position: "top-left",
            duration,
            style: {
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'inherit',
                backgroundColor: '#19202E',
                color: '#ffffff',
                position: 'relative',
                top: '30px',
                fontSize: '16px',
                padding: '9px',
                border: `2px solid #${status ? '60CDFF' : 'f31260'}`,
                borderRadius: '4px',
                zIndex: '999999',
            }
        }
    )
}

const tokenDecoder = (token: string) => {
    try {
        return verify(token, process.env.secretKey as Secret)
    } catch (error) {
        return false
    }
}

const tokenGenerator = (data: object, days: number = 7) => sign({ email: data }, process.env.secretKey as Secret, { expiresIn: 60 * 60 * 24 * days })

const isEmptyInput = (payload: {}, props: string[]) => {

    const expectedProps = props;
    const actualProps = Object.keys(payload);
    const values = Object.values(payload)

    const containAllElements = expectedProps.every(val => actualProps.includes(val))

    if (!containAllElements) return true

    if (values.some(value => { if (!String(value).trim().length) return true })) return true // check for all value of properties not to be empty

    if (expectedProps.some(prop => !actualProps.includes(prop))) true

    return false
};

const shuffleArray = (array: never[], sliceCount?: number) => {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Using destructuring assignment for swapping
    }

    if (sliceCount) { return array.slice(0, sliceCount) } else return array
}

const sharePage = (url: string) => {

    if (navigator.share) {
        navigator.share({
            title: 'Share Image URL',
            text: 'Check out this product!',
            url
        })
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        console.error('Web Share API not supported');
    }
}

const convertNumbers2English = (string: any) => {

    return string.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (c: string) => {
        return c.charCodeAt(0) - 1632
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (c: string) => {
        return c.charCodeAt(0) - 1776
    });
}

const removeProductFromBasket = async (productID: string, userID: string) => {

    try {
        const res = await fetch('/api/basket/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productID, userID })
        })

        const data = await res.json()

        showToast(res.ok, data.message, 2000)

    } catch (err) {
        console.log(err)
        showToast(false, err as string)
    }
}

const authUser = async ({ isFromClient = false, cookie }: { isFromClient?: boolean, cookie?: string }): Promise<UserModel | null | undefined> => {

    try {
        const res = await fetch(`${isFromClient ? '' : process.env.NEXT_PUBLIC_BASE_PATH}/api/auth/me`, isFromClient ? {} : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cookie)
        })

        if (!res.ok) return null;

        const userData = await res.json()

        return userData;
    }
    catch (error) {
        console.log(error)
    }
}

const getPastDateTime = (last: 'MONTH' | 'WEEK' | 'DAY' | number): Date => {

    const now = new Date();

    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    let daysBack: number;
    if (typeof last === 'number') {
        daysBack = last;
    } else {
        switch (last) {
            case 'MONTH':
                daysBack = 30;
                break;
            case 'WEEK':
                daysBack = 7;
                break;
            case 'DAY':
                daysBack = 1;
                break;
            default:
                throw new Error(`Invalid unit: ${last}`);
        }
    }

    const millisecondsBack = daysBack * 24 * 60 * 60 * 1000;

    return new Date(now.getTime() - millisecondsBack);
}

const getCurrentPersianWeekday = (day: number) => {
    const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    return persianDays[day];
}

export {
    getTimer,
    showToast,
    tokenDecoder,
    tokenGenerator,
    isEmptyInput,
    shuffleArray,
    sharePage,
    convertNumbers2English,
    removeProductFromBasket,
    authUser,
    getPastDateTime,
    getCurrentPersianWeekday,
}