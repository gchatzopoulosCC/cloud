let files = ["a", "b", "c"];

let file =
  '<div class="main_section_file"><div class="file_name"><img src="../assets/icons/file.svg" alt="file" class="file_icon"/><p class="file_name_text">{filename}</p></div><div class="file_options"><img src="../assets/icons/download.svg" alt="download" class="file_option"/><img src="../assets/icons/edit.svg" alt="edit" class="file_option" onclick="editFile(event)"/><img src="../assets/icons/delete.svg" alt="delete" class="file_option" onclick="deleteFile(event)"/></div></div>';

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

let openUpload = () => {
  let uploadHTML =
    '<div class="load-file" id="load-file_container"> <form class="load-file__wrapper" method="post" enctype="multipart/form-data"> <div class="load-file_input"> <input type="text" id="load-file_name" placeholder="File name" class="load-file_name form-control" /> <p class="load-file_error" id="load-file_name-error"></p> </div> <div class="load-file_input"> <input type="file" id="load-file" class="load-file_file" /> <p class="load-file_error" id="load-file_file-error"></p> </div> <button class="btn btn-light btn-upload" id="load-file_upload">Upload</button> </form></div>';
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

let uploadFile = () => {
  let name = document.getElementById("load-file_name").value;
  if (!name) {
    document.getElementById("load-file_name-error").innerHTML =
      "Please enter a file name";
    return;
  } else {
    document.getElementById("load-file_name-error").innerHTML = "";
  }
  let file = document.getElementById("load-file").files[0];
  if (!file) {
    document.getElementById("load-file_file-error").innerHTML =
      "Please select a file";
    return;
  } else {
    document.getElementById("load-file_file-error").innerHTML = "";
  }
  document.getElementById("load-file_upload").disabled = true;

  console.log(0, file);
  fetch("http://localhost:3000/api/file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: 1 }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

// let editFile = (event) => {
//   let names = [].slice.call(document.getElementsByClassName("file_name_text"));
//   let id = names.indexOf(
//     event.target.parentElement.parentElement.children[0].children[1]
//   );
//   let name = names[id].innerText;
//   let input = document.createElement("input");
//   input.value = name;
//   input.addEventListener("focusout", () => {
//     let p = document.createElement("p");
//     p.classList.add("file_name_text");
//     p.innerText = input.value;
//     input.replaceWith(p);
//   });
//   names[id].replaceWith(input);
//   input.select();
// };

let editFile = (event) => {
  let names = [].slice.call(document.getElementsByClassName("file_name_text"));
  let id = names.indexOf(
    event.target.parentElement.parentElement.children[0].children[1]
  );
  let fileId = files[id].id; // Assuming `files` is an array of file objects with an `id` property
  let name = names[id].innerText;
  let input = document.createElement("input");
  input.value = name;
  input.addEventListener("focusout", () => {
    let newName = input.value;
    fetch(`http://localhost:3000/file/${fileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((res) => res.json())
      .then((data) => {
        let p = document.createElement("p");
        p.classList.add("file_name_text");
        p.innerText = data.name;
        input.replaceWith(p);
      })
      .catch((error) => {
        console.error("Error renaming file:", error);
      });
  });
  names[id].replaceWith(input);
  input.select();
};

let deleteFile = (event) => {
  fileElements = [].slice.call(
    document.getElementsByClassName("main_section_file")
  );
  let id = fileElements.indexOf(event.target.parentElement.parentElement);
  let fileId = files[id].id; 

  fetch(`http://localhost:3000/file/${fileId}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 204) {
        fileElements[id].remove();
      } else {
        console.error("Error deleting file");
      }
    })
    .catch((error) => {
      console.error("Error deleting file:", error);
    });
};

let renderFiles = () => {
  let mainSection = document.getElementById("files");
  mainSection.innerHTML = ""; 
  for (let i = 0; i < files.length; i++) {
    let f = file.replace("{filename}", files[i].name);
    mainSection.innerHTML += f;
  }
};

renderFiles();
