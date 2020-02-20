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

function loadPage(page) {
  let promises = []

  for (let i = page; i < page+pagesize; i++) {
    promises.push(fetch(`./Top1000/${i}.json`))
  }


  Promise.all(promises).then(responses => Promise.all(responses.map(r => r.json()))).then(jsons => {
    jsons.sort((a,b) => a.up_votes < b.up_votes);

    document.getElementById("root").innerHTML =""

    jsons.forEach(json => {
      document.getElementById("root").innerHTML += `<h1>${json.title}</h1>`
      add_elem(document.getElementById("root"), json)
    })
  }).catch(e => {console.log(e)})
}

loadPage(0)

//let count = pagesize

let select = document.querySelector("#list")

select.addEventListener("change", () => {
    let start = (Number(select.value)-1)*pagesize

    loadPage(start)
})

document.querySelector("#top").addEventListener("click", () => {
    window.scrollTo(0,0);
})
