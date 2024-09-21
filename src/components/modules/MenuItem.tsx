type ItemProps = {
    title: string
    icon: JSX.Element
    spaceY?: `py-${number}`
    onClick?: () => void
}

const MenuItem = ({ title, icon, onClick, spaceY = 'py-3' }: ItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`${spaceY} flex items-center gap-6 w-full cursor-pointer`}
        >
            <div className="ch:size-[26] ch:text-white/40">{icon}</div>
            <p className="font-bold font-segoeBold">{title}</p>
        </div>
    )
}

export default MenuItem;