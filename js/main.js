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
  folderListDropdown.style.display =
    folderListDropdown.style.display === "block" ? "none" : "block";
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
    deleteBtn.innerHTML.textContent = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteFolder(folderName);
    };

    folderItem.appendChild(deleteBtn);
    foldersList.appendChild(folderItem);
  });
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

    // Rename button
    const renameBtn = document.createElement("button");
    renameBtn.classList.add("rename");
    renameBtn.textContent = "Rename";
    renameBtn.onclick = (e) => {
      e.stopPropagation();
      renameFolder(folderName);
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteFolder(folderName);
    };

    folderItem.appendChild(renameBtn);
    folderItem.appendChild(deleteBtn);
    foldersList.appendChild(folderItem);
  });
}

// Rename a folder with SweetAlert2
function renameFolder(oldName) {
  if (oldName === "Default") {
    Swal.fire("Error", "You cannot rename the Default folder.", "error");
    return;
  }

  Swal.fire({
    title: "Enter new folder name",
    input: "text",
    inputValue: oldName,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || value.trim() === "") {
        return "Please enter a valid folder name.";
      }
      if (folders[value]) {
        return "Folder name already exists!";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const newName = result.value.trim();
      // Rename folder
      folders[newName] = folders[oldName];
      delete folders[oldName];

      // Update current folder if it is being renamed
      if (currentFolder === oldName) {
        currentFolder = newName;
      }

      saveFolders();
      displayFolders();
      displayNotes();

      Swal.fire("Success", `Folder renamed to ${newName}`, "success");
    }
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
  folders[currentFolder] = folders[currentFolder].filter(
    (note) => note.id !== id
  );
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
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNote(${
        note.id
      })">Delete</button>
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
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNote(${
        note.id
      })">Delete</button>
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

// Delete a folder with SweetAlert2
function deleteFolder(folderName) {
  if (folderName === "Default") {
    Swal.fire("Error", "You cannot delete the Default folder.", "error");
    return;
  }

  Swal.fire({
    title: `Are you sure you want to delete the folder "${folderName}"?`,
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "No, cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      deletedFolders[folderName] = folders[folderName]; // Move to trash
      delete folders[folderName]; // Delete the folder
      saveFolders();
      displayFolders();
      if (folderName === currentFolder) {
        currentFolder = "Default";
        displayNotes();
      }
      Swal.fire(
        "Deleted",
        `Folder "${folderName}" has been moved to trash.`,
        "success"
      );
    }
  });
}

/** -------- Pinned Notes Management -------- **/

// View all pinned notes across folders
function viewPinnedNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const pinnedNotes = [];
  Object.keys(folders).forEach((folderName) => {
    folders[folderName].forEach((note) => {
      if (note.pinned) {
        pinnedNotes.push({ ...note, folderName }); // Include folderName for reference
      }
    });
  });

  if (pinnedNotes.length === 0) {
    notesContainer.innerHTML = "<p>No pinned notes available.</p>";
    return;
  }

  pinnedNotes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    noteElement.innerHTML = `
      <div class="note-meta">
        <span class="note-folder">(Folder: ${note.folderName})</span>
      </div>
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNoteFromPinned(${note.id}, '${
      note.folderName
    }')">Delete</button>
      <button class="pdf-btn" onclick="saveNoteAsPDF(${
        note.id
      })">Save as PDF</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

// Remove note from pinned view (delete from folder)
function removeNoteFromPinned(noteId, folderName) {
  folders[folderName] = folders[folderName].filter(
    (note) => note.id !== noteId
  );
  saveFolders();
  viewPinnedNotes();
}

/** -------- Updated Pin Toggle -------- **/

function togglePin(id) {
  let noteFound = false;

  // Find the note in the current folder or across all folders
  Object.keys(folders).forEach((folderName) => {
    folders[folderName].forEach((note) => {
      if (note.id === id) {
        note.pinned = !note.pinned;
        noteFound = true;
      }
    });
  });

  if (noteFound) {
    saveFolders();
    displayNotes();
  } else {
    console.error("Note not found:", id);
  }
}

// Save folders and deleted folders to localStorage (with styles)
function saveFolders() {
  localStorage.setItem("folders", JSON.stringify(folders));
  localStorage.setItem("deletedFolders", JSON.stringify(deletedFolders));
  console.log("Folders and deleted folders saved to localStorage.");
}

// Add a new note with style data (font color, size, etc.)
function addNote() {
  const newNote = {
    id: Date.now(),
    title: "",
    content: "",
    pinned: false,
    fontColor: "#000000", // Default color (black)
    fontSize: "16px", // Default font size
    fontFamily: "Arial", // Default font family
    bold: false, // Default bold
    italic: false, // Default italic
    underline: false, // Default underline
  };
  folders[currentFolder].push(newNote);
  saveFolders(); // Save data after adding note
  displayNotes();
}

// Edit note content and styles
function editNoteContent(id) {
  const note = folders[currentFolder].find((note) => note.id === id);
  if (note) {
    const noteElement = document.getElementById(`note-${id}`);
    note.content = noteElement.innerHTML; // Save the content

    // Save the note's styles
    note.fontColor = noteElement.style.color || "#000000";
    note.fontSize = noteElement.style.fontSize || "16px";
    note.fontFamily = noteElement.style.fontFamily || "Arial";
    note.bold = noteElement.style.fontWeight === "bold";
    note.italic = noteElement.style.fontStyle === "italic";
    note.underline = noteElement.style.textDecoration === "underline";

    saveFolders(); // Save data after editing content or styles
  } else {
    console.error("Note not found:", id);
  }
}

// Function to apply styles when rendering the notes
function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const notes = folders[currentFolder];
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    // Apply stored styles to the note
    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" style="color: ${note.fontColor}; font-size: ${
      note.fontSize
    }; font-family: ${note.fontFamily}; text-decoration: ${
      note.underline ? "underline" : "none"
    }; font-weight: ${note.bold ? "bold" : "normal"}; font-style: ${
      note.italic ? "italic" : "normal"
    }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNote(${
        note.id
      })">Delete</button>
      <button class="style-btn" onclick="editNoteStyles(${
        note.id
      })">Edit Styles</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}

function editNoteStyles(id) {
  const note = folders[currentFolder].find((note) => note.id === id);
  if (note) {
    Swal.fire({
      title: "<strong>Edit Note Styles</strong>",
      html: `
        <div style="text-align: left; font-size: 14px;">
          <label for="fontColor" style="display: block; margin-bottom: 5px;">Font Color:</label>
          <input id="fontColor" type="color" value="${
            note.fontColor || "#000000"
          }" style="width: 100%;"><br><br>
          
          <label for="fontSize" style="display: block; margin-bottom: 5px;">Font Size:</label>
          <input id="fontSize" type="number" value="${
            parseInt(note.fontSize, 10) || 14
          }" style="width: 60px;"> px<br><br>
          
          <label for="fontFamily" style="display: block; margin-bottom: 5px;">Font Family:</label>
          <select id="fontFamily" style="width: 100%; padding: 5px;">
            <option value="Arial" ${
              note.fontFamily === "Arial" ? "selected" : ""
            }>Arial</option>
            <option value="Georgia" ${
              note.fontFamily === "Georgia" ? "selected" : ""
            }>Georgia</option>
            <option value="Times New Roman" ${
              note.fontFamily === "Times New Roman" ? "selected" : ""
            }>Times New Roman</option>
            <option value="Verdana" ${
              note.fontFamily === "Verdana" ? "selected" : ""
            }>Verdana</option>
          </select><br><br>
          
          <label style="display: block; margin-bottom: 10px;">Text Style:</label>
          <div style="display: flex; gap: 10px;">
            <label><input id="bold" type="checkbox" ${
              note.bold ? "checked" : ""
            }> <strong>Bold</strong></label>
            <label><input id="italic" type="checkbox" ${
              note.italic ? "checked" : ""
            }> <em>Italic</em></label>
            <label><input id="underline" type="checkbox" ${
              note.underline ? "checked" : ""
            }> <u>Underline</u></label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      focusConfirm: false,
      preConfirm: () => {
        return {
          fontColor: document.getElementById("fontColor").value,
          fontSize: `${document.getElementById("fontSize").value}px`,
          fontFamily: document.getElementById("fontFamily").value,
          bold: document.getElementById("bold").checked,
          italic: document.getElementById("italic").checked,
          underline: document.getElementById("underline").checked,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Update the note's styles with the new values
        const styles = result.value;
        note.fontColor = styles.fontColor;
        note.fontSize = styles.fontSize;
        note.fontFamily = styles.fontFamily;
        note.bold = styles.bold;
        note.italic = styles.italic;
        note.underline = styles.underline;

        saveFolders(); // Save data after style change
        displayNotes(); // Re-render notes with updated styles
      }
    });
  } else {
    console.error("Note not found:", id);
  }
}

// Save note as a PDF
function saveNoteAsPDF(id) {
  const note = folders[currentFolder].find((note) => note.id === id);
  if (note) {
    const { jsPDF } = window.jspdf; // Access jsPDF from the global window object
    const pdf = new jsPDF();

    // Extract title and plain text content
    const title = note.title || "Untitled Note";
    const content =
      note.content.replace(/<\/?[^>]+(>|$)/g, "") || "No content available."; // Strip HTML tags

    // Add title to PDF
    pdf.setFontSize(16);
    pdf.text(title, 10, 10);

    // Add plain text content to PDF
    pdf.setFontSize(12);
    const pageWidth = pdf.internal.pageSize.width;
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const contentLines = pdf.splitTextToSize(content, maxWidth);
    pdf.text(contentLines, margin, 20);

    // Save the PDF file
    pdf.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
  } else {
    console.error("Note not found:", id);
  }
}
function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  const notes = folders[currentFolder];
  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");

    // Apply stored styles to the note
    noteElement.innerHTML = `
      <input type="text" class="note-title" value="${
        note.title
      }" placeholder="Title" oninput="editNoteTitle(${note.id}, event)">
      <div class="note-content" contenteditable="true" id="note-${
        note.id
      }" style="color: ${note.fontColor}; font-size: ${
      note.fontSize
    }; font-family: ${note.fontFamily}; text-decoration: ${
      note.underline ? "underline" : "none"
    }; font-weight: ${note.bold ? "bold" : "normal"}; font-style: ${
      note.italic ? "italic" : "normal"
    }" oninput="editNoteContent(${note.id})">${note.content}</div>
      <button class="pin-btn" onclick="togglePin(${note.id})">${
      note.pinned ? "Unpin" : "Pin"
    }</button>
      <button class="delete-btn" onclick="removeNote(${
        note.id
      })">Delete</button>
      <button class="style-btn" onclick="editNoteStyles(${
        note.id
      })">Edit Styles</button>
      <button class="pdf-btn" onclick="saveNoteAsPDF(${
        note.id
      })">Save as PDF</button>
    `;
    notesContainer.appendChild(noteElement);
  });
}
