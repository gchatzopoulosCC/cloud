let logIn = () => {
  let emailElement = document.getElementById('email');
  let emailErrorElement = document.getElementById('email-error');
  let passwordElement = document.getElementById('password');
  let passwordErrorElement = document.getElementById('password-error');
  let submitElement = document.getElementById('submit');

  let email = emailElement.value;
  let password = passwordElement.value;
  if (!validateEmail(email)) {
    emailErrorElement.innerHTML = 'Please enter a valid email';
    return;
  } else {
    emailErrorElement.innerHTML = '';
  }
  if (!validatePassword(password)) {
    passwordErrorElement.innerHTML = 'Password must be at least 6 characters';
    return;
  } else {
    passwordErrorElement.innerHTML = '';
  }

  submitElement.disabled = true;

  fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    if (res.status === 201) {
      window.location.href = 'file-manager.html';
      sessionStorage.setItem('isLogged', 'true');
    } else {
    }
  });

  console.log(res);
  window.location.href = 'file-manager.html';
  console.log(email, password);
};

let register = async () => {
  let emailElement = document.getElementById('email');
  let emailErrorElement = document.getElementById('email-error');
  let passwordElement = document.getElementById('password');
  let passwordErrorElement = document.getElementById('password-error');
  let checkboxElement = document.getElementById('checkbox');
  let checkboxErrorElement = document.getElementById('checkbox-error');
  let submitElement = document.getElementById('submit');

  let email = emailElement.value;
  let password = passwordElement.value;
  if (!validateEmail(email)) {
    emailErrorElement.innerHTML = 'Please enter a valid email';
    return;
  } else {
    emailErrorElement.innerHTML = '';
  }
  if (!validatePassword(password)) {
    passwordErrorElement.innerHTML = 'Password must be at least 6 characters';
    return;
  } else {
    passwordErrorElement.innerHTML = '';
  }

  if (!checkboxElement.checked) {
    checkboxErrorElement.innerHTML = 'Please agree to terms and conditions';
    return;
  } else {
    checkboxErrorElement.innerHTML = '';
  }

  submitElement.disabled = true;

  await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'test', email, password, plan: 'free' }),
  }).then((res) => {
    // Validate the response
    if (res.status !== 201) {
      console.log(res);
      window.location.href = 'register.html';
    }

    // Redirect to the plans page
    window.location.href = 'plans.html';
  });
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
  let buttons = document.getElementsByClassName('btn-submit');
  if (plan === 'free') {
    let email = sessionStorage.getItem('email');
    let password = sessionStorage.getItem('password');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    console.log(email, password, plan);
    window.location.href = 'file-manager.html';
    sessionStorage.setItem('isLogged', 'true');
  } else if (plan === 'premium') {
    let email = sessionStorage.getItem('email');
    let password = sessionStorage.getItem('password');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('password');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'name', email, password, plan }),
    }).then((res) => {
      if (res.status === 201) {
        window.location.href = 'sign-in.html';
        sessionStorage.setItem('isLogged', 'true');
      } else {
        console.log(res);
        window.location.href = 'register.html';
      }
    });
    // .then(() => {
    //   window.location.href = "file-manager.html";
    //   sessionStorage.setItem("isLogged", "true");
    // });
    // sessionStorage.setItem("isLogged", "true");

    console.log(email, password, plan);

    // window.location.href = "file-manager.html";
  }
};

fetch('http://localhost:3000/api/file', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
