document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.querySelector('.login-container');
    const signUp = document.querySelector('#sing-up');
    const submit = document.querySelector('#submit');
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#passwords');
    const rememberCheckbox = document.querySelector('#remember');

    // Show the login container when the "Sign up" button is clicked
    signUp.addEventListener('click', () => {
        loginContainer.style.display = 'block';
    });

    // Handle form submission
    submit.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission

        const username = usernameInput.value;
        const password = passwordInput.value;
        const rememberMe = rememberCheckbox.checked;

        if (username && password) {
            // Save the username to localStorage
            localStorage.setItem('username', username);

            // Save password and rememberMe only if "Remember me" is checked
            if (rememberMe) {
                localStorage.setItem('password', password);
                localStorage.setItem('rememberMe', true);
            } else {
                localStorage.removeItem('password');
                localStorage.removeItem('rememberMe');
            }

            alert('Login data saved to localStorage!');
            loginContainer.style.display = 'none'; // Hide the login container
        } else {
            alert('Please fill in both fields.');
        }
    });

    // Auto-fill the form if "Remember me" was previously checked
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const isRemembered = localStorage.getItem('rememberMe') === 'true';

    if (savedUsername) usernameInput.value = savedUsername;
    if (isRemembered && savedPassword) passwordInput.value = savedPassword;
    if (isRemembered) rememberCheckbox.checked = true;
});
