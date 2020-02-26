let sorter = "upvotes"
let page = 0
let results = []

function zero_pad(val) {
  if (val < 10) {
    return "0" + val
  } else {
    return val
  }
}

function add_elem(root, curr) {
  let elem = document.createElement("div")
  elem.className = "comment"

  let body = curr.body
    .replace(/\n/g,"</p><p>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/~~(.*?)~~/g, "<s>$1</s>")
    .replace(/(http(s*):\/\/.*\.(jpg|png|gif))/g, "<img src='$1' style='max-width: 100%;'>")
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")

  let date = new Date(curr.date)
  let month = zero_pad(date.getMonth()+1)
  let day = zero_pad(date.getDate())
  let hour = zero_pad(date.getHours())
  let minutes = zero_pad(date.getMinutes())

  let actualDate = `${date.getFullYear()}.${month}.${day}., ${hour}:${minutes}`
  let title = ""

  if (curr.title != null) {
    title = `<h1>${curr.title}</h1><hr>`
  }

  title += `<h3><span class="name" onclick='loadProfile("${curr.poster}")'>${curr.poster}</span> (+${curr.up_votes}/-${curr.down_votes}) – ${actualDate}`

  if (curr.subforum != null) {
    title += `, itt: <span class="name" onclick='loadCategory("${curr.subforum}")'>${curr.subforum}</span>`
  }

  title += "</h3>"

  let embed =""
  if (curr.embed) {
    embed = "<div class='embed'>"

    if (curr.embed.image) {
      if (curr.embed.url) {
        embed += `<a href='${curr.embed.url}'>`
      }

      embed += "<img alt='Embed image' src='" + curr.embed.image + "'>"

      if (curr.embed.url) {
        embed += "</a>"
      }
    } else {
      if (curr.embed.url) {
        embed += `<a href='${curr.embed.url}'>[Link]</a>`
      }
    }


    if (curr.embed.description) {
      embed += "<p>" + curr.embed.description + "</p>"
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
    document.getElementById("root").innerHTML = `<div class="comment"><h1>Valami hiba történt...</h1><center><p>Nagy valószínűséggel olyan ember próbáltad megnyitni, aki a böngésző számára értelmezhetetlen karaktereket használ a nevében. Sajnos eddig még nem tudtam rájönni ezt, hogy lehet orvosolni, Mindenesetre nézz a jobb alsó sarokba, hátha átléphetsz egy másik (remélhetőleg működő) posztra. (Hibaüzenet: "${e}")</p></center></div>`
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

    case "revdate":
      {
        let adate = new Date(b[1].date)
        let bdate = new Date(a[1].date)
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
    select_posts("subforum", document.querySelector("#subforum").value)
  })

  document.querySelector("#search").addEventListener("click", () => {
    select_posts("title", document.querySelector("#searched").value)
  })

  document.querySelector("#send").addEventListener("click", () => {
    select_posts("poster", document.querySelector("#player").value)
  })

  document.querySelector("#sort").addEventListener("change", () => {
    sorter = document.querySelector("#sort").value
    if (results.length != 0) {
      page = 0
      loadPage()
    }
  })
})
