import { RoomModel, UserModel } from "@/@types/data.t"
import useUserStore from "@/zustand/userStore"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import RoomCard from "../modules/RoomCard"

interface Props {
    closeSearch: () => void
}

const SearchPage = ({ closeSearch }: Props) => {

    const myData = useUserStore(state => state)
    const rooms = myData.rooms

    const [query, setQuery] = useState('')
    const [searchResult, setSearchResult] = useState<UserModel[] | RoomModel[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const timer = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        clearTimeout(timer.current!)

        const fetchQuery = async () => {

            const trimmedQuery = query.trim()

            if (!trimmedQuery.length) return
            setIsLoading(true)

            if (trimmedQuery.startsWith('@')) {

                try {
                    const { data, status } = await axios.post('/api/users/find', { query: trimmedQuery })
                    if (status === 200) setSearchResult([data])
                } catch (error) { setSearchResult([]) }
                finally { setIsLoading(false) }

            } else {

                const searchResults = rooms.filter(data =>
                    data?.name?.includes(trimmedQuery)
                    ||
                    data?.link?.includes(trimmedQuery)
                    ||
                    data?.messages.some(msgData => msgData?.message?.includes(trimmedQuery))
                )

                setSearchResult(searchResults ?? [])

            }

        }

        timer.current = setTimeout(fetchQuery, 1000);
        return () => { clearTimeout(timer.current!) }
    }, [query])

    console.log(searchResult)

    return (
        <section
            data-aos='fade-up'
            className={` text-white absolute size-full inset-0 bg-leftBarBg z-[99999999] transition-all`}
        >
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for other rooms..."
                className="w-full px-2 bg-darkGray py-2 rounded outline-none"
                type="text"
            />

            <div className="px-3 mt-6">
                {
                    isLoading ? null
                        :
                        <div className="flex flex-col mt-3 w-full ch:w-full">
                            {
                                searchResult?.length
                                    ?
                                    searchResult?.map(member =>
                                        <div onClick={closeSearch}>
                                            <RoomCard
                                                key={member._id}
                                                {...member}
                                                shouldOpenChat
                                                myData={myData}
                                            />
                                        </div>
                                    )
                                    : null
                            }
                        </div>
                }
            </div>

        </section>
    )
}

export default SearchPage