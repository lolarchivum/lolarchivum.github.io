let sorter = "upvotes"
let term = ""
let player = ""
let subf = ""
let page = 0
let results = []

function add_elem(root, curr) {
  let elem = document.createElement("div")
  elem.className = "comment"

  let body = curr.body
    .replace(/\n/g,"</p><p>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/~~(.*?)~~/g, "<s>$1</s>")
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")

  let date = new Date(curr.date)
  let month = date.getMonth()+1
  if (month < 10) {
    month = "0"+month
  }

  let day = date.getDate()
  if (day < 10) {
    day = "0"+day
  }

  let hour = date.getHours()
  if (hour < 10) {
    hour = "0"+hour
  }

  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = "0"+minutes
  }

  let actualDate = `${date.getFullYear()}.${month}.${day}., ${hour}:${minutes}`
  let title = ""

  if (curr.title != null) {
    title = `<h1>${curr.title}</h1><hr>`
  }

  title += `<h3><span class="name" onclick='loadProfile("${curr.poster}")'>${curr.poster}</span> (+${curr.up_votes}/-${curr.down_votes}) | ${actualDate}`

  if (curr.subforum != null) {
    title += `, itt: <span onclick='loadCategory("${curr.subforum}")'>${curr.subforum}</span>`
  }

  title += "</h3>"

  let embed =""
  if (curr.embed) {
    embed = "<div>"

    if (curr.embed.url) {
      embed += `<a href='${curr.embed.url}'` + curr.embed.url + "</a>"
    }

    if (curr.embed.description) {
      embed += "<p>" + curr.embed.description + "</p>"
    }

    if (curr.embed.image) {
      embed += "<img src='" + curr.embed.image + "'>"
    }

    embed += "</div>"
  }

  elem.innerHTML += `${title}${embed}<p>${body}</p>`

  root.appendChild(elem)

  if (curr.replies.length > 0) {
    elem.innerHTML += "<div class='replies'></div>"
    let replies = elem.querySelector(".replies")

    curr.replies.forEach(r => {
      add_elem(replies, r)
    })
  }
}

function loadProfile(name) {
  document.querySelector("#player").value = name
  document.querySelector("#send").click()
}

function loadCategory(cat) {
  document.querySelector("#subforum").value = cat
    document.querySelector("#subforum").dispatchEvent(new Event("change"))
}

function loadPage() {
  window.scrollTo(0,0);
  document.getElementById("currpage").innerHTML = `${page+1}. / ${results.length}.`
  results.sort((a,b) => compare(a,b, sorter))
  let url = results[page][0]

  fetch(url).then(resp => resp.json()).then(json => {
    document.getElementById("root").innerHTML = ""
    add_elem(document.getElementById("root"), json)
  }).catch(e => {
    document.getElementById("root").innerHTML = `<h1>Valami hiba történt...</h1><center><p>Vagy nincs ilyen játékos, vagy valami más gond van, mindenesetre itt a hibaüzenet:</p><p>"${e}"</p></center>`
  })
}

function switch_page(diff) {
  if (results.length > 0) {
    page += diff
    page = Math.max(0, page)
    page = Math.min(page, results.length-1)

    loadPage()
  }
}

document.querySelector("#big_left").addEventListener("click", () => {switch_page(-10)})
document.querySelector("#big_right").addEventListener("click", () => {switch_page(10)})
document.querySelector("#left").addEventListener("click", () => {switch_page(-1)})
document.querySelector("#right").addEventListener("click", () => {switch_page(1)})



document.querySelector("#top").addEventListener("click", () => {
  window.scrollTo(0,0);
})

function compare(a,b, method) {
  switch (method) {
    case "upvotes":
      return b[1].up_votes - a[1].up_votes

    case "downvotes":
      return b[1].down_votes - a[1].down_votes

    case "date":
      {
      let adate = new Date(a[1].date)
      let bdate = new Date(b[1].date)
      return (adate > bdate) - (adate < bdate)
      }
  }
}

fetch("./index.json").then(resp=>resp.json()).then(index => {
    function select_posts(category, comp) {
	const entries = Object.entries(index)
	results = []
	page = 0

	for (const [key, val] of entries) {
	    if (val[category].toLowerCase().includes(comp.toLowerCase())) {
		results.push(["./posztok/"+key.toLowerCase(), val])
	    }
	}

	loadPage()
    }


  document.querySelector("#subforum").addEventListener("change", () => {
    subf = document.querySelector("#subforum").value
    select_posts("subforum", subf)
  })
    
  document.querySelector("#search").addEventListener("click", () => {
    term = document.querySelector("#searched").value
    select_posts("title", term)
  })

  document.querySelector("#send").addEventListener("click", () => {
    player = document.querySelector("#player").value.toLowerCase()
    select_posts("poster", player)
  })

  document.querySelector("#sort").addEventListener("change", () => {
    if (results.length != 0) {
      page = 0
      sorter = document.querySelector("#sort").value
      loadPage()
    }
  })
})
