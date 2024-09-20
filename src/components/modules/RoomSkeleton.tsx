import { Skeleton } from '@nextui-org/skeleton'

const RoomSkeleton = () => {
    return (
        <div className='flex gap-3 flex-col overflow-hidden'>
            {
                Array(20).fill(0).map((_, index) => (
                    <div key={index} className="max-w-[300px] w-full flex items-center gap-4">
                        <div>
                            <Skeleton style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}} className="flex rounded-full w-12 h-12 bg-darkGray" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="h-3 w-3/5 rounded-lg bg-darkGray" />
                            <Skeleton style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} className="h-3 w-4/5 rounded-lg bg-darkGray" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RoomSkeleton