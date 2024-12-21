type ErrorShape = {
    error: {
        message: string;
    }
};

type UserDataShape =
    | {
        data: {
            id: string;
            name: string;
            email: string;
        };
    }
    | ErrorShape;

type PostDataShape =
    | {
        data: {
            id: string;
            title: string;
            body: string;
        };
    }
    | ErrorShape;

// my version with generics:

type dataShape<data extends { data: object }> = data | ErrorShape;

type UserDataShape_2 = dataShape<{ data: { id: string, title: string, body: string } }>

/////////////


type PromiseFunc = (input: any) => Promise<any>;

type PromiseFunc_2<input, returnType> = (input: input) => Promise<returnType>

const getUserData: PromiseFunc_2<boolean, 2> = () => Promise.resolve().then(() => 2)

/////////////

type Result_1<TResult, TError> =
    | {
        success: true;
        data: TResult;
    }
    | {
        success: false;
        error: TError;
    };

type Result<result> = {
    success: result extends number ? true : false,
    error: result extends number ? never : { message: string },
    data: result extends number ? result : never
}

////////



type StrictOmit<T extends object, K extends keyof T> = {
    [P in keyof T as P extends K ? never : P]: T[P]
};

const myObj = {
    name: 'erfan',
    lastName: 'eftekhari',
    age: 20
}

let objWithoutAge: StrictOmit<typeof myObj, 'name'> = {
    lastName: 'erfan',
    age: 3
}

///////////


type absoluteRoute = `/${string}`

const goToRoute = (route: absoluteRoute) => { }

goToRoute('/')

//////////


type BreadType = "rye" | "brown" | "white";

type Filling = "cheese" | "ham" | "salami";

type Sandwich = `${BreadType} sandwich with ${Filling}`;

const mySandwich: Sandwich = 'rye sandwich with cheese'

/////////////


interface Attributes {
    name: string
    age: number
    address: {
        town: string
        province: string
    }
}

type attributeGetters = {
    [K in keyof Attributes as `get${firstCharCapitalize<K>}`]: () => Attributes[K]
}

type firstCharCapitalize<S extends string> = S extends `${infer First}${infer Rest}` ? `${Capitalize<First>}${Rest}` : S

const attGetters: attributeGetters = {
    getName: () => '',
    getAge: () => 2,
    getAddress: () => {
        return { province: '', town: '' }
    }
}

//////////

const createStringMap = <type = unknown>() => {
    return new Map<string, type>();
};

const aMap = createStringMap()

//////////

const uniqueArray = <A>(arr: A[]): A[] => {
    return Array.from(new Set(arr));
};

const duplicateValArray = [1, 3, 33, 3, 3, 3, 5, 6]
const removedDuplicatedArray = uniqueArray(duplicateValArray)


type Unshift<T extends any[], K> = [K, ...T]
type UnShifted = Unshift<[1, 2], 0> // [0, 1, 2]


// get return type of fn
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
const myArrReturnFn = (name: string, anotherName: string): { name: 'string', address: { str: string, p: number } }[] | null => null;
type myArrayReturnType = MyReturnType<typeof myArrReturnFn>

// get property types of fn
type GetPropType<T> = T extends (...arg: infer R) => any ? (...arg: R) => any : never
const myTestFn = (name: string, address: { str: string, p: number }) => { }
type myFnProps = GetPropType<typeof myTestFn>


// last or first argument of a function, array or similar things
type LastIndexVal<T> = T extends [...args: infer Rest, last: infer Last] ? Last : never;
type FirstIndexVal<T> = T extends [first: infer First, reset: infer Rest] ? First : never;

// number extract using infer & conditional checking(cool af)
type ExtractNumber<T> = T extends `${infer U}` ? `${U}` extends number ? U : never : never


// using recursive call with infer
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;