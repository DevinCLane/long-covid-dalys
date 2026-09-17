const iframeOrigin = "https://longcoviddalys.netlify.app";
window.addEventListener("message", (event) => {
  const iframe = document.querySelector("iframe#dalys");
  const url = new URL(window.location.href);

  if (event.origin !== iframeOrigin) {
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

// Handle forward/back buttons
window.addEventListener("popstate", (event) => {
  const iframe = document.querySelector("iframe#dalys");
  const url = new URL(window.location.href);
  if (!iframe.contentWindow) {
    console.error("iframe content window not found");
  }
  iframe.contentWindow.postMessage(
    { queryParam: url.searchParams.get("tab") ?? "air" },
    iframeOrigin,
  );
});
