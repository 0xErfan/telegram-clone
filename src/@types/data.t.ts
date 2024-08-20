interface UserModel {
    _id: string
    name: string
    lastName: string
    username: string
    password: string
    phone: number
    rooms: RoomModel[]
    avatar: string
    isLogin: boolean
    createdAt: string
}

interface MessageModel {
    _id: string
    message: string
    sender: UserModel
    seen: boolean
    createdAt: string
}

interface LocationModel {
    _id: string
    x: number
    y: number
    sender: UserModel
}

interface MediaModel {
    _id: string
    file: File
    sender: UserModel
}

interface RoomModel {
    _id: string
    name: string
    avatar: string
    participants: [_id: string]
    messages: MessageModel[]
    locations: LocationModel[]
    medias: MediaModel[]
    createdAt: string
}

interface NameSpaceModel {
    _id: string
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