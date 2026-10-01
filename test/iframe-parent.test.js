import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const parentScript = readFileSync(
  new URL("../iframe-code/iframe-parent.js", import.meta.url),
  "utf8",
);

function createParent(url) {
  const listeners = {};
  const messages = [];
  const history = [];
  const contentWindow = {
    postMessage: (message, origin) => messages.push({ message, origin }),
  };
  const window = {
    location: { href: url },
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
        origin: "http://localhost:5173",
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
    assert.equal(parent.messages.at(-1).origin, "http://localhost:5173");

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
