document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.querySelector(".login-container");
  const signUp = document.querySelector("#sing-up");
  const submit = document.querySelector("#submit");
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#passwords");
  const rememberCheckbox = document.querySelector("#remember");

  // Show the login container when the "Sign up" button is clicked
  signUp.addEventListener("click", () => {
    loginContainer.style.display = "block";
  });

  // Handle form submission
  submit.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission

    const username = usernameInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberCheckbox.checked;

    if (username && password) {
      // Save the username to localStorage
      localStorage.setItem("username", username);

      // Save password and rememberMe only if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", true);
      } else {
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      alert("Login data saved to localStorage!");
      loginContainer.style.display = "none"; // Hide the login container
    } else {
      alert("Please fill in both fields.");
    }
  });

  // Auto-fill the form if "Remember me" was previously checked
  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");
  const isRemembered = localStorage.getItem("rememberMe") === "true";

  if (savedUsername) usernameInput.value = savedUsername;
  if (isRemembered && savedPassword) passwordInput.value = savedPassword;
  if (isRemembered) rememberCheckbox.checked = true;
});

//////// folder place

// const folderBtn = document.querySelector("#folder");
// const createNew = document.querySelector(".create-new");
// const welcomtNoteTaker = document.querySelector("#welcomt-note-taker");
// const imgOfHomePage = document.querySelector(".img");

// folderBtn.addEventListener("click", () => {
//   if (createNew.style.display === "none" || createNew.style.display === "") {
//     welcomtNoteTaker.style.display = "none";
//     imgOfHomePage.style.display = "none";
//     createNew.style.display = "block";
//   }
// });

// const newNote = document.querySelector("#newnote");
// const partNewNote = document.querySelector(".part-new-note");

// let folderCount = parseInt(localStorage.getItem("folderCount")) || 1;

// newNote.addEventListener("click", () => {
//   if (
//     partNewNote.style.display === "none" ||
//     partNewNote.style.display === ""
//   ) {
//     partNewNote.style.display = "block";
//   }

//   const folderRow = document.createElement("div");
//   folderRow.className = "folder-row";
//   partNewNote.appendChild(folderRow);

//   const checkboxNumber = document.createElement("div");
//   checkboxNumber.className = "checkbox-number";
//   folderRow.appendChild(checkboxNumber);

//   const inputs = document.createElement("input");
//   inputs.setAttribute("type", "checkbox");
//   inputs.className = "folder-checkbox";
//   checkboxNumber.appendChild(inputs);

//   const folderNumber = document.createElement("span");
//   folderNumber.className = "folder-number";
//   folderNumber.textContent = folderCount.toString().padStart(2, "0");
//   checkboxNumber.appendChild(folderNumber);

//   const folderTitle = document.createElement("input");
//   folderTitle.className = "folder-title";
//   folderTitle.setAttribute("type", "text");
//   folderTitle.placeholder = "Enter Title";
//   folderRow.appendChild(folderTitle);

//   const dateTime = document.createElement("div");
//   dateTime.className = "date-time";
//   folderRow.appendChild(dateTime);

//   const currentDate = new Date();
//   const formattedDate = currentDate.toLocaleDateString();
//   const formattedTime = currentDate.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });

//   const folderDate = document.createElement("folder-date");
//   folderDate.className = "folder-date";
//   folderDate.textContent = formattedDate;
//   dateTime.appendChild(folderDate);

//   const anchor = document.createElement("a");
//   anchor.href = '../page/note.html';
//   btnOpen.appendChild(anchor);

//   const folderTime = document.createElement("span");
//   folderTime.className = "folder-time";
//   folderTime.textContent = formattedTime;
//   dateTime.appendChild(folderTime);

//   const btnOpen = document.createElement("button");
//   btnOpen.className = "folder-open-btn";
//   btnOpen.textContent = "open";
//   folderRow.appendChild(btnOpen);

//   folderCount++;
//   localStorage.setItem("folderCount", folderCount);
// });

// const homepage = document.querySelector("#home");

// homepage.addEventListener("click", () => {
//   if (
//     createNew.style.display === "block" &&
//     partNewNote.style.display === "block"
//   ) {
//     welcomtNoteTaker.style.display = "block";
//     imgOfHomePage.style.display = "block";
//     createNew.style.display = "none";
//     partNewNote.style.display = "none";
//   }
// });

// const deleteBtn = document.getElementById("dl-del");

// deleteBtn.addEventListener("click", () => {
//   const checkedCheckboxes = document.querySelectorAll(
//     ".folder-checkbox:checked"
//   );

//   checkedCheckboxes.forEach((checkbox) => {
//     const folderRow = checkbox.closest(".folder-row");
//     folderRow.remove();
//   });

//   const remainingFolders = document.querySelectorAll(".folder-row");
//   remainingFolders.forEach((folderRow, index) => {
//     const folderNumber = folderRow.querySelector(".folder-number");
//     folderNumber.textContent = (index + 1).toString().padStart(2, "0");
//   });

//   folderCount = remainingFolders.length + 1;
//   localStorage.setItem("folderCount", folderCount);
// });

// const folderOpenBtn = document.querySelectorAll(".folder-open-btn");


document.addEventListener("DOMContentLoaded", () => {
  // Login Section
  const loginContainer = document.querySelector(".login-container");
  const signUp = document.querySelector("#sing-up");
  const submit = document.querySelector("#submit");
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#passwords");
  const rememberCheckbox = document.querySelector("#remember");

  // Show the login container when the "Sign up" button is clicked
  signUp.addEventListener("click", () => {
    loginContainer.style.display = "block";
  });

  // Handle form submission
  submit.addEventListener("click", (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberCheckbox.checked;

    if (username && password) {
      localStorage.setItem("username", username);

      if (rememberMe) {
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", true);
      } else {
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      alert("Login data saved to localStorage!");
      loginContainer.style.display = "none";
    } else {
      alert("Please fill in both fields.");
    }
  });

  // Auto-fill login form if saved data exists
  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");
  const isRemembered = localStorage.getItem("rememberMe") === "true";

  if (savedUsername) usernameInput.value = savedUsername;
  if (isRemembered && savedPassword) passwordInput.value = savedPassword;
  if (isRemembered) rememberCheckbox.checked = true;

  // Folder Management
  const folderBtn = document.querySelector("#folder");
  const createNew = document.querySelector(".create-new");
  const welcomtNoteTaker = document.querySelector("#welcomt-note-taker");
  const imgOfHomePage = document.querySelector(".img");

  folderBtn.addEventListener("click", () => {
    if (createNew.style.display === "none" || createNew.style.display === "") {
      welcomtNoteTaker.style.display = "none";
      imgOfHomePage.style.display = "none";
      createNew.style.display = "block";
    }
  });

  const newNote = document.querySelector("#newnote");
  const partNewNote = document.querySelector(".part-new-note");
  let folderCount = parseInt(localStorage.getItem("folderCount")) || 1;

  newNote.addEventListener("click", () => {
    if (partNewNote.style.display === "none" || partNewNote.style.display === "") {
      partNewNote.style.display = "block";
    }

    const folderRow = document.createElement("div");
    folderRow.className = "folder-row";
    partNewNote.appendChild(folderRow);

    const checkboxNumber = document.createElement("div");
    checkboxNumber.className = "checkbox-number";
    folderRow.appendChild(checkboxNumber);

    const inputs = document.createElement("input");
    inputs.setAttribute("type", "checkbox");
    inputs.className = "folder-checkbox";
    checkboxNumber.appendChild(inputs);

    const folderNumber = document.createElement("span");
    folderNumber.className = "folder-number";
    folderNumber.textContent = folderCount.toString().padStart(2, "0");
    checkboxNumber.appendChild(folderNumber);

    const folderTitle = document.createElement("input");
    folderTitle.className = "folder-title";
    folderTitle.setAttribute("type", "text");
    folderTitle.placeholder = "Enter Title";
    folderRow.appendChild(folderTitle);

    const dateTime = document.createElement("div");
    dateTime.className = "date-time";
    folderRow.appendChild(dateTime);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const folderDate = document.createElement("span");
    folderDate.className = "folder-date";
    folderDate.textContent = formattedDate;
    dateTime.appendChild(folderDate);

    const folderTime = document.createElement("span");
    folderTime.className = "folder-time";
    folderTime.textContent = formattedTime;
    dateTime.appendChild(folderTime);

    const btnOpen = document.createElement("button");
    btnOpen.className = "folder-open-btn";

    const anchor = document.createElement("a");
    anchor.href = '../page/note.html';
    anchor.textContent = "open";
    btnOpen.appendChild(anchor);

    folderRow.appendChild(btnOpen);

    folderCount++;
    localStorage.setItem("folderCount", folderCount);
  });

  const homepage = document.querySelector("#home");
  homepage.addEventListener("click", () => {
    if (createNew.style.display === "block" && partNewNote.style.display === "block") {
      welcomtNoteTaker.style.display = "block";
      imgOfHomePage.style.display = "block";
      createNew.style.display = "none";
      partNewNote.style.display = "none";
    }
  });

  const deleteBtn = document.getElementById("dl-del");
  deleteBtn.addEventListener("click", () => {
    const checkedCheckboxes = document.querySelectorAll(".folder-checkbox:checked");

    checkedCheckboxes.forEach((checkbox) => {
      const folderRow = checkbox.closest(".folder-row");
      folderRow.remove();
    });

    const remainingFolders = document.querySelectorAll(".folder-row");
    remainingFolders.forEach((folderRow, index) => {
      const folderNumber = folderRow.querySelector(".folder-number");
      folderNumber.textContent = (index + 1).toString().padStart(2, "0");
    });

    folderCount = remainingFolders.length + 1;
    localStorage.setItem("folderCount", folderCount);
  });
});
