type ItemCardProp = {
    data: any,
    key: number,
    setData: (data:string) => string
}

export default function ItemCard(params:ItemCardProp) {
    
    const handleClickTest = () => {
        params.setData("hello")
    }
    return (
        <>
            <button onClick={handleClickTest}>Testing</button>
        </>
    )
}