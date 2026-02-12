(function (window) {
  if (window.Logger) return;

  const Logger = {};
  let config = {};
  let buffer = [];
  const FLUSH_INTERVAL = 1000;
  let flushTimer = null;

  function now() {
    return new Date().toISOString();
  }

  function send(batch) {
    if (!batch.length) return;

    fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ batch })
    }).catch(() => {});
  }

  function flush() {
    if (!buffer.length) return;
    send(buffer);
    buffer = [];
  }

  function push(log) {
    buffer.push({
      timestamp: now(),
      app: config.appName,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...log
    });

    // 🔥 Flush immediately on ERROR
    if (log.level === "ERROR") {
      flush();
    }
  }

  Logger.init = function (options) {
    if (!options || !options.endpoint) {
      throw new Error("Logger.init requires endpoint");
    }

    config = options;

    flushTimer = setInterval(flush, FLUSH_INTERVAL);

    // Console capture
    ["log", "warn", "error"].forEach(level => {
      const original = console[level];
      console[level] = function (...args) {
        push({
          level: level.toUpperCase(),
          type: "console",
          message: args.join(" ")
        });
        original.apply(console, args);
      };
    });

    // Runtime errors
    window.addEventListener("error", e => {
      push({
        level: "ERROR",
        type: "runtime",
        message: e.message,
        source: e.filename,
        line: e.lineno
      });
    });

    // Promise rejections
    window.addEventListener("unhandledrejection", e => {
      push({
        level: "ERROR",
        type: "promise",
        message: String(e.reason)
      });
    });

    // ✅ Modern performance API
    window.addEventListener("load", () => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (nav) {
        push({
          level: "INFO",
          type: "performance",
          loadTimeMs: Math.round(nav.loadEventEnd)
        });
      }
    });

    push({
      level: "INFO",
      type: "sdk",
      message: "Logger SDK initialized"
    });
  };

  Logger.log = function (message, data = {}) {
    push({ level: "INFO", type: "custom", message, data });
  };

  Logger.error = function (message, data = {}) {
    push({ level: "ERROR", type: "custom", message, data });
  };

  window.Logger = Logger;
})(window);
