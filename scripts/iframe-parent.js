window.addEventListener("message", (event) => {
  const iframe = document.getElementById("dalys");
  const parentOrigin = "https://longcoviddalys.netlify.app";
  const url = new URL(window.location.href);

  if (event.origin !== parentOrigin) {
    return;
  }

  const messageData = event.data;
  if (messageData.height) {
    iframe.style.height = messageData.height + "px";
  }

  if (messageData.queryParam) {
    url.searchParams.set("tab", messageData.queryParam);
    history.pushState(messageData.queryParam, "", url);
  }
});
