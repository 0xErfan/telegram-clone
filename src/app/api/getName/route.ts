export const GET = async (req: Request,) => {
    console.log('im running btw')
    return Response.json({data: 'sadf'}, { status: 200 })
}