document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".block-text h1, .block-text h2")
    .forEach((header) => {
      header.addEventListener("click", () => {
        const parent = header.closest(".block-text");
        const paragraphs = parent.querySelectorAll("p");

        // toggle accordion
        parent.classList.toggle("open");

        if (parent.classList.contains("open")) {
          // stagger reveal
          paragraphs.forEach((p, i) => {
            setTimeout(() => {
              p.classList.add("visible");
            }, i * 150); // 150ms stagger delay
          });
        } else {
          // reset instantly when closing
          paragraphs.forEach((p) => p.classList.remove("visible"));
        }
      });
    });
});
