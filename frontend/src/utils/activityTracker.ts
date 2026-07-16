// Track the time of the last user interaction
let lastActivityTime = Date.now();

// Default inactivity timeout set to 15 minutes
export const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

export const updateActivity = () => {
  lastActivityTime = Date.now();
};

export const getLastActivityTime = () => lastActivityTime;

export const isUserActive = () => {
  return (Date.now() - lastActivityTime) < INACTIVITY_TIMEOUT_MS;
};

export const setupActivityTracker = () => {
  // Update activity timestamp on common interactions
  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
  
  events.forEach((event) => {
    window.addEventListener(event, updateActivity, { passive: true });
  });

  return () => {
    events.forEach((event) => {
      window.removeEventListener(event, updateActivity);
    });
  };
};
