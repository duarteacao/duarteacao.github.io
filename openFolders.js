document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(".toggle");
  const pagesDivs = Array.from(document.querySelectorAll(".pages > div"));

  function isTopLevelToggle(toggle) {
    const topDiv = toggle.closest(".pages > div");
    return topDiv && topDiv.querySelector(".toggle") === toggle;
  }

  function getRightPageSiblings(currentDiv) {
    const index = pagesDivs.indexOf(currentDiv);
    return pagesDivs.slice(index + 1);
  }

  function getRightNestedSiblings(toggle) {
    const currentSection = toggle.closest(".section");
    const parent = toggle.closest(".mediaRow");
    if (!parent || !currentSection) return [];

    const children = Array.from(parent.children);
    const index = children.indexOf(currentSection);
    return children.slice(index + 1).filter((el) => el.classList.contains("section"));
  }

  function fadeElements(elements, fadeOut = true) {
    return new Promise((resolve) => {
      if (elements.length === 0) return resolve();

      let completed = 0;

      function onEnd(e) {
        if (e.propertyName !== "opacity") return;
        e.target.removeEventListener("transitionend", onEnd);
        completed++;
        if (completed === elements.length) {
          resolve();
        }
      }

      elements.forEach((el) => {
        el.style.transition = "opacity 0.2s ease";
        el.addEventListener("transitionend", onEnd);
        el.style.opacity = fadeOut ? "0" : "1";
      });
    });
  }

  function animateContentOpen(content) {
    return new Promise((resolve) => {
      content.style.overflow = "hidden";
      content.style.maxHeight = "0px";
      content.style.opacity = "0";

      void content.offsetHeight;

      content.style.transition = "max-height 0.4s ease, opacity 0.3s ease";
      const fullHeight = content.scrollHeight;

      requestAnimationFrame(() => {
        content.style.maxHeight = fullHeight + "px";
        content.style.opacity = "1";
      });

      content.addEventListener("transitionend", function handler(e) {
        if (e.propertyName === "max-height") {
          content.removeEventListener("transitionend", handler);
          content.style.maxHeight = "none";
          content.style.overflow = "";
          content.style.transition = "";
          resolve();
        }
      });
    });
  }

  function animateContentClose(content) {
    return new Promise((resolve) => {
      const fullHeight = content.scrollHeight;
      content.style.overflow = "hidden";
      content.style.maxHeight = fullHeight + "px";
      content.style.opacity = "1";

      void content.offsetHeight;

      content.style.transition = "max-height 0.4s ease, opacity 0.3s ease";

      requestAnimationFrame(() => {
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
      });

      content.addEventListener("transitionend", function handler(e) {
        if (e.propertyName === "max-height") {
          content.removeEventListener("transitionend", handler);
          content.style.maxHeight = "";
          content.style.overflow = "";
          content.style.transition = "";
          resolve();
        }
      });
    });
  }

  function scrollWithMarginAndWait(element, marginLeft = 100) {
    return new Promise((resolve) => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targetLeft = element.getBoundingClientRect().left + window.pageXOffset;
      const scrollTarget = Math.max(0, targetLeft - marginLeft);

      if (prefersReducedMotion) {
        window.scrollTo({ left: scrollTarget, behavior: "auto" });
        resolve();
        return;
      }

      let timeout;
      function done() {
        clearTimeout(timeout);
        window.removeEventListener("scroll", onScroll);
        resolve();
      }

      function onScroll() {
        clearTimeout(timeout);
        timeout = setTimeout(done, 100);
      }

      window.addEventListener("scroll", onScroll);
      window.scrollTo({ left: scrollTarget, behavior: "smooth" });
      onScroll();
    });
  }

  async function openContent(toggle, content) {
    if (toggle.classList.contains("animating")) return;
    toggle.classList.add("animating");

    const thisPageDiv = toggle.closest(".pages > div");
    const thisSection = toggle.closest(".section");
    const isTop = isTopLevelToggle(toggle);
    const rightPageSiblings = getRightPageSiblings(thisPageDiv);
    const rightNestedSiblings = isTop ? [] : getRightNestedSiblings(toggle);
    const allToFade = [...rightPageSiblings, ...rightNestedSiblings];

    await fadeElements(allToFade, true);

    toggle.classList.add("open");
    content.classList.add("open");

    await animateContentOpen(content);

    const scrollTarget = isTop ? thisPageDiv : thisSection;
    if (scrollTarget) {
      await scrollWithMarginAndWait(scrollTarget, 200);
    }

    await fadeElements(allToFade, false);
    toggle.classList.remove("animating");
  }

  async function closeContent(toggle, content) {
    if (toggle.classList.contains("animating")) return;
    toggle.classList.add("animating");

    const thisPageDiv = toggle.closest(".pages > div");
    const thisSection = toggle.closest(".section");
    const isTop = isTopLevelToggle(toggle);
    const rightPageSiblings = getRightPageSiblings(thisPageDiv);
    const rightNestedSiblings = isTop ? [] : getRightNestedSiblings(toggle);
    const allToFade = [...rightPageSiblings, ...rightNestedSiblings];

    const scrollTarget = isTop ? thisPageDiv : thisSection;
    if (scrollTarget) {
      await scrollWithMarginAndWait(scrollTarget, 1500);
    }

    await fadeElements(allToFade, true);
    await animateContentClose(content);

    toggle.classList.remove("open");
    content.classList.remove("open");

    await fadeElements(allToFade, false);
    toggle.classList.remove("animating");
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", async (event) => {
      event.stopPropagation();

      const content = toggle.nextElementSibling;
      if (!content || !content.classList.contains("content")) return;

      const isOpen = content.classList.contains("open");

      if (isOpen) {
        await closeContent(toggle, content);
      } else {
        await openContent(toggle, content);
      }
    });
  });

  document.addEventListener("click", async (event) => {
    let clickedInside = false;

    document.querySelectorAll(".content.open").forEach((openContent) => {
      if (openContent.contains(event.target)) {
        clickedInside = true;
      }
    });

    if (clickedInside) return;

    for (const toggle of toggles) {
      const content = toggle.nextElementSibling;
      if (content && content.classList.contains("open")) {
        await closeContent(toggle, content);
      }
    }
  });
});
