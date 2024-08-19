interface UserModel {
    name: string
    lastName: string
    username: string
    password: string
    phone: number
    avatar: string
    isLogin: boolean
    createdAt: string
}

interface MessageModel {
    message: string
    sender: UserModel
    seen: boolean
    createdAt: string
}

interface LocationModel {
    x: number
    y: number
    sender: UserModel
}

interface MediaModel {
    file: File
    sender: UserModel
}

interface RoomModel {
    name: string
    avatar: string
    participants: UserModel[]
    messages: MediaModel[]
    locations: LocationModel[]
    createdAt: string
}

interface NameSpaceModel {
    title: string
    rooms: RoomModel[]
}

export type {
    UserModel,
    MessageModel,
    LocationModel,
    MediaModel,
    RoomModel,
    NameSpaceModel
}