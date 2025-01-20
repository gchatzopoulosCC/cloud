let files = ["a", "b", "c"];

let file =
  '<div class="main_section_file"><div class="file_name"><img src="../assets/icons/file.svg" alt="file" class="file_icon"/><p class="file_name_text">{filename}</p></div><div class="file_options"><img src="../assets/icons/download.svg" alt="download" class="file_option"/><img src="../assets/icons/edit.svg" alt="edit" class="file_option" onclick="editFile(event)"/><img src="../assets/icons/delete.svg" alt="delete" class="file_option" onclick="deleteFile(event)"/></div></div>';

let openUpload = () => {
  let upload = document.getElementById("load-file_container");
  upload.classList.remove("hidden");
};

let uploadFile = () => {
  let name = document.getElementById("load-file_name").value;
  let input = document.getElementById("load-file").value;
};

let editFile = (event) => {
  let names = [].slice.call(document.getElementsByClassName("file_name_text"));
  let id = names.indexOf(
    event.target.parentElement.parentElement.children[0].children[1]
  );
  let name = names[id].innerText;
  let input = document.createElement("input");
  input.value = name;
  input.addEventListener("focusout", () => {
    let p = document.createElement("p");
    p.classList.add("file_name_text");
    p.innerText = input.value;
    input.replaceWith(p);
  });
  names[id].replaceWith(input);
  input.select();
};

let deleteFile = (event) => {
  fileElements = [].slice.call(
    document.getElementsByClassName("main_section_file")
  );
  let id = fileElements.indexOf(event.target.parentElement.parentElement);
  fileElements[id].remove();
};

let renderFiles = () => {
  let mainSection = document.getElementById("files");
  for (let i = 0; i < files.length; i++) {
    let f = file.replace("{filename}", files[i]);
    mainSection.innerHTML += f;
  }
};

renderFiles();
