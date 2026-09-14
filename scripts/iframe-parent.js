window.addEventListener("message", (event) => {
  const iframe = document.getElementById("dalys");
  const parentOrigin = "https://longcoviddalys.netlify.app";

  if (event.origin !== parentOrigin) {
    return;
  }

  const messageData = event.data;
  if (messageData.height) {
    iframe.style.height = messageData.height + "px";
  }
});
