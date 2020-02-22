const pagesize = 25;

function add_elem(root, curr) {
  let elem = document.createElement("div")
  elem.className = "comment"
  elem.innerHTML = `<h3>${curr.poster} (+${curr.up_votes}/-${curr.down_votes}) | ${curr.date}</h3><p>${curr.body.replace(/\n/g,"</p><p>")}</p>`

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


function loadPage(page) {
    document.getElementById("currpage").innerHTML = `${page+1}. Oldal`
    fetch(`./posztok/${player}/${page}.json`).then(resp => resp.json()).then(json => {
      document.getElementById("root").innerHTML = `<h1>${json.title}</h1>`
      add_elem(document.getElementById("root"), json)
    }).catch(e => {
      document.getElementById("root").innerHTML = `<h1>Valami hiba történt...</h1><center><p>Vagy nincs ilyen játékos, vagy valami más gond van, mindenesetre itt a hibaüzenet:</p><p>"${e}"</p></center>`
    })
}

document.querySelector("#big_left").addEventListener("click", () => {
    page -= 10
    page = Math.max(0, page)

    loadPage(page)
})

document.querySelector("#big_right").addEventListener("click", () => {
    page += 10

    //TODO: Add checking.
    //page = Math.max(0, page)

    loadPage(page)
})

document.querySelector("#left").addEventListener("click", () => {
    page -= 1
    page = Math.max(0, page)

    loadPage(page)
})

document.querySelector("#right").addEventListener("click", () => {
    page += 1

    //TODO: Add checking.
    //page = Math.max(0, page)

    loadPage(page)
})

document.querySelector("#send").addEventListener("click", () => {
    page = 0
    player = document.querySelector("#player").value

    //TODO: Add checking.
    //page = Math.max(0, page)

    loadPage(page)
})


document.querySelector("#top").addEventListener("click", () => {
  window.scrollTo(0,0);
})
