interface UserModel {
    _id: string
    name: string
    lastName: string
    username: string
    password: string
    phone: number
    rooms: RoomModel[]
    avatar: string
    status: 'online' | 'offline'
    isLogin: boolean
    createdAt: string
    updatedAt: string
}

interface MessageModel {
    _id: string
    message: string
    sender: UserModel
    seen: string[]
    replays: string[]
    roomID: string
    createdAt: string
    updatedAt: string
}

interface LocationModel {
    _id: string
    x: number
    y: number
    sender: UserModel
    roomID: string
    createdAt: string
    updatedAt: string
}

interface MediaModel {
    _id: string
    file: File
    sender: UserModel
    roomID: string
    createdAt: string
    updatedAt: string
}

interface RoomModel {
    _id: string
    name: string
    avatar: string
    participants: [_id: string]
    admins: [_id: string]
    type: 'group' | 'private' | 'chanel'
    creator: string
    messages: MessageModel[]
    locations: LocationModel[]
    medias: MediaModel[]
    createdAt: string
    updatedAt: string
}

interface NameSpaceModel {
    _id: string
    title: string
    rooms: RoomModel[]
    createdAt: string
    updatedAt: string
}

export type {
    UserModel,
    MessageModel,
    LocationModel,
    MediaModel,
    RoomModel,
    NameSpaceModel
}