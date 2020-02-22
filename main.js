function add_elem(root, curr) {
    let elem = document.createElement("div")
    elem.className = "comment"

    let body = curr.body
	.replace(/\n/g,"</p><p>")
	.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
	.replace(/\*(.*?)\*/g, "<i>$1</i>")
	.replace(/_(.*?)_/g, "<i>$1</i>")
	.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")

    elem.innerHTML = `<h3>${curr.poster} (+${curr.up_votes}/-${curr.down_votes}) | ${curr.date}</h3><p>${body}</p>`

    root.appendChild(elem)

    if (curr.replies.length > 0) {
	elem.innerHTML += "<div class='replies'></div>"
	let replies = elem.querySelector(".replies")

	curr.replies.forEach(r => {
	    add_elem(replies, r)
	})
    }
}

let player = "Nemin"
let page = 0


let results = []

function loadPage() {
    document.getElementById("currpage").innerHTML = `${page+1}. Oldal`
    let url = ""
    
    if (results.length == 0) {
	url = `./posztok/${player}/${page}.json`
    } else {
	url = results[page]
    }

    fetch(url).then(resp => resp.json()).then(json => {
	document.getElementById("root").innerHTML = `<h1>${json.title}</h1>`
	add_elem(document.getElementById("root"), json)
    }).catch(e => {
	document.getElementById("root").innerHTML = `<h1>Valami hiba történt...</h1><center><p>Vagy nincs ilyen játékos, vagy valami más gond van, mindenesetre itt a hibaüzenet:</p><p>"${e}"</p></center>`
    })
}

document.querySelector("#big_left").addEventListener("click", () => {
    page -= 10
    page = Math.max(0, page)

    loadPage()
})

document.querySelector("#big_right").addEventListener("click", () => {
    page += 10

    //TODO: Add more checking.
    if (results.length > 0)
	page = Math.min(page, results.length-1)

    loadPage()
})

document.querySelector("#left").addEventListener("click", () => {
    page -= 1
    page = Math.max(0, page)

    loadPage()
})

document.querySelector("#right").addEventListener("click", () => {
    page += 1

    //TODO: Add more checking.
    if (results.length > 0)
	page = Math.min(page, results.length-1)

    loadPage()
})

document.querySelector("#send").addEventListener("click", () => {
    page = 0
    player = document.querySelector("#player").value.toLowerCase()
    results = []

    loadPage()
})


document.querySelector("#top").addEventListener("click", () => {
  window.scrollTo(0,0);
})


fetch("./index.json").then(resp=>resp.json()).then(index => {
    document.querySelector("#search").addEventListener("click", () => {

	let term = document.querySelector("#searched").value

	const entries = Object.entries(index)

	results = []
	for (const [key, val] of entries) {
	    if (val.toLowerCase().includes(term.toLowerCase())) {
		results.push("./posztok/"+key.toLowerCase())
		console.log(val)
	    }
	}

	page = 0
	loadPage()
    })
})
