import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const parentScript = readFileSync(
  new URL("../iframe-code/iframe-parent.js", import.meta.url),
  "utf8",
);

function createParent(
  url,
  iframeOrigin = "https://longcoviddalys.netlify.app",
) {
  const listeners = {};
  const messages = [];
  const history = [];
  const contentWindow = {
    postMessage: (message, origin) => messages.push({ message, origin }),
  };
  const window = {
    location: { href: url, hostname: new URL(url).hostname },
    addEventListener: (type, listener) => (listeners[type] = listener),
    history: Object.fromEntries(
      ["pushState", "replaceState"].map((method) => [
        method,
        (_state, _title, nextUrl) => {
          window.location.href = nextUrl.href;
          history.push(method);
        },
      ]),
    ),
  };
  runInNewContext(parentScript, {
    window,
    document: { querySelector: () => ({ contentWindow, style: {} }) },
    URL,
    console,
  });
  return {
    window,
    messages,
    history,
    popstate: () => listeners.popstate(),
    send: (data) =>
      listeners.message({
        origin: iframeOrigin,
        source: contentWindow,
        data,
      }),
  };
}

for (const tab of ["prophylaxis", "longCovidMedication"]) {
  test(`${tab} updates the URL and restores tab and metric without adding history`, () => {
    const parent = createParent("https://polybio.org/model?keep=1#chart");
    parent.send({ type: "dalys-tab-change", tab });
    parent.send({ type: "dalys-metric-change", metric: "dalys" });
    const url = new URL(parent.window.location.href);
    assert.equal(url.searchParams.get("tab"), tab);
    assert.equal(url.searchParams.get("metric"), "dalys");
    assert.equal(url.searchParams.get("keep"), "1");
    assert.equal(url.hash, "#chart");
    assert.deepEqual(parent.history, ["pushState", "replaceState"]);

    parent.send({ type: "dalys-ready" });
    assert.equal(parent.messages.at(-1).message.tab, tab);
    assert.equal(parent.messages.at(-1).message.metric, "dalys");
    assert.equal(
      parent.messages.at(-1).origin,
      "https://longcoviddalys.netlify.app",
    );

    parent.window.location.href = "https://polybio.org/model?tab=air";
    parent.popstate();
    assert.equal(parent.messages.at(-1).message.tab, "air");
    parent.window.location.href = url.href;
    parent.popstate();
    assert.equal(parent.messages.at(-1).message.tab, tab);
    assert.equal(parent.messages.at(-1).message.metric, "dalys");
    assert.deepEqual(parent.history, ["pushState", "replaceState"]);
  });
}

test("unknown tabs fall back to air and cannot change URL history", () => {
  const parent = createParent("https://polybio.org/model?tab=unknown");
  parent.send({ type: "dalys-ready" });
  assert.equal(parent.messages.at(-1).message.tab, "air");
  parent.send({ type: "dalys-tab-change", tab: "unknown" });
  assert.deepEqual(parent.history, []);
});

test("DALYs averted selection shares, reloads, restores, and resets the metric", () => {
  const parent = createParent("https://polybio.org/model?keep=1#chart");
  parent.send({ type: "dalys-metric-change", metric: "averted" });
  const url = new URL(parent.window.location.href);
  assert.equal(url.searchParams.get("metric"), "averted");
  assert.equal(url.searchParams.get("keep"), "1");
  assert.equal(url.hash, "#chart");
  assert.deepEqual(parent.history, ["replaceState"]);

  parent.send({ type: "dalys-share-current-view" });
  assert.equal(parent.messages.at(-1).message.url, url.href);
  const reloadedParent = createParent(url.href);
  reloadedParent.send({ type: "dalys-ready" });
  assert.equal(reloadedParent.messages.at(-1).message.metric, "averted");
  assert.deepEqual(reloadedParent.history, []);

  parent.window.location.href = "https://polybio.org/model?metric=dalys";
  parent.popstate();
  assert.equal(parent.messages.at(-1).message.metric, "dalys");
  parent.window.location.href = url.href;
  parent.popstate();
  assert.equal(parent.messages.at(-1).message.metric, "averted");
  assert.deepEqual(parent.history, ["replaceState"]);

  parent.send({ type: "dalys-reset-view" });
  assert.equal(
    parent.window.location.href,
    "https://polybio.org/model?keep=1#chart",
  );
  parent.send({ type: "dalys-ready" });
  assert.equal(parent.messages.at(-1).message.metric, "percent");
});

test("removed combined tab cannot restore an empty chart or change history", () => {
  const parent = createParent("https://polybio.org/model?tab=pharmaceuticals");
  parent.send({ type: "dalys-ready" });
  assert.equal(parent.messages.at(-1).message.tab, "air");
  assert.equal(
    "pharmaceuticalInterventionFilter" in parent.messages.at(-1).message,
    false,
  );
  parent.send({ type: "dalys-tab-change", tab: "pharmaceuticals" });
  assert.deepEqual(parent.history, []);
});

test("local iframe harness uses the development origin", () => {
  const parent = createParent(
    "http://127.0.0.1:57391/iframe-code/iframe.html?tab=prophylaxis",
    "http://localhost:5173",
  );
  parent.send({ type: "dalys-ready" });
  assert.equal(parent.messages.at(-1).message.tab, "prophylaxis");
  assert.equal(parent.messages.at(-1).origin, "http://localhost:5173");
  parent.send({ type: "dalys-tab-change", tab: "longCovidMedication" });
  assert.equal(
    new URL(parent.window.location.href).searchParams.get("tab"),
    "longCovidMedication",
  );
});

test("Long COVID intervention filters persist, share, restore, and reset independently of air filters", () => {
  const parent = createParent(
    "https://polybio.org/model?tab=longCovidMedication&airInterventionFilter=hepa&keep=1#chart",
  );
  for (const filter of ["diseaseProgression", "symptomBurden", "all"]) {
    const change = {
      type: "dalys-long-covid-medication-intervention-filter-change",
      longCovidMedicationInterventionFilter: filter,
    };
    parent.send(change);
    const url = new URL(parent.window.location.href);
    assert.equal(
      url.searchParams.get("longCovidMedicationInterventionFilter"),
      filter,
    );
    assert.equal(url.searchParams.get("airInterventionFilter"), "hepa");
    assert.equal(url.searchParams.get("keep"), "1");
    assert.equal(url.hash, "#chart");

    const historyLength = parent.history.length;
    parent.send(change);
    assert.equal(parent.history.length, historyLength);
    parent.send({ type: "dalys-share-current-view" });
    assert.equal(parent.messages.at(-1).message.url, url.href);

    const reloaded = createParent(url.href);
    reloaded.send({ type: "dalys-ready" });
    assert.equal(
      reloaded.messages.at(-1).message.longCovidMedicationInterventionFilter,
      filter,
    );
    assert.deepEqual(reloaded.history, []);

    parent.window.location.href = "https://polybio.org/model";
    parent.popstate();
    assert.equal(
      parent.messages.at(-1).message.longCovidMedicationInterventionFilter,
      "all",
    );
    parent.window.location.href = url.href;
    parent.popstate();
    assert.equal(
      parent.messages.at(-1).message.longCovidMedicationInterventionFilter,
      filter,
    );
    assert.equal(parent.history.length, historyLength);
  }
  assert.deepEqual(parent.history, [
    "replaceState",
    "replaceState",
    "replaceState",
  ]);
  parent.send({ type: "dalys-reset-view" });
  assert.equal(
    parent.window.location.href,
    "https://polybio.org/model?keep=1#chart",
  );
  parent.send({ type: "dalys-ready" });
  assert.equal(
    parent.messages.at(-1).message.longCovidMedicationInterventionFilter,
    "all",
  );
});

test("invalid Long COVID intervention filters fall back to all and cannot change history", () => {
  const originalUrl =
    "https://polybio.org/model?longCovidMedicationInterventionFilter=unknown";
  const parent = createParent(originalUrl);
  parent.send({ type: "dalys-ready" });
  assert.equal(
    parent.messages.at(-1).message.longCovidMedicationInterventionFilter,
    "all",
  );
  for (const filter of ["unknown", "hepa", "", null, undefined, 1]) {
    parent.send({
      type: "dalys-long-covid-medication-intervention-filter-change",
      longCovidMedicationInterventionFilter: filter,
    });
  }
  assert.equal(parent.window.location.href, originalUrl);
  assert.deepEqual(parent.history, []);
});

const sortParametersByTab = {
  air: "airSortOrder",
  prophylaxis: "prophylaxisSortOrder",
  longCovidMedication: "longCovidMedicationSortOrder",
  outcomeBreakdown: "outcomeBreakdownSortOrder",
};
const defaultSortOrders = Object.fromEntries(
  Object.keys(sortParametersByTab).map((tab) => [tab, "default"]),
);

for (const [tab, param] of Object.entries(sortParametersByTab)) {
  test(`${tab} sorting updates, shares, and restores URL state`, () => {
    const parent = createParent(
      "https://polybio.org/model?keep=1&metric=dalys#chart",
    );
    for (const sortOrder of ["descending", "ascending", "default"]) {
      parent.send({ type: "dalys-sort-order-change", tab, sortOrder });
      const url = new URL(parent.window.location.href);
      assert.equal(url.searchParams.get(param), sortOrder);
      assert.equal(url.searchParams.get("keep"), "1");
      assert.equal(url.searchParams.get("metric"), "dalys");
      assert.equal(url.hash, "#chart");

      // Selecting the same order twice does not rewrite history.
      const historyLength = parent.history.length;
      parent.send({ type: "dalys-sort-order-change", tab, sortOrder });
      assert.equal(parent.history.length, historyLength);

      parent.send({ type: "dalys-share-current-view" });
      assert.equal(parent.messages.at(-1).message.url, url.href);

      // Opening a shared link or refreshing restores sorting without history.
      const reloadedParent = createParent(url.href);
      reloadedParent.send({ type: "dalys-ready" });
      assert.equal(
        reloadedParent.messages.at(-1).message.sortOrders[tab],
        sortOrder,
      );
      assert.deepEqual(reloadedParent.history, []);

      parent.window.location.href = "https://polybio.org/model";
      parent.popstate();
      assert.equal(parent.messages.at(-1).message.sortOrders[tab], "default");
      parent.window.location.href = url.href;
      parent.popstate();
      assert.equal(parent.messages.at(-1).message.sortOrders[tab], sortOrder);
      assert.equal(parent.history.length, historyLength);
    }
    assert.deepEqual(parent.history, [
      "replaceState",
      "replaceState",
      "replaceState",
    ]);
  });
}

test("charts keep independent sort orders and resetting one preserves the others", () => {
  const parent = createParent("https://polybio.org/model?keep=1#chart");
  const expected = {
    air: "ascending",
    prophylaxis: "descending",
    longCovidMedication: "ascending",
    outcomeBreakdown: "descending",
  };
  for (const [tab, sortOrder] of Object.entries(expected)) {
    parent.send({ type: "dalys-sort-order-change", tab, sortOrder });
  }
  parent.send({ type: "dalys-ready" });
  assert.deepEqual({ ...parent.messages.at(-1).message.sortOrders }, expected);

  parent.send({
    type: "dalys-sort-order-change",
    tab: "air",
    sortOrder: "default",
  });
  parent.send({ type: "dalys-ready" });
  assert.deepEqual(
    { ...parent.messages.at(-1).message.sortOrders },
    { ...expected, air: "default" },
  );
});

test("missing or invalid sort parameters restore the default order", () => {
  const parent = createParent(
    "https://polybio.org/model?airSortOrder=unknown&prophylaxisSortOrder=ASCENDING&outcomeBreakdownSortOrder=",
  );
  parent.send({ type: "dalys-ready" });
  assert.deepEqual(
    { ...parent.messages.at(-1).message.sortOrders },
    defaultSortOrders,
  );
  assert.deepEqual(parent.history, []);
});

test("invalid sort messages cannot change URL history", () => {
  const originalUrl =
    "https://polybio.org/model?airSortOrder=ascending&keep=1#chart";
  const parent = createParent(originalUrl);
  for (const tab of ["about", "unknown", "__proto__", "toString", undefined]) {
    parent.send({
      type: "dalys-sort-order-change",
      tab,
      sortOrder: "descending",
    });
  }
  for (const sortOrder of ["unknown", "ASCENDING", "", null, undefined, 1]) {
    parent.send({ type: "dalys-sort-order-change", tab: "air", sortOrder });
  }
  assert.equal(parent.window.location.href, originalUrl);
  assert.deepEqual(parent.history, []);
});

test("reset view clears all sort parameters and preserves unrelated URL state", () => {
  const parent = createParent(
    "https://polybio.org/model?keep=1&tab=prophylaxis&metric=dalys&airInterventionFilter=hepa&outcomeBreakdownScenarioId=baseline&airSortOrder=ascending&prophylaxisSortOrder=descending&longCovidMedicationSortOrder=ascending&outcomeBreakdownSortOrder=descending#chart",
  );
  parent.send({ type: "dalys-reset-view" });
  assert.equal(
    parent.window.location.href,
    "https://polybio.org/model?keep=1#chart",
  );
  assert.deepEqual(parent.history, ["pushState"]);
  parent.send({ type: "dalys-ready" });
  assert.deepEqual(
    { ...parent.messages.at(-1).message.sortOrders },
    defaultSortOrders,
  );
  parent.send({ type: "dalys-reset-view" });
  assert.deepEqual(parent.history, ["pushState"]);
});

test("reset view also clears a URL containing only a sort parameter", () => {
  const parent = createParent(
    "https://polybio.org/model?airSortOrder=ascending#chart",
  );
  parent.send({ type: "dalys-reset-view" });
  assert.equal(parent.window.location.href, "https://polybio.org/model#chart");
  assert.deepEqual(parent.history, ["pushState"]);
});
