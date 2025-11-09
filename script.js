// DOM Elements
const form = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const postsList = document.getElementById("postsList");

const titleError = document.getElementById("titleError");
const contentError = document.getElementById("contentError");

let posts = []
let editingId =[]

function loadPosts(){
    const saved = localStorage.getItem("blogPosta")
    if (saved) posts= JSON.parse(saved)
        renderPosts()
}
function savePosts(){
    localStorage.setItem("blogPosts", JSON.stringify(posts))
}

function generateId(){
    return Date.now().toString()
}

function escapeHTML(str){
    const div = document.createElement("div")
    div.textContent =str
    return div.innerHTML
}

function validateForm(){
    let valid = true
    titleError.textContent = ""
    contentError.textContent=""

    if(!contentInput.value.trim()){
        contentError.textContent = "Content is Required."
        valid = false
    }
    return valid

}

function renderPosts() {
  postsList.innerHTML = "";

  if (posts.length === 0) {
    postsList.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <p>No entries yet.</p>
          <p class="lead">Start writing your first thought!</p>
        </div>
      </div>`;
    return;
  }
posts.forEach(post =>{
    const col = document.createElement("div")
    col.className="col-md-6 col-lg-4"
    col.innerHTML=`<article class="card post-card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h3 class="post-title">${escapeHTML(post.title)}</h3>
          <p class="post-content">${escapeHTML(post.content)}</p>
          <small class="post-meta">Posted: ${new Date(post.timestamp).toLocaleString()}</small>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-warning btn-sm btn-edit flex-fill" data-id="${post.id}">Edit</button>
            <button class="btn btn-danger btn-sm btn-delete flex-fill" data-id="${post.id}">Delete</button>
          </div>
        </div>
      </article>`
      postsList.appendChild(col)
})
}
//Submit Form
form.addEventListener("submit", e=>{
    e.preventDefault()
    if(!validateForm()) return
    const tittle = titleInput.value.trim()
    const content = contentInput.value.trim()

    if(editingId){
        const post = posts.find(p => p.id ===editingId)
        post.tittle = tittle
        post.content= content
        editingId = null
        submitBtn.textContent ="Add Post"
        formTitle.textContent="Create New Post"
        cancelBtn.style.display = "none"
        
    }else {
        posts.unshift({
            id.generateId(),
            tittle,
            content,
            timestamp: new Date().toISOString()
        })
    }
    savePosts()
    renderPosts()
    form.reset()
})

// Event  to the Cancel Edit 

cancelBtn.addEventListener("click", ()=>{
    editingId = null
    submitBtn.textContent ="Add Post"
    formTitle.textContent="Create New Posts"
    cancelBtn.style.display = "none";
    form.reset();
    titleError.textContent = "";
    contentError.textContent = "";
})




