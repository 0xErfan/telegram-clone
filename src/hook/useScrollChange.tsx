import { useEffect, useRef, useState } from "react";

const useScrollChange = (elem: HTMLElement | null) => {

    const lastScrollPosition = useRef(0);
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {

        if (!elem) return;

        const checkScrollValue = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target) {
                setCanShow(target.scrollTop > lastScrollPosition.current);
                lastScrollPosition.current = target.scrollTop;

                // if the scroll reached the end, we can set the canShow to false btw.
                if ((target.scrollTop + target.clientHeight + 100) >= target.scrollHeight) {
                    setCanShow(false)
                }
            }
        };

        elem.addEventListener('scroll', checkScrollValue);

        return () => elem.removeEventListener('scroll', checkScrollValue)

    }, [elem]);

    return { lastScrollPosition: lastScrollPosition?.current, canShow, setCanShow };
}

export default useScrollChange;