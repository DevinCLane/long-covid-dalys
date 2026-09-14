const iframe = document.getElementById("dalys");
const parentOrigin = "https://longcoviddalys.netlify.app";

window.addEventListener("message", (event) => {
  console.log(event);
});

// if (!e.origin === parentOrigin) {
//   return;
// }

// const message = e.data;

// if (message.height) {
//   iframe.height = message.height + "px";
// }
