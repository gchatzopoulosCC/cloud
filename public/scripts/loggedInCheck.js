let isLogged = sessionStorage.getItem("isLogged");
if (isLogged === "true") {
  window.location.href = "file-manager.html";
}
