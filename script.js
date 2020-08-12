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

//const prefixGithubPages = `vanillajs-spa-app-withrouter/` //the correct setup for githubpages
const prefixGithubPages = ``//local dev for othe any enviroment
const routerView = document.querySelector("#router")
const navAnchors = document.querySelectorAll(".link")

const ajax = (url, queryString, method, responseType = "json") => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.responseType = responseType
        xhr.open(method, `${url}${queryString}`)
        xhr.addEventListener("load", () => {
            resolve(xhr.response)
        })
        xhr.send()
    })
}

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
    //create an HTML element (article) that represents an user
    const article = document.createElement("article")
    article.classList.add("card")
    article.innerHTML =
        `<img src="" alt=""><h1></h1><h2></h2>
   <a href="#">Ver Posteos de  </a>`
    article.children[0].src = `./pic/${user.id}.jpg`
    article.children[1].innerText = `${user.name}`
    article.children[2].innerText = `${user.email}`
    article.children[3].href = `/${prefixGithubPages}#posts?userId=${user.id}`
    article.children[3].innerText = `Ver Posteos de ${user.name}`
    return article;
}

const createUserH2HTML = (user) => {
    //create an H2 element that represents an user - Username and thumbnail picture
    const h2 = document.createElement("h2")
    h2.innerHTML = `<span>Posts for user:</span><span><img src=""  alt=""/></span>`
    console.log(h2.childNodes[1])
    h2.children[0].innerText = `Posts for user: ${user.name}`
    h2.children[1].children[0].src = `./pic/${user.id}.jpg`
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

const replaceInLi = (li, post) => {
    li.children[0].innerText = post.id
    li.children[1].innerText = post.title
    li.children[2].innerText = post.body

}
const createLiPost = (post) => {
    let li = document.createElement("li")
    li.classList.add("table-row")
    li.innerHTML =
        `<div class="col col-1" data-label="Post Id"></div>
        <div class="col col-2" data-label="Title"></div>
        <div class="col col-3" data-label="Post Body"></div>`
    replaceInLi(li, post)
    return li
}

const createLiPostExt = (post) => {
    let li = document.createElement("li")
    li.classList.add("table-row")
    li.innerHTML =
        `<div class="col col-1v2" data-label="Post Id"></div>
        <div class="col col-2v2" data-label="Title"></div>
        <div class="col col-3v2" data-label="Post Body"></div>
        <div class="col col-4v2" data-label="Post UserId"></div>`
    replaceInLi(li, post)
    li.children[3].innerText = post.userId
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
    let flag = false
    try {
        const user = await getUserDataFromApi(userId)
        //addressing the problem when the APi do not return any info because the user does not exist
        if ((typeof user.id) === "undefined") {
            routerView.innerHTML = "<h1>404 - Page Not Found</h1>"
            flag = true
            return
        }
        div = createPostPerUserHeader(user)

    } catch (err) {
        console.log(err + " Problem loading the The user information from Api")
    }

    try {
        //addressing the problem when the APi do not return any info because the user does not exist
        if (flag) return

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

        let fragment = document.createDocumentFragment()
        posts.forEach(post => {
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

    const hash = window.location.hash;

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

    let hashIdForActive = hash.split("?")[0]
    navAnchors.forEach(anchor => {
        if (anchor.classList.contains("active")) { anchor.classList.remove("active") }
        if (`#${anchor.href.split("#")[anchor.href.split("#").length - 1]}` === hashIdForActive) {
            anchor.classList.add("active")
        }
    })
}

window.addEventListener("hashchange", onRouteChanged)


window.addEventListener("load", () => {
    console.log("loadin....")

    if (window.location.href == `${window.location.origin}/${prefixGithubPages}index.html`) {
        window.location.href = `${window.location.origin}/${prefixGithubPages}#home`

        history.pushState({
            id: null
        }, null, `${window.location.origin}/${prefixGithubPages}#home`);
    }
    onRouteChanged()
})


navAnchors.forEach(anchor => {
    //anchors or links
    anchor.addEventListener("click", e => {
        e.stopPropagation()
        e.preventDefault()
        let flag = window.location.href.toLowerCase().includes("index")

        if (flag) {
            history.pushState({
                id: null
            }, null, `https://${window.location.host}/${prefixGithubPages}` + e.target.hash);

        } else {
            window.location.hash = e.target.hash.replace("#", "")
        }
        onRouteChanged()
    })
})
