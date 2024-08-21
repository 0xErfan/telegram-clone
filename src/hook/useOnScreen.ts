import { useState, useEffect } from 'react';

export const useOnScreen = (ref: any) => {
    
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {

        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting)
        },
            { threshold: 0.1 }
        );

        ref.current && observer.observe(ref.current);

        return () => {
            ref.current && observer.unobserve(ref.current);
        };

    }, [ref]);

    return isIntersecting;
};