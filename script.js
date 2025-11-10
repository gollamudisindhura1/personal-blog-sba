// DOM Elements
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

const colors = ["#e91e63", "#ec407a", "#ba68c8", "#9c27b0", "#ab47bc", "#7b1fa2", "#d81b60"];
let colorIndex = 0;

// Load posts from localStorage
function loadPosts() {
    const saved = localStorage.getItem("blossomDiaryPosts");
    if (saved) posts = JSON.parse(saved);
    renderPosts();
    updateCounter();
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem("blossomDiaryPosts", JSON.stringify(posts));
}


function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// Form validation
function validateForm() {
    let valid = true;
    titleError.textContent = "";
    contentError.textContent = "";

    if (!titleInput.value.trim()) {
        titleError.textContent = "Title is required.";
        valid = false;
    }
    if (!contentInput.value.trim()) {
        contentError.textContent = "Content is required.";
        valid = false;
    }
    return valid;
}

// Update footer counter
function updateCounter() {
    const count = posts.length;
    postCount.textContent = count;
    storageCounter.innerHTML = `You have <strong>${count}</strong> post${count !== 1 ? 's' : ''} saved`;
}

// Render all posts
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

    posts.forEach(post => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        const bgColor = post.color || "#e91e63";

        col.innerHTML = `<article class="post-card" style="background:${bgColor}">
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

// Submit form (Add or Update)
form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateForm()) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const color = colors[colorIndex % colors.length];
    colorIndex++;

    if (editingId) {
        // UPDATE existing post
        const post = posts.find(p => p.id === editingId);
        if (post) {
            post.title = title;
            post.content = content;
        }
        editingId = null;
        submitBtn.textContent = "Add Post";
        document.getElementById("postModalLabel").textContent = "Create New Post";

        Swal.fire({
            icon: "success",
            title: "Post Updated!",
            text: "Your post has been updated.",
            timer: 2200,
            showConfirmButton: false
        });
    } else {
        // ADD new post
        posts.unshift({
            id: Date.now().toString(),
            title,
            content,
            color,
            timestamp: new Date().toISOString()
        });

        Swal.fire({
            icon: "success",
            title: "New Post!",
            text: "Your post has been saved.",
            timer: 2500,
            showConfirmButton: false
        });
    }

    savePosts();
    renderPosts();
    updateCounter();
    form.reset();

    // Hide modal
    bootstrap.Modal.getInstance(document.getElementById("postModal")).hide();
});

// Edit & Delete buttons
postsList.addEventListener("click", e => {
    const btn = e.target;

    // DELETE
    if (btn.classList.contains("btn-delete")) {
        const id = btn.dataset.id;

        Swal.fire({
            title: "Delete this post?",
            text: "It will be gone forever!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                posts = posts.filter(p => p.id !== id);
                savePosts();
                renderPosts();
                updateCounter();
                Swal.fire("Deleted!", "Your post has been removed.", "success");
            }
        });
    }

    // EDIT
    if (btn.classList.contains("btn-edit")) {
        const id = btn.dataset.id;
        const post = posts.find(p => p.id === id);
        if (post) {
            titleInput.value = post.title;
            contentInput.value = post.content;
            editingId = id;

            submitBtn.textContent = "Update Post";
            document.getElementById("postModalLabel").textContent = "Edit Post";

            // Open modal correctly
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("postModal"));
            modal.show();

            titleInput.focus();
        }
    }
});

// View all posts in footer
storageCounter.addEventListener("click", e => {
    e.preventDefault();
    if (posts.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Your Blog is Empty",
            text: "No posts yet!",
            confirmButtonText: "Okay"
        });
    } else {
        const postList = posts.map(p => `
            <div style="background: ${p.color || '#e91e63'}; color: white; padding: 1.2rem; margin: 0.8rem 0; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.3);">
                <strong style="font-size: 1.3rem;">${escapeHTML(p.title)}</strong><br>
                <small>${new Date(p.timestamp).toLocaleDateString()}</small>
                <p style="margin: 0.8rem 0; font-size: 1.1rem;">${escapeHTML(p.content)}</p>
            </div>
        `).join('');

        Swal.fire({
            title: `You have ${posts.length} post${posts.length > 1 ? 's' : ''}`,
            html: postList,
            width: "700px",
            showCloseButton: true,
            confirmButtonText: "Close"
        });
    }
});

// Initialize
document.getElementById("year").textContent = new Date().getFullYear();
loadPosts();