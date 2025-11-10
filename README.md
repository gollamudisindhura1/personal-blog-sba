# Interactive Personal Blog (SBA)

A simple client-side personal blog (journal) built for the Skills-Based Assessment (SBA). It lets you create, edit, and delete posts. All posts are stored in your browser's `localStorage`, so they persist across refreshes on the same machine and browser.


## Reflection (what I learned)
- Building the UI and logic together teaches how DOM updates and application state must stay in sync.
- `localStorage` is easy for persistence in demos, but it's not secure for sensitive data or multi-user apps.
- Event delegation greatly simplifies handling actions on dynamically created elements (like posts).
- Validating inputs and giving friendly error messages creates a better UX.

# Resources & References

Bootstrap 5 Modal Docs - https://getbootstrap.com/docs/5.3/components/modal/

MDN: localStorage - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event

MDN: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

JavaScript Array Methods - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

W3Schools: Bootstrap Buttons - https://www.w3schools.com/bootstrap5/bootstrap_buttons.php
