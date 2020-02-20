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

for (let i = 0; i < pagesize; i++) {
    fetch(`./Top1000/${i}.json`).then(resp => resp.json()).then(json => {
	document.getElementById("root").innerHTML += `<h1><a href="./Top100/${i}.json">${json.title}</a></h1>`
	add_elem(document.getElementById("root"), json)
    })
}

//let count = pagesize

let select = document.querySelector("#list")

select.addEventListener("change", () => {
    let start = (Number(select.value)-1)*pagesize
    
    document.getElementById("root").innerHTML = ""
    for (let i = start; i < start+pagesize; i++) {
	fetch(`./Top1000/${i}.json`).then(resp => resp.json()).then(json => {
	    document.getElementById("root").innerHTML += `<h1><a href="./Top100/${i}.json">${json.title}</a></h1>`
	    add_elem(document.getElementById("root"), json)
	})
    }

    //count += pagesize
})

document.querySelector("#top").addEventListener("click", () => {
    window.scrollTo(0,0);
})
