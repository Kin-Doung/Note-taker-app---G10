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
  Swal.fire({
      title: 'Registration Successful!',
      text: `Welcome, ${firstName}!`,
      icon: 'success',
      confirmButtonText: 'Proceed'
  }).then(() => {
      // Redirect to the dashboard page
      window.location.href = "/pages/note.html";
  });
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
      Swal.fire('Logged in', `Welcome back, ${storedUser.firstName}!`, 'success').then(() => {
          // Redirect to the dashboard page or other functionality
          window.location.href = "/pages/note.html";
      });
      closeModal('loginModal');
  } else {
      Swal.fire('Error', 'Incorrect password. Please try again.', 'error');
  }
}
