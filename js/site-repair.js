(function () {
  "use strict";

  if (window.__portfolioRepairLoaded) return;
  window.__portfolioRepairLoaded = true;

  var doc = document;
  var body = doc.body;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nativeScroll = reducedMotion ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
    window.innerWidth <= 1024;

  window.ga = window.ga || function () {};

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (nativeScroll && body) {
    body.classList.remove("smooth-scroll");
  }

  function decodeCloudflareEmail(value) {
    if (!value || value.length < 4) return "";
    var key = parseInt(value.slice(0, 2), 16);
    var output = "";
    for (var index = 2; index < value.length; index += 2) {
      output += String.fromCharCode(parseInt(value.slice(index, index + 2), 16) ^ key);
    }
    try {
      return decodeURIComponent(escape(output));
    } catch (error) {
      return output;
    }
  }

  function showFormMessage(message, isError) {
    var element = doc.getElementById("message");
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("form-error", Boolean(isError));
    element.classList.toggle("form-success", !isError);
    element.style.display = "block";
  }

  function prepareContact() {
    var emailLink = doc.querySelector("[data-contact-email]");
    var emailNode = emailLink && emailLink.querySelector("[data-cfemail]");
    var recipient = emailNode ? decodeCloudflareEmail(emailNode.getAttribute("data-cfemail")) : "";

    if (emailLink && recipient) {
      emailNode.textContent = recipient;
      emailLink.setAttribute("href", "mailto:" + recipient);
    }

    doc.addEventListener("submit", function (event) {
      var form = event.target;
      if (!form || form.id !== "contactform") return;

      event.preventDefault();
      event.stopImmediatePropagation();

      var name = (doc.getElementById("name") || {}).value || "";
      var replyTo = (doc.getElementById("email") || {}).value || "";
      var comments = (doc.getElementById("comments") || {}).value || "";

      name = name.trim();
      replyTo = replyTo.trim();
      comments = comments.trim();

      if (!name || !replyTo || !comments) {
        showFormMessage("Please complete your name, email, and project details.", true);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) {
        showFormMessage("Please enter a valid email address.", true);
        return;
      }

      if (!recipient) {
        showFormMessage("Email is temporarily unavailable. Please use the email link instead.", true);
        return;
      }

      var subject = encodeURIComponent("Portfolio inquiry from " + name);
      var message = encodeURIComponent(
        "Name: " + name + "\n" +
        "Reply-to: " + replyTo + "\n\n" +
        comments
      );

      showFormMessage("Opening your email app…", false);
      window.location.href = "mailto:" + recipient + "?subject=" + subject + "&body=" + message;
    }, true);
  }

  function markUnavailableVideo(video) {
    if (!video || video.dataset.fallbackReady === "true") return;
    video.dataset.fallbackReady = "true";

    var hero = video.closest(".hero-video-wrapper");
    var wrapper = video.closest(".video-wrapper");

    if (hero) {
      hero.classList.add("media-fallback");
      video.setAttribute("aria-hidden", "true");
      video.removeAttribute("controls");
    }

    if (wrapper) {
      wrapper.classList.add("media-fallback");
      video.setAttribute("aria-hidden", "true");
      video.removeAttribute("controls");

      var cover = wrapper.querySelector(".video-cover");
      if (cover) {
        cover.classList.remove("hidden");
        cover.setAttribute("aria-label", "Static preview");
      }

      if (!wrapper.querySelector(".media-fallback-label")) {
        var label = doc.createElement("span");
        label.className = "media-fallback-label";
        label.textContent = "Motion preview";
        wrapper.appendChild(label);
      }
    }
  }

  function prepareMedia() {
    Array.prototype.forEach.call(doc.querySelectorAll("video"), function (video) {
      var sources = video.querySelectorAll("source[src]");
      if (!sources.length && !video.getAttribute("src")) {
        markUnavailableVideo(video);
        return;
      }

      var failures = 0;
      Array.prototype.forEach.call(sources, function (source) {
        source.addEventListener("error", function () {
          failures += 1;
          if (failures >= sources.length && video.readyState === 0) {
            markUnavailableVideo(video);
          }
        }, { once: true });
      });

      window.setTimeout(function () {
        if (video.readyState === 0) markUnavailableVideo(video);
      }, 2500);

      if (reducedMotion) {
        video.removeAttribute("autoplay");
        video.pause();
      }
    });

    Array.prototype.forEach.call(doc.querySelectorAll("img"), function (image) {
      image.setAttribute("decoding", "async");
      if (!image.closest("#hero") && !image.classList.contains("black-logo") && !image.classList.contains("white-logo")) {
        image.setAttribute("loading", "lazy");
      }
    });
  }

  function forceReady() {
    if (!body) return;
    body.classList.add("site-force-ready");
    body.classList.remove("hidden", "show-loader", "page-is-changing", "site-leaving");

    var main = doc.getElementById("main");
    if (main) main.style.opacity = "1";

    var preloader = doc.querySelector(".preloader-wrap");
    if (preloader) preloader.setAttribute("aria-hidden", "true");
  }

  function navigate(event) {
    if (event.defaultPrevented && !event.target.closest("[data-type='page-transition']")) return;
    if (event.button && event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest("a[data-type='page-transition']");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    var url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (body.classList.contains("site-leaving")) return;

    body.classList.add("site-leaving", "page-is-changing");

    var isProjectTransition = link.classList.contains("ajax-link-project") ||
      link.classList.contains("next-ajax-link-project") ||
      link.closest("#showcase-holder");

    var delay = reducedMotion ? 0 : (isProjectTransition ? 620 : 420);
    window.setTimeout(function () {
      window.location.assign(url.href);
    }, delay);
  }

  function ownNavigation() {
    if (!body) return;

    if (window.jQuery) {
      window.jQuery("body").off("click", "[data-type='page-transition']");
    }

    body.removeEventListener("click", navigate);
    body.addEventListener("click", navigate);
  }

  function updateCopyrightYear() {
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(doc.querySelectorAll(".copyright"), function (node) {
      node.innerHTML = node.innerHTML.replace(/\b2020\s*©/, year + " ©");
    });
  }

  function guardPairedTransition(name, isComplete) {
    var original = window[name];
    if (typeof original !== "function") return;

    window[name] = function () {
      if (!isComplete()) return;
      return original.apply(this, arguments);
    };
  }

  guardPairedTransition("FitThumbScreen", function () {
    return doc.querySelectorAll(".thumb-page").length >= doc.querySelectorAll(".item-image").length;
  });

  guardPairedTransition("FitSlideScreen", function () {
    return doc.querySelectorAll(".thumb-page").length >= doc.querySelectorAll(".section-image").length;
  });

  guardPairedTransition("FitQuickScreen", function () {
    var projects = doc.querySelectorAll("#quick-projects li").length;
    return doc.querySelectorAll(".thumb-page").length >= projects &&
      doc.querySelectorAll(".hover-reveal__img").length >= projects;
  });

  prepareContact();
  prepareMedia();
  updateCopyrightYear();

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", function () {
      window.setTimeout(ownNavigation, 0);
      window.setTimeout(ownNavigation, 150);
      window.setTimeout(forceReady, reducedMotion ? 0 : 900);
    }, { once: true });
  } else {
    ownNavigation();
    window.setTimeout(forceReady, reducedMotion ? 0 : 900);
  }

  window.addEventListener("pageshow", function () {
    if (!body) return;
    body.classList.remove("site-leaving", "page-is-changing", "show-loader");
    ownNavigation();
  });

  window.addEventListener("load", function () {
    window.setTimeout(forceReady, reducedMotion ? 0 : 350);
  }, { once: true });

  window.setTimeout(forceReady, 1800);
})();
