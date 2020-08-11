/**
 * Asignarle un callback al evento click de todos los links del nav para que puedan ir a buscar con AJAX el archivo que le corresponde y poder mostrarlo dentro del <main>
 * 
 * 
 * 
 * PRIMER BONUS
 * 
 * Por cada vez que se le hace click a un link, tendria que poder cambiar la URL y detectar cambios en la URL. 
 * 
 * 
 * SEGUNDO BONUS
 * 
 * Si el usuario vuelve para atras en el historial, deberia poder ver el contenido que le corresponde a la URL.
 */
const url = "https://jsonplaceholder.typicode.com"

let getAllUserFromApi = () => {
    return new Promise((resolve, reject) => {
        const url = "https://jsonplaceholder.typicode.com"
        const xhr = new XMLHttpRequest
        xhr.responseType = "json"
        xhr.open("GET", `${url}/users`)
        xhr.addEventListener("load", () => {
            resolve(xhr.response)
        })
        xhr.send()
    })
}

let getPostPerUserDataFromApi = (userId) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.responseType = "json"
        xhr.open("GET", `${url}/posts?userId=${userId}`)
        xhr.addEventListener("load", () => {
            resolve(xhr.response)
        })
        xhr.send()
    })
}

let getAllPostDataFromApi = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.responseType = "json"
        xhr.open("GET", `${url}/posts`)
        xhr.addEventListener("load", () => {
            resolve(xhr.response)
        })
        xhr.send()
    })
}

let getUserDataFromApi = (userId) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.responseType = "json"
        xhr.open("GET", `${url}/users/${userId}`)
        xhr.addEventListener("load", () => {
            resolve(xhr.response)
        })
        xhr.send()
    })
}