// export async function listOfCoin(){
//     const data = await fetch(
//         `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
//     )
//         .then(r => r.json())
//
//     return Object.keys(data.Data)
// }


export function listOfCoin(){
    const data =  fetch(
        `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
    )
        .then(request => request.json())
        .then(result => Object.keys(result.Data))

    var array = []
    data.then(values =>
        Promise.all(values)
            .then(val => {
                array = val
            })
    )

    return array
}

