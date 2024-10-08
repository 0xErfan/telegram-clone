import { RoomModel, UserModel } from "@/@types/data.t"
import useUserStore from "@/zustand/userStore"
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Button } from "@nextui-org/button";
import SearchResultCard from "../modules/SearchResultCard";

interface Props {
    closeSearch: () => void
}

const SearchPage = ({ closeSearch }: Props) => {

    const myData = useUserStore(state => state)

    const [query, setQuery] = useState('')
    const [searchResult, setSearchResult] = useState<UserModel[] | RoomModel[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchFinished, setSearchFinished] = useState(false)
    const timer = useRef<NodeJS.Timeout | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { inputRef.current?.focus() }, [])

    useEffect(() => {

        clearTimeout(timer.current!)

        const trimmedQuery = query.trim()

        if (!trimmedQuery.length) {
            setIsLoading(false)
            setSearchResult([])
            setSearchFinished(false)
            return
        }

        setSearchFinished(true)
        setIsLoading(true)

        const fetchQuery = async () => {

            try {
                const { data, status } = await axios.post('/api/users/find', { query: { userID: myData._id, payload: trimmedQuery } })
                if (status === 200) setSearchResult(data)
            } catch (error) { setSearchResult([]) }
            finally { setIsLoading(false), setSearchFinished(true) }

        }

        timer.current = setTimeout(fetchQuery, 1000);
        return () => { clearTimeout(timer.current!), setIsLoading(false) }

    }, [query])

    return (
        <section
            data-aos='fade-up'
            onKeyUp={e => e.key == 'Escape' && closeSearch()}
            className={`text-white fixed md:max-w-[29.6%] max-w-full w-full h-full inset-0 overflow-auto bg-leftBarBg z-[999999999999999999999] transition-all`}
        >
            <div className="flex sticky top-0 gap-3 bg-inherit items-center justify-between w-full ch:w-full px-2 py-4">

                <IoMdArrowRoundBack
                    onClick={closeSearch}
                    className="size-6 -mx-2 cursor-pointer basis-[10%]"
                />

                <input
                    value={query}
                    ref={inputRef}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search"
                    className="bg-inherit placeholder:text-white/60 basis-[90%] outline-none"
                    type="text"
                />

            </div>

            <div className="px-3 mt-6 bg-inherit">
                {
                    isLoading &&
                    <Button
                        isLoading={isLoading}
                        className="absolute top-10 inset-x-0 rounded-full bg-inherit overflow-hidden"
                        size="lg"
                        style={{width: '64px', margin: 'auto'}}
                        color="primary"
                    />
                }

                <div className="flex flex-col w-full ch:w-full">

                    {
                        searchResult?.length
                            ?
                            <span className="text-darkGray text-sm">{searchResult.length} result(s)</span>
                            : null
                    }

                    {
                        searchResult?.length
                            ?
                            searchResult.map((data, index) =>
                                <div key={index} onClick={closeSearch}>
                                    <SearchResultCard
                                        key={index}
                                        {...data}
                                        query={query}
                                        myData={myData}
                                    />
                                </div>
                            )
                            :
                            searchFinished && !isLoading && <div data-aos='fade-up' className="text-center text-darkGray">Nothing found bud.</div>
                    }
                </div>
            </div>

        </section>
    )
}

export default SearchPage