How to Run

Clone/download the repository.

Open index.html in any modern browser.

Add students, select courses, assign via drag-and-drop.

Observe dynamic updates in charts and lists.



Quick Overview

A web-based simulator built with vanilla JavaScript, HTML, and CSS that allows:

Adding students with auto-generated IDs and multiple course selections.

Assigning students to course levels via drag-and-drop.

Visualizing student enrollment with dynamic charts.

Managing student data with localStorage persistence.

  Fully coded manually; no AI-generated code.




Key Features

Dynamic Student Management: Add, view, and delete students with validation.

Drag-and-Drop Course Assignment: Assign students to Beginner, Intermediate, Advanced levels.

Analytics Charts:

Students per Course Level.

Course Enrollment Overview.

Persistent Storage: Data remains after page reload via localStorage.

User Feedback: Success/error toasters for all actions.




Tech Stack & Libraries

Frontend: HTML, CSS, JavaScript (ES6+)

Charting: Chart.js

UI/Styling: Bootstrap 5

Notifications: Toastify.js




Project Structure
index.html       → Main HTML page
style.css        → Custom styling
data.js          → Courses and course levels data
util.js          → Utility functions: charts, localStorage, toasters
app.js           → Main app logic: forms, drag-and-drop, rendering

