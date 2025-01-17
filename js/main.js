// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzrj6bCN4WSslr7XzOrbtQsmnnB-GTrS4",
  authDomain: "note-taker-8039e.firebaseapp.com",
  databaseURL: "https://note-taker-8039e-default-rtdb.firebaseio.com",
  projectId: "note-taker-8039e",
  storageBucket: "note-taker-8039e.firebasestorage.app",
  messagingSenderId: "810265620163",
  appId: "1:810265620163:web:adcadcf960dd4f2cc57c76",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Database-related functions
function initializeDatabaseFunctions() {
  const button = document.querySelector("#button");
  const formContainer = document.querySelector(".form-container");
  const btn = document.querySelector(".submit-btn");

  // Show form on button click
  button.addEventListener("click", () => {
    formContainer.style.display = "block";
  });

  // Handle form submission and save data to Firebase
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    saveUserData(firstName, lastName, email, password);

    formContainer.style.display = "none";
  });
}

function saveUserData(firstName, lastName, email, password) {
  const userRef = ref(db, "users/" + email.replace(".", "_"));

  set(userRef, {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  })
    .then(() => {
      // Using SweetAlert for success
      Swal.fire({
        icon: "success",
        title: "User data saved successfully!",
        text: "The user data has been successfully stored in the database.",
      });
    })
    .catch((error) => {
      // Using SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error saving data",
        text: "Failed to save data. Please try again.",
      });
    });
}

// Login-related functions
function initializeLoginFunctions() {
  const loginContainer = document.querySelector(".login-container");
  const signUpButton = document.querySelector("#sing-up");
  const submitButton = document.querySelector("#submit");
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#passwords");
  const rememberCheckbox = document.querySelector("#remember");

  // Show login container on "Sign up" button click
  signUpButton.addEventListener("click", () => {
    loginContainer.style.display = "block";
  });

  // Handle login form submission
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim(); // Trim to remove leading/trailing whitespace
    const password = passwordInput.value.trim(); // Trim to remove leading/trailing whitespace
    const rememberMe = rememberCheckbox.checked;

    // Ensure both username and password are not empty
    if (username === "" || password === "") {
      // Using SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Please fill in both fields.",
        text: "Make sure both the username and password are filled.",
      });
    } else {
      saveLoginDataToLocalStorage(username, password, rememberMe);
      // Using SweetAlert for success
      Swal.fire({
        icon: "success",
        title: "Login data saved!",
        text: "Login data has been saved to localStorage.",
      });
      loginContainer.style.display = "none";
    }
  });

  autoFillLoginForm(usernameInput, passwordInput, rememberCheckbox);
}

function saveLoginDataToLocalStorage(username, password, rememberMe) {
  localStorage.setItem("username", username);

  if (rememberMe) {
    localStorage.setItem("password", password);
    localStorage.setItem("rememberMe", true);
  } else {
    localStorage.removeItem("password");
    localStorage.removeItem("rememberMe");
  }
}

function autoFillLoginForm(usernameInput, passwordInput, rememberCheckbox) {
  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");
  const isRemembered = localStorage.getItem("rememberMe") === "true";

  if (savedUsername) usernameInput.value = savedUsername;
  if (isRemembered && savedPassword) passwordInput.value = savedPassword;
  if (isRemembered) rememberCheckbox.checked = true;
}

// Initialize all functions
initializeDatabaseFunctions();
document.addEventListener("DOMContentLoaded", initializeLoginFunctions);
