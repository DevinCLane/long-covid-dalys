// paste this into the Wordpress editor, nothing happens locally here
(() => {
  // local testing only
  // const IFRAME_ORIGIN = "http://localhost:5173";
  // uncomment this for production
  const IFRAME_ORIGIN = "https://longcoviddalys.netlify.app";
  // This script is standalone: keep these IDs in sync with iframe-messages.ts.
  const TAB_IDS = ["air", "pharmaceuticals", "outcomeBreakdown", "about"];
  const METRICS = ["percent", "dalys"];
  const AIR_INTERVENTION_FILTERS = ["all", "hepa", "uvc"];
  const PHARMACEUTICAL_INTERVENTION_FILTERS = [
    "all",
    "prophylaxis",
    "longCovidMedication",
  ];
  const SCENARIO_IDS = [
    "baseline",
    "hepa_most_public",
    "hepa_schools_and_daycares",
    "hepa_all_public",
    "far_uvc_most_public",
    "far_uvc_schools_and_daycares",
    "far_uvc_all_public",
    "preexposure_prophylaxis",
    "postexposure_prophylaxis",
    "long_covid_progression_reduction",
    "long_covid_disability_reduction",
  ];

  const SEARCH_PARAMETERS = [
    "tab",
    "metric",
    "airInterventionFilter",
    "pharmaceuticalInterventionFilter",
    "outcomeBreakdownScenarioId",
  ];

  function getIframe() {
    const iframe = document.querySelector("iframe#dalys");
    if (!iframe?.contentWindow) {
      console.error(
        "Iframe #dalys not foudn or its content window is unavailable",
      );
      return null;
    }
    return iframe;
  }

  function deleteSearchParams(url) {
    for (const param of SEARCH_PARAMETERS) {
      url.searchParams.delete(param);
    }
  }

  function getTab(url) {
    const tab = url.searchParams.get("tab");
    return TAB_IDS.includes(tab) ? tab : "air";
  }

  function getMetric(url) {
    const metric = url.searchParams.get("metric");
    return METRICS.includes(metric) ? metric : "percent";
  }

  function getAirInterventionFilter(url) {
    const airInterventionFilter = url.searchParams.get("airInterventionFilter");
    return AIR_INTERVENTION_FILTERS.includes(airInterventionFilter)
      ? airInterventionFilter
      : "all";
  }

  function getPharmaceuticalInterventionFilter(url) {
    const pharmaceuticalInterventionFilter = url.searchParams.get(
      "pharmaceuticalInterventionFilter",
    );
    return PHARMACEUTICAL_INTERVENTION_FILTERS.includes(
      pharmaceuticalInterventionFilter,
    )
      ? pharmaceuticalInterventionFilter
      : "all";
  }

  function getOutcomeBreakdownScenarioId(url) {
    const outcomeBreakdownScenarioId = url.searchParams.get(
      "outcomeBreakdownScenarioId",
    );
    return SCENARIO_IDS.includes(outcomeBreakdownScenarioId)
      ? outcomeBreakdownScenarioId
      : "hepa_all_public";
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
        pharmaceuticalInterventionFilter:
          getPharmaceuticalInterventionFilter(url),
        outcomeBreakdownScenarioId: getOutcomeBreakdownScenarioId(url),
        metric: getMetric(url),
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

      case "dalys-reset-view": {
        const url = new URL(window.location.href);
        // if URL parameters already fully reset, don't reset again
        if (!SEARCH_PARAMETERS.some((param) => url.searchParams.has(param))) {
          return;
        }
        deleteSearchParams(url);
        window.history.pushState(null, "", url);
        return;
      }

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

      case "dalys-metric-change": {
        if (!METRICS.includes(message.metric)) return;

        const url = new URL(window.location.href);
        if (getMetric(url) === message.metric) return;

        url.searchParams.set("metric", message.metric);
        window.history.replaceState(null, "", url);
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

      case "dalys-pharmaceutical-intervention-filter-change": {
        if (
          !PHARMACEUTICAL_INTERVENTION_FILTERS.includes(
            message.pharmaceuticalInterventionFilter,
          )
        )
          return;

        const url = new URL(window.location.href);
        if (
          getPharmaceuticalInterventionFilter(url) ===
          message.pharmaceuticalInterventionFilter
        )
          return;

        url.searchParams.set(
          "pharmaceuticalInterventionFilter",
          message.pharmaceuticalInterventionFilter,
        );
        window.history.replaceState(null, "", url);
        return;
      }

      case "dalys-outcome-breakdown-scenario-change": {
        if (!SCENARIO_IDS.includes(message.outcomeBreakdownScenarioId)) return;

        const url = new URL(window.location.href);
        if (
          getOutcomeBreakdownScenarioId(url) ===
          message.outcomeBreakdownScenarioId
        )
          return;
        url.searchParams.set(
          "outcomeBreakdownScenarioId",
          message.outcomeBreakdownScenarioId,
        );
        window.history.replaceState(null, "", url);
        return;
      }
    }
  });

  window.addEventListener("popstate", sendCurrentUrlParams);
})();
