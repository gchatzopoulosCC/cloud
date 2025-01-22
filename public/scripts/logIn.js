const logIn = async () => {
  const emailElement = document.getElementById("email");
  const emailErrorElement = document.getElementById("email-error");
  const passwordElement = document.getElementById("password");
  const passwordErrorElement = document.getElementById("password-error");
  const submitElement = document.getElementById("submit");

  const email = emailElement.value.trim();
  const password = passwordElement.value.trim();

  // Reset errors
  emailErrorElement.textContent = "";
  passwordErrorElement.textContent = "";

  // Validate input
  if (!validateEmail(email)) {
    emailErrorElement.textContent = "Please enter a valid email";
    return;
  }
  if (!validatePassword(password)) {
    passwordErrorElement.textContent = "Password must be at least 8 characters";
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
      res.json().then((data) => {
        if (res.status === 200 || res.status === 201) {
          console.log(data);
          sessionStorage.setItem("user", JSON.stringify(data.user));
          sessionStorage.setItem("isLogged", "true");
          window.location.href = "file-manager.html";
        } else {
          passwordErrorElement.textContent = data.message.password;
          emailErrorElement.textContent = data.message.email;
          submitElement.disabled = false; // Re-enable button
        }
      });
    });
  } catch (error) {
    passwordErrorElement.textContent = "An error occurred. Please try again.";
  } finally {
    submitElement.disabled = false; // Re-enable button
  }
};

const register = async () => {
  const emailElement = document.getElementById("email");
  const emailErrorElement = document.getElementById("email-error");
  const passwordElement = document.getElementById("password");
  const passwordErrorElement = document.getElementById("password-error");
  const checkboxElement = document.getElementById("checkbox");
  const checkboxErrorElement = document.getElementById("checkbox-error");
  const submitElement = document.getElementById("submit");

  const email = emailElement.value;
  const password = passwordElement.value;
  if (!validateEmail(email)) {
    emailErrorElement.innerHTML = "Please enter a valid email";
    return;
  } else {
    emailErrorElement.innerHTML = "";
  }
  if (!validatePassword(password)) {
    passwordErrorElement.innerHTML = "Password must be at least 8 characters";
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
  }).then(async (res) => {
    // Validate the response
    if (res.status !== 201) {
      res.json().then((data) => {
        emailErrorElement.innerText = data.message.email;
        passwordErrorElement.innerText = data.message.password;
        submitElement.disabled = false;
      });
    } else {
      // Redirect to the plans page
      await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then((res) =>
        res
          .json()
          .then((data) => {
            if (res.status === 200 || res.status === 201) {
              sessionStorage.setItem("user", JSON.stringify(data.user));
              window.location.href = "plans.html";
            } else {
              return res.json().then((data) => {
                throw new Error(data.message || "Login failed");
              });
            }
          })
          .catch((error) => {
            console.log(error);
          })
      );
    }
  });
};

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const choosePlan = (plan) => {
  const buttons = document.getElementsByClassName("btn-submit");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user.id;
  const email = user.email;
  const password = user.password;

  fetch(`http://localhost:3000/api/user/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "name", email, password, plan }),
  }).then((res) => {
    if (res.status === 204) {
      sessionStorage.setItem("isLogged", "true");
      window.location.href = "file-manager.html";
    } else {
      window.location.href = "sign-in.html";
    }
  });
};
