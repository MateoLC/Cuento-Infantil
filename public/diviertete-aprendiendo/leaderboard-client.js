(() => {
  let sessionDetail = null;
  let startedAt = 0;
  let completed = false;

  function post(type, detail) {
    if (window.parent === window) return;
    window.parent.postMessage({ type, detail }, window.location.origin);
  }

  window.addEventListener("sofia:session-ready", (event) => {
    sessionDetail = event.detail;
    startedAt = Date.now();
    completed = false;
    post("sofia:game-ready", sessionDetail);
  });

  window.SofiaLeaderboardBridge = {
    complete(metrics = {}) {
      if (!sessionDetail || completed) return;
      const currentSession = window.SofiaGames?.currentSession;
      completed = true;
      post("sofia:game-complete", {
        ...sessionDetail,
        durationSeconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
        hintsUsed: currentSession
          ? Math.max(0, currentSession.difficulty.hints - currentSession.hintsRemaining)
          : 0,
        metrics,
      });
    },
  };
})();
