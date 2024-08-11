export const GET = async (req: Request,) => {
    console.log('im running btw')
    return Response.json({
        name: '12',
        lastName: '12',
        username: '12',
        password: '12',
        avatar: '12',
        createdAt: '12',
    }, { status: 200 })
}