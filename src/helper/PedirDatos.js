import data from './data.json'

export const pedirDatos = () => {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(data)

        },500)



    })
}
