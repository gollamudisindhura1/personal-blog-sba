// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const submitBtn = document.getElementById("submitBtn");
const postsList = document.getElementById("postsList");
const storageCounter = document.getElementById("storageCounter");
const postCount = document.getElementById("postCount");

const titleError = document.getElementById("titleError");
const contentError = document.getElementById("contentError");

let posts = [];
let editingId = null;

// Pretty pastel color palette for each new post
const colors = ["#e91e63", "#ec407a", "#ba68c8", "#9c27b0", "#ab47bc", "#7b1fa2", "#d81b60"];
let colorIndex = 0;

// Save Functions
function loadPosts() {
  const saved = localStorage.getItem("blossomDiaryPosts");
  if (saved) {
    posts = JSON.parse(saved);
    console.log("Loaded posts from localStorage:", posts);
  }
  renderPosts();
  updateCounter();
}

function savePosts() {
  localStorage.setItem("blossomDiaryPosts", JSON.stringify(posts));
  console.log("Posts saved to localStorage:", posts);
}

// Utilities
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Form 
function validateForm() {
  let valid = true;
  document.getElementById("titleError").textContent = "";
  document.getElementById("contentError").textContent = "";

  if (!titleInput.value.trim()) {
            document.getElementById("titleError").textContent = "Title is required.";
            valid = false;
        }
        if (!contentInput.value.trim()) {
            document.getElementById("contentError").textContent = "Content is required.";
            valid = false;
        }
        return valid;
}

// Counter Update
function updateCounter() {
  const count = posts.length;
  postCount.textContent = count;
  const sSpan = document.getElementById("s");
    if (sSpan) sSpan.textContent = count !== 1 ? "s" : "";
        storageCounter.innerHTML = `You have <strong>${count}</strong> post${count !== 1 ? "s" : ""} saved.`;
    
}

// Render Posts
function renderPosts() {
  postsList.innerHTML = "";
  console.log("Rendering posts...");

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

  posts.forEach(post => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    //const bgColor = post.color || "#e91e63";

    col.innerHTML = `
      <article class="post-card" style="background:${post.color}">
        <h3 class="post-title">${escapeHTML(post.title)}</h3>
        <p class="post-content">${escapeHTML(post.content)}</p>
        <small class="post-meta">Posted on ${new Date(post.timestamp).toLocaleDateString()}</small>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-edit btn-sm flex-fill" data-id="${post.id}">Edit</button>
          <button class="btn btn-delete btn-sm flex-fill" data-id="${post.id}">Delete</button>
        </div>
      </article>`;
    postsList.appendChild(col);
  });
}


// Submission Form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(" Form submitted.");

    if (!validateForm()) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please fill in both title and content!",
                confirmButtonColor: "#e91e63"
            });
            return;
          }

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const color = colors[colorIndex % colors.length];
  colorIndex++;
// UPDATE
  if (editingId) {
            const post = posts.find(p => p.id === editingId);
            if (post) { post.title = title; post.content = content; }
            editingId = null;
            submitBtn.textContent = "Add Post";
            document.getElementById("postModalLabel").textContent = "Create New Post";
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Your post has been updated successfully!",
                timer: 2000,
                showConfirmButton: false,
                background: "#fdf2f8",
                color: "#e91e63"
            });
  } else {
    posts.unshift({ 
    id: Date.now().toString(), 
    title, 
    content, 
    color, 
    timestamp: new Date().toISOString() });
    Swal.fire({
                icon: "success",
                title: "Posted!",
                text: "Your new post has been added!",
                timer: 2000,
                showConfirmButton: false,
                background: "#fdf2f8",
                color: "#e91e63",
                iconColor: "#e91e63"
            });
        }
 
  savePosts();
  renderPosts();
  updateCounter();
  form.reset();

  // Close modal properly
  const modalElement = document.getElementById("postModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
    setTimeout(() => {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 150);
});


// Event Deletion  and edit
postsList.addEventListener("click", e => {
        const btn = e.target;
        if (!btn.matches("button")) return;
        const id = btn.dataset.id;

        if (btn.classList.contains("btn-delete")) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this post!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
                background: "#fdf2f8"
            }).then(result => {
                if (result.isConfirmed) {
                    posts = posts.filter(p => p.id !== id);
                    savePosts();
                    renderPosts();
                    updateCounter();
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "Your post has been deleted.",
                        timer: 1500,
                        showConfirmButton: false,
                        background: "#fdf2f8"
                    });
                }
            });
        }

        if (btn.classList.contains ("btn-edit")) {
            const post = posts.find(p => p.id === id);
            if (post) {
                titleInput.value = post.title;
                contentInput.value = post.content;
                editingId = id;
                submitBtn.textContent = "Update Post";
                document.getElementById("postModalLabel").textContent = "Edit Post";
                new bootstrap.Modal(document.getElementById("postModal")).show();
            }
        }
      })
//Footer- To view all the posts
storageCounter.addEventListener("click", e => {
        e.preventDefault();
        if (posts.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Empty Diary",
                text: "No posts yet! Click '+ Write a Petal' to begin.",
                confirmButtonColor: "#e91e63"
            });
            return;
        }

        let list = posts.map(p => `• ${p.title}`).join("\n");
        Swal.fire({
            title: `You have ${posts.length} post${posts.length > 1 ? "s" : ""}`,
            text: list,
            icon: "info",
            confirmButtonText: "BOOM!",
            confirmButtonColor: "#e91e63",
            background: "#fdf2f8",
            width: "600px"
        });
    });

    document.getElementById("year").textContent = new Date().getFullYear();
    loadPosts();
});
