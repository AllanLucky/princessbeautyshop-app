import { userRequest } from "../requestMethod";

/*
====================================================
SESSION MANAGEMENT
====================================================
*/

const generateSessionId = () => {
  try {
    let sessionId = localStorage.getItem("analytics_session_id");

    if (!sessionId) {
      sessionId =
        "session_" +
        Math.random().toString(36).substring(2, 11) +
        "_" +
        Date.now();

      localStorage.setItem("analytics_session_id", sessionId);
    }

    return sessionId;
  } catch {
    return "session_unknown";
  }
};

/*
====================================================
DEVICE DETECTION
====================================================
*/

const detectDeviceType = () => {
  try {
    const ua = navigator.userAgent.toLowerCase();

    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua))
      return "mobile";

    if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";

    return "desktop";
  } catch {
    return "unknown";
  }
};

const getBrowserInfo = () => {
  try {
    const ua = navigator.userAgent;

    let browser = "unknown";
    let os = "unknown";

    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome"))
      browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (
      ua.includes("iphone") ||
      ua.includes("ipad") ||
      ua.includes("ios")
    )
      os = "iOS";

    return { browser, os };
  } catch {
    return { browser: "unknown", os: "unknown" };
  }
};

const getScreenResolution = () => {
  try {
    return `${window.screen.width}x${window.screen.height}`;
  } catch {
    return "unknown";
  }
};

/*
====================================================
LOCATION FETCH WITH TIMEOUT (IMPORTANT ⭐)
====================================================
*/

const fetchWithTimeout = async (url, timeout = 5000) => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
};

const getUserLocation = async () => {
  try {
    const data = await fetchWithTimeout("https://ipapi.co/json/");

    return {
      country: data?.country_name || "unknown",
      city: data?.city || "unknown",
      region: data?.region || "unknown",
      timezone: data?.timezone || "unknown",
    };
  } catch {
    return {
      country: "unknown",
      city: "unknown",
      region: "unknown",
      timezone: "unknown",
    };
  }
};

/*
====================================================
CORE ANALYTICS ENGINE (SAFE VERSION ⭐)
====================================================
*/

let analyticsQueue = [];
let isProcessingQueue = false;

const sendAnalyticsBatch = async () => {
  if (isProcessingQueue) return;

  isProcessingQueue = true;

  try {
    while (analyticsQueue.length > 0) {
      const data = analyticsQueue.shift();

      try {
        await userRequest.post("/analytics", data);
      } catch (error) {
        console.error("Analytics send error:", error);
      }
    }
  } finally {
    isProcessingQueue = false;
  }
};

/*
====================================================
TRACKING MAIN FUNCTION
====================================================
*/

export const trackUserAction = async (
  action,
  actionType = "page_view",
  additionalData = {}
) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const currentPage =
      window.location.pathname + window.location.search;

    const analyticsData = {
      userId: user?._id || null,
      userEmail: user?.email || null,
      userName: user?.name || null,

      userAgent: navigator.userAgent,
      deviceType: detectDeviceType(),
      ...getBrowserInfo(),
      screenResolution: getScreenResolution(),
      language: navigator.language || "unknown",

      pageUrl: currentPage,
      pageTitle: document.title || "",
      referrer: document.referrer || "direct",

      action,
      actionType,

      sessionId: generateSessionId(),

      timestamp: new Date().toISOString(),

      ...additionalData,
    };

    analyticsQueue.push(analyticsData);

    getUserLocation().then((location) => {
      analyticsData.country = location.country;
      analyticsData.city = location.city;
      analyticsData.region = location.region;
      analyticsData.timezone = location.timezone;

      analyticsQueue.push(analyticsData);
      sendAnalyticsBatch();
    });

    sendAnalyticsBatch();
  } catch (error) {
    console.warn("Analytics tracking skipped:", error);
  }
};

/*
====================================================
UTILITY TRACKERS
====================================================
*/

export const trackPageView = (pageName = null) => {
  trackUserAction(pageName || window.location.pathname, "page_view");
};

export const trackButtonClick = (buttonName, additionalData = {}) => {
  trackUserAction(`click_${buttonName}`, "button_click", additionalData);
};

export const trackFormSubmit = (formName, additionalData = {}) => {
  trackUserAction(`submit_${formName}`, "form_submit", additionalData);
};

export const trackLogin = (method = "email") => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  trackUserAction(`login_${method}`, "login", {
    loginMethod: method,
    userId: user?._id,
    userEmail: user?.email,
  });
};

export const trackLogout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  trackUserAction("logout", "logout", {
    userId: user?._id,
    userEmail: user?.email,
  });
};

export const trackPurchase = (orderData) => {
  trackUserAction("purchase", "purchase", orderData);
};

export const trackSearch = (searchQuery, resultsCount = 0) => {
  trackUserAction("search", "search", {
    searchQuery,
    resultsCount,
  });
};