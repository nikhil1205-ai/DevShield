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

