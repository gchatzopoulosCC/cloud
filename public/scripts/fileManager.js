let files = [];
let file =
  '<div class="main_section_file" data-id="{id}"> <div class="file_name"> <img src="../assets/icons/file.svg" alt="file" class="file_icon" /> <p class="file_name_text">{filename}</p> <span class="file_error"></span> </div> <div class="file_extension"> <p class="file_extension_text">{type}</p> </div> <div class="file_options"> <img onclick="downloadFile(event)" src="../assets/icons/download.svg" alt="download" class="file_option" /><img src="../assets/icons/edit.svg" alt="edit" class="file_option" onclick="editFile(event)" /><img src="../assets/icons/delete.svg" alt="delete" class="file_option" onclick="deleteFile(event)" /> </div></div>';

let search = () => {
  let input = document
    .getElementsByClassName("search_input")[0]
    .value.toLowerCase();
  let files = document.getElementsByClassName("main_section_file");
  for (let i = 0; i < files.length; i++) {
    if (
      files[i].children[0].children[1].innerText.toLowerCase().includes(input)
    ) {
      files[i].style.display = "flex";
    } else {
      files[i].style.display = "none";
    }
  }
};

clearSearch = () => {
  let input = document.getElementsByClassName("search_input")[0];
  input.value = "";
  search();
};

const openUpload = () => {
  let uploadHTML =
    '<div class="load-file" id="load-file_container"> <div class="load-file__wrapper"> <div class="load-file_input"> <p class="load-file_error" id="load-file_name-error"></p> </div> <div class="load-file_input"> <input type="file" id="load-file" class="load-file_file" /> <p class="load-file_error" id="load-file_file-error"></p> </div> <button class="btn btn-light btn-upload" id="load-file_upload">Upload</button> </div></div>';
  let upload = document.createElement("div");
  let temp = document.createElement("div");
  temp.innerHTML = uploadHTML;
  upload = temp.children[0];
  upload.addEventListener("mousedown", (e) => {
    if (e.target !== upload) return;
    upload.remove();
  });
  upload
    .getElementsByClassName("btn-upload")[0]
    .addEventListener("click", () => {
      uploadFile();
    });
  document.getElementById("main__wrapper").appendChild(upload);
};

const uploadFile = () => {
  let file = document.getElementById("load-file").files[0];
  if (!file) {
    document.getElementById("load-file_file-error").innerText =
      "Please select a file";
    return;
  } else {
    document.getElementById("load-file_file-error").innerText = "";
  }

  document.getElementById("load-file_upload").disabled = true;

  let userId = JSON.parse(sessionStorage.getItem("user")).id;

  let formData = new FormData();
  formData.append("userId", userId);
  formData.append("file", file);

  fetch("http://localhost:3000/api/file", {
    method: "POST",
    body: formData,
  }).then((res) => {
    if (res.status === 200 || res.status === 201) {
      renderFiles();
      document.getElementById("load-file_container").remove();
    } else {
      res.json().then((data) => {
        document.getElementById("load-file_file-error").innerText =
          data.message;
        document.getElementById("load-file_upload").disabled = false;
      });
    }
  });
};

const downloadFile = (event) => {
  const id = event.target.parentElement.parentElement.dataset.id;
  const fileNumber = [].slice
    .call(document.getElementById("files").children)
    .indexOf(event.target.parentElement.parentElement);
  fetch(`http://localhost:3000/api/file/download/${id}`, {
    method: "GET",
  }).then((res) => {
    res.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files[fileNumber].name;
      a.click();
    });
  });
};

const editFile = (event) => {
  const names = [].slice.call(document.getElementsByClassName("file_name_text"));
  const id = event.target.parentElement.parentElement.dataset.id;
  const fileNumber = names.indexOf(
    event.target.parentElement.parentElement.getElementsByClassName(
      "file_name_text"
    )[0]
  );
  const name = names[fileNumber].innerText;
  const input = document.createElement("input");
  input.value = name;

  input.addEventListener("focusout", () => {
    const fileName = input.value + files[fileNumber].fileType;
    fetch(`http://localhost:3000/api/file/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fileName }),
    }).then((res) => {
      if (res.status === 204) {
        const p = document.createElement("p");
        p.classList.add("file_name_text");
        p.innerText = input.value;
        input.replaceWith(p);
      } else {
        res.json().then((data) => {
          let errorElement = event.target.parentElement.parentElement.getElementsByClassName(
            "file_error"
          )[0];
          if (errorElement) {
            errorElement.innerText = data.message;
          }
          input.select();
        });
      }
    });
  });

  names[fileNumber].replaceWith(input);
  input.select();
};

const deleteFile = (event) => {
  const fileElements = [].slice.call(
    document.getElementsByClassName("main_section_file")
  );
  const fileNumber = fileElements.indexOf(
    event.target.parentElement.parentElement
  );
  const id = +event.target.parentElement.parentElement.dataset.id;

  fetch(`http://localhost:3000/api/file/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        fileElements[fileNumber].remove();
      } else {
        console.error("Error deleting file");
      }
    })
    .catch((error) => {
      console.error("Error deleting file:", error);
    });
};

const renderFiles = () => {
  fetch("http://localhost:3000/api/file", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      files = data;
      const mainSection = document.getElementById("files");
      mainSection.innerHTML = "";
      for (let i = 0; i < files.length; i++) {
        let f = file
          .replace("{filename}", files[i].name.replace(files[i].fileType, ""))
          .replace("{id}", files[i].id)
          .replace("{type}", files[i].fileType);
        mainSection.innerHTML += f;
      }
    });
};

renderFiles();
