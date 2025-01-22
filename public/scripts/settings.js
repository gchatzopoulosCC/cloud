let changePassword = () => {
  let oldPassword = document.getElementById("old-password").value;
  let newPassword = document.getElementById("password").value;
  let oldPasswordError = document.getElementById("old-password-error");
  let newPasswordError = document.getElementById("password-error");

  if (!validatePassword(oldPassword)) {
    oldPasswordError.innerHTML = "Password must be at least 8 characters";
    return;
  } else {
    oldPasswordError.innerHTML = "";
  }

  if (!validatePassword(newPassword)) {
    newPasswordError.innerHTML = "Password must be at least 8 characters";
    return;
  } else {
    newPasswordError.innerHTML = "";
  }

  if (oldPassword === newPassword) {
    newPasswordError.innerHTML =
      "New password must be different from old password";
    return;
  }

  let userId = JSON.parse(sessionStorage.getItem("user")).id;

  fetch(`http://localhost:3000/api/user/${userId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword,
    }),
  }).then((res) => {
    if (res.status === 204) {
      logout();
    } else {
      oldPasswordError.innerHTML = "Old password is incorrect";
    }
  });
};

let validatePassword = (password) => {
  return password.length >= 8;
};

let changeEmail = () => {
  let oldEmail = document.getElementById("old-email").value;
  let oldEmailError = document.getElementById("old-email-error");
  let newEmail = document.getElementById("email").value;
  let newEmailError = document.getElementById("email-error");

  if (!validateEmail(oldEmail)) {
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

  if (oldEmail === newEmail) {
    newEmailError.innerHTML = "New email must be different from old email";
    return;
  }

  let userId = JSON.parse(sessionStorage.getItem("user")).id;

  fetch(`http://localhost:3000/api/user/${userId}/email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oldEmail: oldEmail,
      email: newEmail,
    }),
  }).then((res) => {
    if (res.status === 204) {
      logout();
    } else {
      oldEmailError.innerHTML = "Please enter a valid email";
    }
  });
};

let validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

let deleteAccount = () => {
  let confirm = document.getElementById("delete-input").value;

  if (confirm !== "DELETE") {
    return;
  }

  let userId = JSON.parse(sessionStorage.getItem("user")).id;

  fetch(`http://localhost:3000/api/user/${userId}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.status === 204) {
      logout();
    }
  });
};

let logout = async () => {
  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    sessionStorage.removeItem("isLogged");
    sessionStorage.removeItem("user");
    window.top.location.reload();
  } catch (error) {
    console.log(error);
  }
};
