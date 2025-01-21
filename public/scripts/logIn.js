let logIn = async () => {
  let emailElement = document.getElementById("email");
  let emailErrorElement = document.getElementById("email-error");
  let passwordElement = document.getElementById("password");
  let passwordErrorElement = document.getElementById("password-error");
  let submitElement = document.getElementById("submit");

  let email = emailElement.value.trim();
  let password = passwordElement.value.trim();

  // Reset errors
  emailErrorElement.textContent = "";
  passwordErrorElement.textContent = "";

  // Validate input
  if (!validateEmail(email)) {
    emailErrorElement.textContent = "Please enter a valid email";
    return;
  }
  if (!validatePassword(password)) {
    passwordErrorElement.textContent = "Password must be at least 6 characters";
    return;
  }

  // Disable button to prevent multiple submissions
  submitElement.disabled = true;

  // Send login request
  try {
    await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => {
      if (res.status === 200) {
        window.location.href = "file-manager.html";
        sessionStorage.setItem("isLogged", "true");
      } else {
        return res.json().then((data) => {
          throw new Error(data.message || "Login failed");
        });
      }
      console.log(res);
      window.location.href = "sign-in.html";
    });
  } catch (error) {
    passwordErrorElement.textContent = "An error occurred. Please try again.";
  } finally {
    submitElement.disabled = false; // Re-enable button
  }
};

let register = async () => {
  let emailElement = document.getElementById("email");
  let emailErrorElement = document.getElementById("email-error");
  let passwordElement = document.getElementById("password");
  let passwordErrorElement = document.getElementById("password-error");
  let checkboxElement = document.getElementById("checkbox");
  let checkboxErrorElement = document.getElementById("checkbox-error");
  let submitElement = document.getElementById("submit");

  let email = emailElement.value;
  let password = passwordElement.value;
  if (!validateEmail(email)) {
    emailErrorElement.innerHTML = "Please enter a valid email";
    return;
  } else {
    emailErrorElement.innerHTML = "";
  }
  if (!validatePassword(password)) {
    passwordErrorElement.innerHTML = "Password must be at least 6 characters";
    return;
  } else {
    passwordErrorElement.innerHTML = "";
  }

  if (!checkboxElement.checked) {
    checkboxErrorElement.innerHTML = "Please agree to terms and conditions";
    return;
  } else {
    checkboxErrorElement.innerHTML = "";
  }

  submitElement.disabled = true;

  await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "test", email, password, plan: "free" }),
  }).then((res) => {
    // Validate the response
    if (res.status !== 201) {
      console.log(res);
      window.location.href = "register.html";
    } else {
      // Store email and password in session storage
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("password", password);
      // Redirect to the plans page
      window.location.href = "plans.html";
    }
  });
};

let validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

let validatePassword = (password) => {
  return password.length >= 8;
};

let choosePlan = (plan) => {
  let buttons = document.getElementsByClassName("btn-submit");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
  const email = sessionStorage.getItem("email");
  const password = sessionStorage.getItem("password");

  fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "name", email, password, plan }),
  }).then((res) => {
    if (res.status === 201) {
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("password");
      window.location.href = "sign-in.html";
      sessionStorage.setItem("isLogged", "true");
    } else {
      window.location.href = "register.html";
    }
  });
};
