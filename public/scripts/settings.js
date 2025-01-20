let changePassword = () => {
  let oldPassword = document.getElementById("old-password").value;
  let newPassword = document.getElementById("password").value;
  let oldPasswordError = document.getElementById("old-password-error");
  let newPasswordError = document.getElementById("password-error");

  if (!validateOldPassword(oldPassword)) {
    oldPasswordError.innerHTML = "Please enter a valid password";
    return;
  } else {
    oldPasswordError.innerHTML = "";
  }

  if (!validatePassword(newPassword)) {
    newPasswordError.innerHTML = "Password must be at least 6 characters";
    return;
  } else {
    newPasswordError.innerHTML = "";
  }
};

let validatePassword = (password) => {
  return password.length >= 6;
};

let validateOldPassword = (password) => {
  // TODO
  return true;
};

let changeEmail = () => {
  let oldEmail = document.getElementById("old-email").value;
  let oldEmailError = document.getElementById("old-email-error");
  let newEmail = document.getElementById("email").value;
  let newEmailError = document.getElementById("email-error");

  if (!validateOldEmail(oldEmail)) {
    oldEmailError.innerHTML = "Please enter a valid email";
    return;
  } else {
    oldEmailError.innerHTML = "";
  }

  if (!validateEmail(newEmail)) {
    newEmailError.innerHTML = "Please enter a valid email";
    return;
  } else {
    newEmailError.innerHTML = "";
  }
};

let validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

let validateOldEmail = (email) => {
  // TODO
  return true;
};
