// Initialize folders from localStorage or set default
let folders = JSON.parse(localStorage.getItem("folders")) || { Default: [] };
let currentFolder = "Default";

/** -------- Folder Management -------- **/

// Create a new folder
function addFolder() {
    const folderName = document.getElementById("newFolderName").value.trim();
    if (folderName && !folders[folderName]) {
        folders[folderName] = []; // Initialize the folder with an empty array
        saveFolders();
        displayFolders();
        document.getElementById("newFolderName").value = "";
    } else {
        alert("Folder already exists or name is invalid.");
    }
}

// Switch to a different folder
function selectFolder(folderName) {
    currentFolder = folderName;
    displayNotes();
}

// Save folders to localStorage
function saveFolders() {
    localStorage.setItem("folders", JSON.stringify(folders));
}

// Delete a folder
function deleteFolder(folderName) {
    if (folderName !== "Default") { // Prevent deleting the Default folder
        delete folders[folderName]; // Remove the folder
        saveFolders();
        displayFolders();
        if (folderName === currentFolder) {
            currentFolder = "Default"; // Switch to Default folder if current one is deleted
            displayNotes();
        }
    } else {
        alert("You cannot delete the Default folder.");
    }
}

// Display folders in the sidebar
function displayFolders() {
    const foldersList = document.getElementById("foldersList");
    foldersList.innerHTML = "";

    Object.keys(folders).forEach((folderName) => {
        const folderItem = document.createElement("li");
        folderItem.textContent = folderName;
        folderItem.onclick = () => selectFolder(folderName);
        folderItem.classList.toggle("active", folderName === currentFolder);

        // Add delete button for each folder
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering folder selection
            deleteFolder(folderName);
        };
        folderItem.appendChild(deleteBtn);

        foldersList.appendChild(folderItem);
    });
}

/** -------- Note Management -------- **/

// Create a new note
function addNote() {
    const newNote = {
        id: Date.now(),
        title: "",
        content: "",
        pinned: false,
    };
    folders[currentFolder].push(newNote);
    saveFolders();
    displayNotes();
}

// Edit note title
function editNoteTitle(id, event) {
    const note = folders[currentFolder].find((note) => note.id === id);
    note.title = event.target.value;
    saveFolders();
}

// Edit note content
function editNoteContent(id) {
    const note = folders[currentFolder].find((note) => note.id === id);
    const noteContent = document.getElementById(`note-${id}`).textContent;
    note.content = noteContent;
    saveFolders();
}

// Delete a note
function removeNote(id) {
    folders[currentFolder] = folders[currentFolder].filter((note) => note.id !== id);
    saveFolders();
    displayNotes();
}

// Pin or unpin a note
function togglePin(id) {
    const note = folders[currentFolder].find((note) => note.id === id);
    if (note) {
        note.pinned = !note.pinned;
        saveFolders();
        displayNotes();
    } else {
        console.error("Note not found:", id);
    }
}

// Delete specific notes based on title
function deleteSpecificNotes() {
    const titlesToDelete = ["wert", "erf", "fghjkl"];
    folders[currentFolder] = folders[currentFolder].filter(
        (note) => !titlesToDelete.includes(note.title)
    );
    saveFolders();
    displayNotes();
}

// Display notes in the current folder
function displayNotes() {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    const notes = folders[currentFolder];
    notes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        if (note.pinned) {
            noteElement.classList.add("pinned");
        }

        noteElement.innerHTML = `
      <input type="text" class="note-title" value="${note.title
            }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${note.id}" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${note.pinned ? "Unpin" : "Pin"
            }</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
        notesContainer.appendChild(noteElement);
    });
}

/** -------- Search & Formatting -------- **/

// Search notes within the current folder
function searchNotes() {
    const query = document.getElementById("searchBar").value.toLowerCase();
    const notes = folders[currentFolder].filter(
        (note) =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
    );
    displayFilteredNotes(notes);
}

// Display filtered notes
function displayFilteredNotes(filteredNotes) {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    filteredNotes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");
        if (note.pinned) {
            noteElement.classList.add("pinned");
        }

        noteElement.innerHTML = `
      <input type="text" class="note-title" value="${note.title
            }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${note.id}" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${note.pinned ? "Unpin" : "Pin"
            }</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
        notesContainer.appendChild(noteElement);
    });
}

// Format text using execCommand
function formatText(command) {
    document.execCommand(command, false, null);
}

// Change font family for the selected text
function changeFontFamily(event) {
    const fontFamily = event.target.value;
    document.execCommand("fontName", false, fontFamily);
}

// Change font size for the selected text
function changeFontSize(event) {
    const fontSize = event.target.value;
    document.execCommand("styleWithCSS", true, null);
    document.execCommand("fontSize", false, "7"); // Applies size, customize in CSS.
    document.querySelectorAll("font[size='7']").forEach((font) => {
        font.style.fontSize = fontSize;
    });
}

// Change text color for the selected text
function changeTextColor(event) {
    const color = event.target.value;
    document.execCommand("foreColor", false, color);
}

/** -------- Initialization -------- **/

// Initialize app on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    displayFolders();
    displayNotes();
    deleteSpecificNotes(); // Automatically delete specific notes when the app initializes
});
