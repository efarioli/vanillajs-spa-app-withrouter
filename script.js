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

const createUserArticleHTML = (user) => {
    //create an HTML element that represents an user
    const article = document.createElement("article")
    article.classList.add("card")
    article.innerHTML =
        `<img src="./pic/${user.id}.jpg" alt="">
   <h1>${user.name}</h1><h2>${user.email}</h2>
   <a href="/#posts?userId=${user.id}">Ver Posteos de ${user.name} </a>`
    return article;
}

const createUserH2HTML = (user) => {
    //create an H2 element that represents an user - Username and thumbnail picture
    const h2 = document.createElement("h2")
    h2.innerHTML =
        `Posts for user: ${user.name}<span><img src="./pic/${user.id}.jpg"  alt=""/></span>`
    return h2;
}

const createPostPerUserHeader = (user) => {
    const div = document.createElement("div")
    div.innerHTML = `
    <div class="container">
    <h2>Posts for user <span><img src="./pic/1.jpg"  alt=""/></span></h2>
    <ul class="responsive-table" id="rt">
    <li class="table-header">
    <div class="col col-1">Post Id</div>
    <div class="col col-2">Title</div>
    <div class="col col-3">Body</div>
  </li>
    </ul>
  </div>`
    console.dir(div.children[0].children[0])
    div.children[0].replaceChild(createUserH2HTML(user), div.children[0].children[0]);
    return div
}
const createViewAllPostHeader = () => {
    const div = document.createElement("div")
    div.innerHTML = `
    <div class="container">
    <h2>All Post</h2>
    <ul class="responsive-table" >
    <li class="table-header">
    <div class="col col-1v2">Post Id</div>
    <div class="col col-2v2">Title</div>
    <div class="col col-3v2">Body</div>
    <div class="col col-4v2">User Id</div>
  </li>
    </ul>
  </div>`
    return div
}

const createLiPost = (post) => {
    let li = document.createElement("li")
    li.classList.add("table-row")
    li.innerHTML =
        `<div class="col col-1" data-label="Post Id">${post.id}</div>
        <div class="col col-2" data-label="Title">${post.title}</div>
        <div class="col col-3" data-label="Post Body">${post.body}</div>`
    return li
}

const createLiPostExt = (post) => {
    let li = document.createElement("li")
    li.classList.add("table-row")
    li.innerHTML =
        `<div class="col col-1v2" data-label="Post Id">${post.id}</div>
        <div class="col col-2v2" data-label="Title">${post.title}</div>
        <div class="col col-3v2" data-label="Post Body">${post.body}</div>
        <div class="col col-4v2" data-label="Post UserId">${post.userId}</div>`
    return li
}

async function doCreateUserView(routerView) {
    try {
        const users = await getAllUserFromApi()
        routerView.innerHTML = ""

        let articles = document.createDocumentFragment()
        users.forEach(user => {
            articles.appendChild(createUserArticleHTML(user))
        })
        routerView.appendChild(articles)

    } catch (err) {
        console.log(err)
    }
}

async function doCreateViewPostsPerUser(routerView, userId) {
    let div
    try {
        const user = await getUserDataFromApi(userId)
        div = createPostPerUserHeader(user)

    } catch (err) {
        console.log(err + " Problem loading the The user information from Api")
    }

    try {
        const posts = await getPostPerUserDataFromApi(userId)
        let fragment = document.createDocumentFragment()
        posts.forEach(post => {
            fragment.appendChild(createLiPost(post))

        })
        let ul = div.children[0].children[1]
        ul.appendChild(fragment)
        routerView.innerHTML = div.innerHTML

    } catch (err) {
        console.log(err + " Problem loading the The posts per User from Api")
    }
}
async function doCreateAllPostsView(routerView) {
    let div
    try {

        const posts = await getAllPostDataFromApi()
        console.log(posts)

        let fragment = document.createDocumentFragment()
        posts.forEach(post => {
            console.log(post)
            fragment.appendChild(createLiPostExt(post))

        })
        div = createViewAllPostHeader()
        let ul = div.children[0].children[1]
        ul.appendChild(fragment)

        routerView.innerHTML = div.innerHTML

    } catch (err) {
        console.log(err + " Problem loading ALL The posts from Api")
    }
}

const onRouteChanged = () => {

    window.location.href.replace("index.html", "")
    console.log(window.location.href)

    const hash = window.location.hash;
    const routerView = document.querySelector("#router")

    if (!(routerView instanceof HTMLElement)) {
        throw new ReferenceError("No router view element available for rendering");
    }

    switch (hash) {
        case "#home":
            routerView.innerHTML = "<h1>Home page</h1>";
            break

        case "#usuarios":
            doCreateUserView(routerView)
            break
        case "#posts":
            doCreateAllPostsView(routerView)
            break
        case String(hash.match(/#posts\?userId=\d{1,}/g)):
            doCreateViewPostsPerUser(routerView, hash.split('userId=')[hash.split('userId=').length - 1])
            break
        case "#contacto":
            routerView.innerHTML = "<h1>Contacto</h1>";
            break

        default:
            routerView.innerHTML = "<h1>404 - Page Not Found</h1>";
            break;
    }

    const links = document.querySelectorAll(".link")
    links.forEach(element => {
        if (element.classList.contains("active")) element.classList.remove("active")
    });
    let hashIdForActive = hash.split("?")[0]

    links.forEach((link) => {
        if (`#${link.href.split("#")[link.href.split("#").length - 1]}` === hashIdForActive) {
            link.classList.add("active")
        }

    })
}

window.addEventListener("hashchange", onRouteChanged)

window.addEventListener('popstate', onRouteChanged)

window.addEventListener("load", onRouteChanged)

