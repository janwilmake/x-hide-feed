// ==UserScript==
// @name         Twitter Timeline Replacer (Messages Excluded)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replaces Twitter timeline with a pro message, except in messages
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to check if we're on a messages page
  function isMessagesPage() {
    return window.location.pathname.startsWith("/messages");
  }

  // Function to create and style the pro message
  function createProMessage() {
    const container = document.createElement("div");
    container.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          font-size: 48px;
          font-weight: bold;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          z-index: 9999;
      `;

    const link = document.createElement("a");
    link.href = "https://pro.x.com";
    link.textContent = "Be a pro!";
    link.style.cssText = `
          color: rgb(29, 155, 240);
          text-decoration: none;
          transition: color 0.2s ease;
      `;
    link.onmouseover = () => (link.style.color = "rgb(26, 140, 216)");
    link.onmouseout = () => (link.style.color = "rgb(29, 155, 240)");

    container.appendChild(link);
    return container;
  }

  // Function to hide the timeline
  function hideTimeline() {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
          [data-testid="primaryColumn"],
          [data-testid="sidebarColumn"] {
              display: none !important;
          }
      `;
    document.head.appendChild(styleSheet);
  }

  // Main function to initialize the script
  function init() {
    // Only run if we're not on a messages page
    if (!isMessagesPage()) {
      hideTimeline();
      document.body.appendChild(createProMessage());
    }
  }

  // Watch for navigation changes (for single-page app navigation)
  function watchNavigation() {
    const observer = new MutationObserver((mutations) => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        // Remove previous modifications if they exist
        const existingMessage = document.querySelector(
          'div[style*="transform: translate(-50%, -50%)"]',
        );
        if (existingMessage) {
          existingMessage.remove();
        }
        // Re-init based on new path
        init();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  let lastPath = window.location.pathname;

  // Wait for page to load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      watchNavigation();
    });
  } else {
    init();
    watchNavigation();
  }
})();
