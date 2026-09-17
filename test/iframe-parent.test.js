import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(
  new URL("../scripts/iframe-parent.js", import.meta.url),
  "utf8",
);
const iframeOrigin = "https://longcoviddalys.netlify.app";

function setup(href = "https://polybio.org/dalys/") {
  const listeners = {};
  const messages = [];
  const entries = [];
  const iframe = {
    style: {},
    contentWindow: {
      postMessage: (message, origin) => messages.push({ ...message, origin }),
    },
  };
  const document = { querySelector: () => iframe };
  const window = {
    location: { href },
    addEventListener: (type, handler) => {
      listeners[type] = handler;
    },
    history: {
      pushState: (_state, _unused, url) => {
        window.location.href = String(url);
        entries.push(String(url));
      },
    },
  };
  runInNewContext(source, { window, document, URL });
  return {
    iframe,
    document,
    window,
    messages,
    entries,
    send: (data, overrides = {}) =>
      listeners.message({
        data,
        origin: iframeOrigin,
        source: iframe.contentWindow,
        ...overrides,
      }),
    navigate: (href) => {
      window.location.href = href;
      listeners.popstate({ state: null });
    },
  };
}

test("shared links initialize the tab without adding history, including repeated readiness", () => {
  const app = setup("https://polybio.org/dalys/?tab=about");
  app.send({ type: "dalys-ready" });
  app.send({ type: "dalys-ready" });
  assert.deepEqual(
    app.messages,
    Array(2).fill({
      type: "dalys-set-tab",
      tab: "about",
      origin: iframeOrigin,
    }),
  );
  assert.equal(app.entries.length, 0);
});

test("tab changes preserve other parameters and hashes without duplicate entries", () => {
  const app = setup(
    "https://polybio.org/dalys/?preview=true&hepa=75#simulator",
  );
  app.send({ type: "dalys-tab-change", tab: "pharmaceuticals" });
  app.send({ type: "dalys-tab-change", tab: "pharmaceuticals" });
  assert.deepEqual(app.entries, [
    "https://polybio.org/dalys/?preview=true&hepa=75&tab=pharmaceuticals#simulator",
  ]);
  assert.equal(app.messages.length, 0);
});

test("Back and Forward read the URL even when history state is null", () => {
  const app = setup();
  app.navigate("https://polybio.org/dalys/?tab=pharmaceuticals");
  app.navigate("https://polybio.org/dalys/");
  app.navigate("https://polybio.org/dalys/?tab=about");
  assert.deepEqual(
    app.messages.map(({ tab }) => tab),
    ["pharmaceuticals", "air", "about"],
  );
  assert.equal(app.entries.length, 0);
});

test("unknown URL tabs fall back to air without rewriting the URL", () => {
  const app = setup("https://polybio.org/dalys/?tab=unknown");
  app.send({ type: "dalys-ready" });
  assert.equal(app.messages[0].tab, "air");
  assert.equal(app.entries.length, 0);
});

test("unrelated, malformed, invalid, and spoofed messages are ignored", () => {
  const app = setup();
  for (const data of [
    null,
    undefined,
    "text",
    {},
    { type: "other" },
    { type: "dalys-tab-change", tab: "unknown" },
  ]) {
    app.send(data);
  }
  app.send(
    { type: "dalys-tab-change", tab: "about" },
    { origin: "https://example.org" },
  );
  app.send({ type: "dalys-tab-change", tab: "about" }, { source: {} });
  app.send({ type: "dalys-set-tab", tab: "about" });
  assert.equal(app.entries.length, 0);
  assert.equal(app.messages.length, 0);
});

test("resize messages accept only positive finite numeric heights", () => {
  const app = setup();
  app.send({ type: "dalys-resize", height: 1200 });
  for (const height of [0, -1, NaN, Infinity, "1000"]) {
    app.send({ type: "dalys-resize", height });
  }
  assert.equal(app.iframe.style.height, "1200px");
});

test("both listeners tolerate a missing iframe or content window", () => {
  const app = setup();
  app.iframe.contentWindow = null;
  app.send({ type: "dalys-ready" });
  app.navigate("https://polybio.org/dalys/?tab=about");
  app.document.querySelector = () => null;
  app.send({ type: "dalys-tab-change", tab: "about" });
  app.navigate("https://polybio.org/dalys/");
  assert.equal(app.entries.length, 0);
  assert.equal(app.messages.length, 0);
});
