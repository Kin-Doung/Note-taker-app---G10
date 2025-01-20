// Initialize folders from localStorage or set default
let folders = JSON.parse(localStorage.getItem("folders")) || { Default: [] };
let currentFolder = "Default";

/** -------- Folder Management -------- **/
// Toggle Folder List Dropdown visibility
function toggleFolderList() {
  const folderListDropdown = document.getElementById("folderListDropdown");
  folderListDropdown.style.display = folderListDropdown.style.display === "block" ? "none" : "block";
}

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
  document.getElementById("folderListDropdown").style.display = "none"; // Close the dropdown after selecting folder
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

// Edit folder name
function editFolder(oldFolderName) {
  const newFolderName = prompt("Enter a new folder name:", oldFolderName);
  if (newFolderName && newFolderName !== oldFolderName && !folders[newFolderName]) {
    // Update folder name in the folders object
    folders[newFolderName] = folders[oldFolderName];
    delete folders[oldFolderName]; // Remove the old folder
    saveFolders();
    displayFolders(); // Re-render the folder list
  } else {
    alert("Folder name is invalid or already exists.");
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

    // Add Edit button for each folder
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering folder selection
      editFolder(folderName); // Call the edit function
    };
    folderItem.appendChild(editBtn);

    // Add Delete button for each folder
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
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${note.id}" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

/** -------- Search and Formatting -------- **/
// Search notes
function searchNotes() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const filteredNotes = folders[currentFolder].filter((note) =>
    note.title.toLowerCase().includes(query)
  );
  displayFilteredNotes(filteredNotes);
}

// Display filtered notes based on search query
function displayFilteredNotes(filteredNotes) {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  filteredNotes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${note.title}" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${note.id}" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

// Formatting functions for the toolbar
function formatText(style) {
  document.execCommand(style, false, null);
}

function changeFontFamily(event) {
  document.execCommand("fontName", false, event.target.value);
}

function changeFontSize(event) {
  document.execCommand("fontSize", false, event.target.value);
}

function changeTextColor(event) {
  document.execCommand("foreColor", false, event.target.value);
}

// Event listener to toggle folder list on Folder button click
document.getElementById("folder").addEventListener("click", toggleFolderList);

// Initialize folders display
displayFolders();
displayNotes();
