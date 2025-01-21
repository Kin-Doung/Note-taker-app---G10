// Initialize folders and trash from localStorage
let folders = JSON.parse(localStorage.getItem("folders")) || { Default: [] };
let deletedFolders = JSON.parse(localStorage.getItem("deletedFolders")) || {}; 
let currentFolder = "Default"; // default folder

/** -------- Folder Management -------- **/
// Save folders and deleted folders to localStorage
function saveFolders() {
  localStorage.setItem("folders", JSON.stringify(folders));
  localStorage.setItem("deletedFolders", JSON.stringify(deletedFolders));
}

// Toggle folder list dropdown
function toggleFolderList() {
  const folderListDropdown = document.getElementById("folderListDropdown");
  folderListDropdown.style.display = folderListDropdown.style.display === "block" ? "none" : "block";
}

// Create a new folder
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

// Switch to a different folder
function selectFolder(folderName) {
  currentFolder = folderName;
  displayNotes();
  document.getElementById("folderListDropdown").style.display = "none";
}

// Go back to Default folder
function goToHome() {
  currentFolder = "Default";
  displayNotes();
  document.getElementById("folderListDropdown").style.display = "none";
}

// Delete a folder (move to trash)
function deleteFolder(folderName) {
  if (folderName !== "Default") {
    deletedFolders[folderName] = folders[folderName]; // Move to trash
    delete folders[folderName]; // Delete the folder
    saveFolders();
    displayFolders();
    if (folderName === currentFolder) {
      currentFolder = "Default";
      displayNotes();
    }
  } else {
    alert("You cannot delete the Default folder.");
  }
}

// Restore a deleted folder
function restoreFolder(folderName) {
  if (deletedFolders[folderName]) {
    folders[folderName] = deletedFolders[folderName]; // Restore folder
    delete deletedFolders[folderName]; // Remove from trash
    saveFolders();
    displayFolders();
    displayNotes(); 
  }
}

// View trash (show deleted folders)
function viewTrash() {
  const trashView = document.getElementById("trashView");
  const trashList = document.getElementById("trashList");
  trashList.innerHTML = ""; // Clear previous content

  // Display deleted folders
  Object.keys(deletedFolders).forEach((folderName) => {
    const folderItem = document.createElement("div");
    folderItem.classList.add("trash-folder");
    
    folderItem.innerHTML = `
      <span>${folderName}</span>
      <button onclick="restoreFolder('${folderName}')">Restore</button>
    `;
    trashList.appendChild(folderItem);
  });

  // Display trash view
  trashView.style.display = "block";
}

// Close trash view
function closeTrash() {
  document.getElementById("trashView").style.display = "none";
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
      <button class="pin-btn" onclick="togglePin(${note.id})">${note.pinned ? "Unpin" : "Pin"}</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

// Display notes in the current folder
function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const notes = folders[currentFolder];
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${note.title}" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${note.id}" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${note.pinned ? "Unpin" : "Pin"}</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

/** -------- Formatting Functions -------- **/
// Formatting functions for toolbar
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

// Event listener to toggle folder list
document.getElementById("folder").addEventListener("click", toggleFolderList);

// Initialize
displayFolders();
displayNotes();


// Permanently delete a folder from the trash
function deleteFolderPermanently(folderName) {
  if (deletedFolders[folderName]) {
    delete deletedFolders[folderName]; // Remove from trash
    saveFolders(); // Save changes to localStorage
    viewTrash(); // Refresh trash view
  }
}

// Restore all deleted folders
function restoreAllFolders() {
  Object.keys(deletedFolders).forEach((folderName) => {
    folders[folderName] = deletedFolders[folderName]; // Move back to folders
  });
  deletedFolders = {}; // Clear trash
  saveFolders(); // Save changes to localStorage
  displayFolders(); // Refresh folder list
  displayNotes(); // Refresh notes in the current folder
  closeTrash(); // Close trash view
}

// View trash (show deleted folders) with additional actions
function viewTrash() {
  const trashView = document.getElementById("trashView");
  const trashList = document.getElementById("trashList");
  trashList.innerHTML = ""; // Clear previous content

  // Display deleted folders
  Object.keys(deletedFolders).forEach((folderName) => {
    const folderItem = document.createElement("div");
    folderItem.classList.add("trash-folder");
    
    folderItem.innerHTML = `
      <span>${folderName}</span>
      <button onclick="restoreFolder('${folderName}')">Restore</button>
      <button onclick="deleteFolderPermanently('${folderName}')">Delete Permanently</button>
    `;
    trashList.appendChild(folderItem);
  });

  // Add "Restore All" button if there are folders in trash
  if (Object.keys(deletedFolders).length > 0) {
    const restoreAllBtn = document.createElement("button");
    restoreAllBtn.textContent = "Restore All";
    restoreAllBtn.onclick = restoreAllFolders;
    trashList.appendChild(restoreAllBtn);
  }

  // Display trash view
  trashView.style.display = "block";
}
// Save note as PDF
function saveNoteAsPDF(noteId) {
  const { jsPDF } = window.jspdf;

  // Find the note by ID
  const note = folders[currentFolder].find((note) => note.id === noteId);
  if (!note) return;

  // Create a new PDF document
  const doc = new jsPDF();

  // Set title and content for the PDF
  doc.setFontSize(18);
  doc.text(note.title || 'Untitled', 10, 10); // Title

  doc.setFontSize(12);
  doc.text(note.content || 'No content available', 10, 20); // Content

  // Save the PDF with the note title as filename
  doc.save(note.title ? `${note.title}.pdf` : 'note.pdf');
}

// Display notes in the current folder
function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const notes = folders[currentFolder];
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${note.title}" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${note.id}" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${note.pinned ? "Unpin" : "Pin"}</button>
      <button class="delete-btn" onclick="removeNote(${note.id})">Delete</button>
      <button class="pdf-btn" onclick="saveNoteAsPDF(${note.id})">Save as PDF</button> <!-- PDF Button -->
    `;
    notesContainer.appendChild(noteElement);
  });
}



// Open Modal
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

// Close Modal
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// Helper function: Save user to localStorage
function saveUser(email, userData) {
  localStorage.setItem(email, JSON.stringify(userData));
}

// Helper function: Retrieve user from localStorage
function getUser(email) {
  return JSON.parse(localStorage.getItem(email));
}

// Register User
function registerUser() {
  const firstName = document.getElementById('register-firstname').value.trim();
  const lastName = document.getElementById('register-lastname').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  if (!firstName || !lastName || !email || !password) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
  }

  if (password.length < 6) {
      Swal.fire('Error', 'Password must be at least 6 characters long', 'error');
      return;
  }

  const existingUser = getUser(email);
  if (existingUser) {
      Swal.fire('Error', 'User already exists. Please log in.', 'error');
      return;
  }

  // Save user details to localStorage
  saveUser(email, { firstName, lastName, email, password });
  Swal.fire('Account created', 'You can now log in!', 'success');
  closeModal('registerModal');
}

// Login User
function loginUser() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
  }

  const storedUser = getUser(email); // Retrieve user from localStorage
  if (!storedUser) {
      Swal.fire('Error', 'User not found. Please register first.', 'error');
      return;
  }

  if (storedUser.password === password) {
      Swal.fire('Logged in', `Welcome back, ${storedUser.firstName}!`, 'success');
      closeModal('loginModal');
  } else {
      Swal.fire('Error', 'Incorrect password. Please try again.', 'error');
  }
}
