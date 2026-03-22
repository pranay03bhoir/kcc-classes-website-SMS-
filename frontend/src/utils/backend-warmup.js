// Backend warm-up utility to prevent Render cold starts
import api from "@/utils/common-axios";

let warmupInterval = null;

export const startBackendWarmup = () => {
  // Only run in production
  if (typeof window === 'undefined' || window.location.hostname === 'localhost') {
    return;
  }

  console.log("Starting backend warm-up...");
  
  // Initial warm-up
  warmUpBackend();
  
  // Then warm up every 14 minutes (Render sleeps after 15)
  warmupInterval = setInterval(warmUpBackend, 14 * 60 * 1000);
};

export const stopBackendWarmup = () => {
  if (warmupInterval) {
    clearInterval(warmupInterval);
    warmupInterval = null;
  }
};

const warmUpBackend = async () => {
  try {
    console.log("Warming up backend...");
    // Use a public endpoint that doesn't require auth
    await api.get("/get/toppers", { timeout: 10000 });
    console.log("Backend warm-up successful");
  } catch (error) {
    console.log("Backend warm-up failed (expected if cold):", error.message);
  }
};

// Start warm-up when module loads
if (typeof window !== 'undefined') {
  startBackendWarmup();
  
  // Clean up on page unload
  window.addEventListener('beforeunload', stopBackendWarmup);
}
