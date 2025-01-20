let logIn = () => {
  let emailElement = document.getElementById("email");
  let emailErrorElement = document.getElementById("email-error");
  let passwordElement = document.getElementById("password");
  let passwordErrorElement = document.getElementById("password-error");
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

  submitElement.disabled = true;
  console.log(email, password);
};

let register = () => {
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
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("password", password);
  window.location.href = "plans.html";
};

let validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

let validatePassword = (password) => {
  return password.length >= 6;
};

let choosePlan = (plan) => {
  let buttons = document.getElementsByClassName("btn-submit");
  if (plan === "free") {
    let email = sessionStorage.getItem("email");
    let password = sessionStorage.getItem("password");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    console.log(email, password, plan);

    window.location.href = "file-manager.html";
    sessionStorage.setItem("isLogged", "true");
  } else if (plan === "premium") {
    let email = sessionStorage.getItem("email");
    let password = sessionStorage.getItem("password");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("password");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    console.log(email, password, plan);

    window.location.href = "file-manager.html";
    sessionStorage.setItem("isLogged", "true");
  }
};
