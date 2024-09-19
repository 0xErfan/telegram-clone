import { Skeleton } from '@nextui-org/skeleton'

const RoomSkeleton = () => {
    return (
        <div className='flex gap-2 flex-col'>
            {
                Array(20).fill(0).map((_, index) => (
                    <div key={index} className="max-w-[300px] w-full flex items-center gap-3">
                        <div>
                            <Skeleton style={{backgroundColor: "rgba(0, 0, 0, 0.4)"}} className="flex rounded-full w-12 h-12 p-1" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} className="h-3 w-3/5 rounded-lg p-1" />
                            <Skeleton style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }} className="h-3 w-4/5 rounded-lg p-1" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RoomSkeleton