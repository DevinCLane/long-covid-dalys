// paste this into the Wordpress editor, nothing happens locally here
// This script is standalone: keep these tab IDs in sync with iframe-messages.ts.
(() => {
  const IFRAME_ORIGIN = "https://longcoviddalys.netlify.app";
  const TAB_IDS = ["air", "pharmaceuticals", "detailed", "about"];
  const AIR_INTERVENTION_FILTERS = ["all", "hepa", "uvc"];

  function getIframe() {
    const iframe = document.querySelector("iframe#dalys");
    if (!iframe?.contentWindow) return null;
    return iframe;
  }

  function getTab(url) {
    const tab = url.searchParams.get("tab");
    return TAB_IDS.includes(tab) ? tab : "air";
  }

  function getAirInterventionFilter(url) {
    const airInterventionFilter = url.searchParams.get("airInterventionFilter");
    return AIR_INTERVENTION_FILTERS.includes(airInterventionFilter)
      ? airInterventionFilter
      : "all";
  }

  // Shared by initial loading and Back/Forward; neither adds history.
  function sendCurrentUrlParams() {
    const iframe = getIframe();
    if (!iframe) return;

    const url = new URL(window.location.href);
    iframe.contentWindow.postMessage(
      {
        type: "dalys-state",
        tab: getTab(url),
        airInterventionFilter: getAirInterventionFilter(url),
      },
      IFRAME_ORIGIN,
    );
  }

  window.addEventListener("message", (event) => {
    const iframe = getIframe();
    if (
      !iframe ||
      event.origin !== IFRAME_ORIGIN ||
      event.source !== iframe.contentWindow
    ) {
      return;
    }

    const message = event.data;
    switch (message?.type) {
      case "dalys-ready":
        sendCurrentUrlParams();
        return;

      case "dalys-resize":
        if (Number.isFinite(message.height) && message.height > 0) {
          iframe.style.height = `${message.height}px`;
        }
        return;

      case "dalys-tab-change": {
        if (!TAB_IDS.includes(message.tab)) return;

        const url = new URL(window.location.href);
        if (getTab(url) === message.tab) return;

        url.searchParams.set("tab", message.tab);
        window.history.pushState(null, "", url);
        return;
      }

      case "dalys-air-intervention-filter-change": {
        if (!AIR_INTERVENTION_FILTERS.includes(message.airInterventionFilter))
          return;

        const url = new URL(window.location.href);
        if (getAirInterventionFilter(url) === message.airInterventionFilter)
          return;

        url.searchParams.set(
          "airInterventionFilter",
          message.airInterventionFilter,
        );
        window.history.replaceState(null, "", url);
        return;
      }
    }
  });

  window.addEventListener("popstate", sendCurrentUrlParams);
})();
