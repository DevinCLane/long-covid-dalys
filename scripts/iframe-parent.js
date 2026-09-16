window.addEventListener("message", (event) => {
  const iframe = document.getElementById("dalys");
  const parentOrigin = "https://longcoviddalys.netlify.app";
  const baseUrl = "https://polybio.org";

  if (event.origin !== parentOrigin) {
    return;
  }

  const messageData = event.data;
  if (messageData.height) {
    iframe.style.height = messageData.height + "px";
  }

  if (messageData.url) {
    window.location.href = `${baseUrl}/dalys/${messageData.url}`;
  }
});
