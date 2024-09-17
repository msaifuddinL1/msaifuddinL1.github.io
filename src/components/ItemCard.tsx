type ItemCardProp = {
    data: any,
    key: number,
    setData: (data:string) => string
}

export default function ItemCard(params:ItemCardProp) {
    
    const handleClickTest = () => {
        params.setData((data: string) => {
            console.log(data)
            return 
        })
    }
    return (
        <>
            <button onClick={handleClickTest}>Testing</button>
        </>
    )
}