let db;
let folders = { Home: [] };  
let currentFolder = "Home"; 

function initializeDB() {
  const request = indexedDB.open("NotesApp", 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains("folders")) {
      db.createObjectStore("folders", { keyPath: "name" });
    }
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    loadFolders(() => {
      displayFolders();
      displayNotes();
      deleteSpecificNotes(); 
    });
  };

  request.onerror = (event) => {
    console.error("IndexedDB error:", event.target.error);
  };
}

function saveFolders() {
  const transaction = db.transaction(["folders"], "readwrite");
  const objectStore = transaction.objectStore("folders");
  objectStore.put({ name: "data", folders });

  transaction.onerror = (event) => {
    console.error("Failed to save folders:", event.target.error);
  };
}

function loadFolders(callback) {
  const transaction = db.transaction(["folders"], "readonly");
  const objectStore = transaction.objectStore("folders");
  const request = objectStore.get("data");

  request.onsuccess = (event) => {
    if (event.target.result) {
      folders = event.target.result.folders;
    } else {
      folders = { Home: [] };  // Set Home as the initial folder
    }
    if (callback) callback();
  };

  request.onerror = (event) => {
    console.error("Failed to load folders:", event.target.error);
  };
}

/** -------- Folder Management -------- **/

function addFolder() {
  const folderName = document.getElementById("newFolderName").value.trim();
  if (folderName && !folders[folderName]) {
    folders[folderName] = [];
    saveFolders();
    displayFolders();
    document.getElementById("newFolderName").value = "";
  } else {
    alert("Folder already exists or name is invalid.");
  }
}

function selectFolder(folderName) {
  currentFolder = folderName;
  displayNotes();
}

function deleteFolder(folderName) {
  // Remove the restriction to delete the Home folder
  if (folderName !== "Home") {
    delete folders[folderName];
    saveFolders();
    displayFolders();
    if (folderName === currentFolder) {
      currentFolder = "Home";  // Switch to "Home" if the current folder is deleted
      displayNotes();
    }
  } else {
    alert("You cannot delete the Home folder.");
  }
}

function displayFolders() {
  const foldersList = document.getElementById("foldersList");
  foldersList.innerHTML = "";

  Object.keys(folders).forEach((folderName) => {
    const folderItem = document.createElement("li");
    folderItem.textContent = folderName;
    folderItem.onclick = () => selectFolder(folderName);
    folderItem.classList.toggle(folderName === currentFolder);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteFolder(folderName);
    };
    folderItem.appendChild(deleteBtn);

    foldersList.appendChild(folderItem);
  });
}

/** -------- Note Management -------- **/

function addNote() {
  const newNote = {
    id: Date.now(),
    title: "",
    content: "",
    saved: false,
  };
  folders[currentFolder].push(newNote);
  saveFolders();
  displayNotes();
}

function editNoteTitle(id, event) {
  const note = folders[currentFolder].find((note) => note.id === id);
  note.title = event.target.value;
  saveFolders();
}

function editNoteContent(id) {
  const note = folders[currentFolder].find((note) => note.id === id);
  const noteContent = document.getElementById(`note-${id}`).textContent;
  note.content = noteContent;
  saveFolders();
}

function removeNote(id) {
  folders[currentFolder] = folders[currentFolder].filter(
    (note) => note.id !== id
  );
  saveFolders();
  displayNotes();
}

function togglesave(id) {
  const note = folders[currentFolder].find((note) => note.id === id);
  if (note) {
    note.saved = !note.saved;
    saveFolders();
    displayNotes();
  } else {
    console.error("Note not found:", id);
  }
}

function deleteSpecificNotes() {
  const titlesToDelete = ["wert", "erf", "fghjkl"];
  folders[currentFolder] = folders[currentFolder].filter(
    (note) => !titlesToDelete.includes(note.title)
  );
  saveFolders();
  displayNotes();
}

function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const notes = folders[currentFolder] || [];
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");
    if (note.saved) {
      noteElement.classList.add("saved");
    }

    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="save-btn" onclick="togglesave(${note.id})">${
      note.saved ? "Not Save" : "Save"
    }</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

/** -------- Search & Formatting -------- **/

function searchNotes() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const notes = folders[currentFolder].filter(
    (note) =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
  );
  displayFilteredNotes(notes);
}

function displayFilteredNotes(filteredNotes) {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  filteredNotes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");
    if (note.saved) {
      noteElement.classList.add("saved");
    }

    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="save-btn" onclick="togglesave(${note.id})">${
      note.saved ? "Not Save" : "Save"
    }</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

function formatText(command) {
  document.execCommand(command, false, null);
}

function changeFontFamily(event) {
  const fontFamily = event.target.value;
  document.execCommand("fontName", false, fontFamily);
}

function changeFontSize(event) {
  const fontSize = event.target.value;
  document.execCommand("styleWithCSS", true, null);
  document.execCommand("fontSize", false, "7");
  document.querySelectorAll("font[size='7']").forEach((font) => {
    font.style.fontSize = fontSize;
  });
}

function changeTextColor(event) {
  const color = event.target.value;
  document.execCommand("foreColor", false, color);
}

/** -------- Initialization -------- **/

document.addEventListener("DOMContentLoaded", () => {
  initializeDB();
});
