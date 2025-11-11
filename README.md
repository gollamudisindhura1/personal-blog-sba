# Interactive Personal Blog (SBA)

## Overview
A simple client-side personal blog (journal) built for the Skills-Based Assessment (SBA). It lets you create, edit, and delete and view your personal posts. All posts are stored in your browser's `localStorage`, so they persist across refreshes on the same machine and browser.

## Features
- Create and Edit posts via a centered, animated Bootstrap modal with real-time validation
- Persistent Storage using `localStorage` where posts survive refresh and browser close
- Live footer which counts your posts when added or deleted
- Delete your post with confirmation using the SweetAlert2 dialogs

## Resources Technologies Used

These resources were invaluable during debugging and learning:

- Bootstrap 5 Modal Documentation – getbootstrap.com/docs/5.3/components/modal
- SweetAlert2 Examples – github.com/sweetalert2/sweetalert2--https://sweetalert2.github.io/#
- MDN Web Docs: localStorage – developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- CSS Tricks: backdrop-filter caveats – css-tricks.com/almanac/properties/b/backdrop-filter
- Stack Overflow: Bootstrap modal backdrop removal – Multiple threads on modal stuck issues

## Challenges
- Data disappearing after refresh I fixed the localStorage with the load and save logic
- Modal was not closing properly. I haved used bootstrap.Modal.getInstance() to close it safely
- The edit and delete buttons were not working they did not respond even though looked fine. I have found out the issue was with event delegation. As the buttons were created dynamically, I attached the click listner to the parent and used e.target to identify clicks.

## Reflection

- This project helped me understand DOM manipulation, form validation, and data persistence in real web apps.