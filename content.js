console.log("Enhanced Writing Extension Loaded!");

// Get the content of the writing submission
const writingSubmission =
  document.querySelectorAll('p[style="user-select: text;"]')[1]?.innerText ||
  "";

if (!writingSubmission) {
  console.error("Writing submission not found.");
} else {
  // Create the main container
  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.backgroundColor = "#f8f9fa";
  container.style.borderRadius = "8px";
  container.style.marginBottom = "20px";

  // Create textarea with enhanced styling
  const textareaElement = document.createElement("textarea");
  textareaElement.value =
    localStorage.getItem("writingSubmissionAutosave") || writingSubmission;

  // Enhanced textarea styling
  Object.assign(textareaElement.style, {
    height: "300px",
    width: "100%",
    border: "1px solid #ced4da",
    padding: "15px",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: "14px",
    lineHeight: "1.6",
    borderRadius: "4px",
    resize: "vertical",
    marginBottom: "15px",
  });

  // Statistics panel
  const statsPanel = document.createElement("div");
  statsPanel.style.marginBottom = "15px";
  statsPanel.style.display = "grid";
  statsPanel.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
  statsPanel.style.gap = "10px";

  // Update statistics function
  const updateStats = () => {
    const text = textareaElement.value;
    const words = text.split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute

    statsPanel.innerHTML = `
      <div class="stat-item">Words: ${words}</div>
      <div class="stat-item">Characters: ${characters}</div>
      <div class="stat-item">Sentences: ${sentences}</div>
      <div class="stat-item">Paragraphs: ${paragraphs}</div>
      <div class="stat-item">Reading Time: ~${readingTime} min</div>
    `;

    // Style stat items
    Array.from(statsPanel.children).forEach((item) => {
      Object.assign(item.style, {
        padding: "8px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        textAlign: "center",
      });
    });
  };

  // Tools panel
  const toolsPanel = document.createElement("div");
  toolsPanel.style.marginBottom = "15px";

  // Create button helper function
  const createButton = (text, color, hoverColor) => {
    const button = document.createElement("button");
    button.textContent = text;
    Object.assign(button.style, {
      backgroundColor: color,
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      borderRadius: "5px",
      margin: "0 5px",
      transition: "background-color 0.2s",
    });
    button.addEventListener(
      "mouseover",
      () => (button.style.backgroundColor = hoverColor)
    );
    button.addEventListener(
      "mouseout",
      () => (button.style.backgroundColor = color)
    );
    return button;
  };

  // Create toolbar buttons
  const buttons = {
    reset: createButton("Reset", "#dc3545", "#c82333"),
    preview: createButton("Preview", "#28a745", "#218838"),
    save: createButton("Save Draft", "#007bff", "#0056b3"),
    format: createButton("Format Text", "#6610f2", "#520dc2"),
    findReplace: createButton("Find/Replace", "#fd7e14", "#dc6502"),
  };

  // Add button functionality
  buttons.reset.addEventListener("click", () => {
    if (
      confirm("Are you sure you want to reset? This action cannot be undone.")
    ) {
      textareaElement.value = writingSubmission;
      localStorage.removeItem("writingSubmissionAutosave");
      updateStats();
    }
  });

  buttons.preview.addEventListener("click", () => {
    const modal = document.createElement("div");
    Object.assign(modal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      maxHeight: "80vh",
      overflow: "auto",
      padding: "30px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      zIndex: "1000",
      borderRadius: "8px",
    });

    const content = document.createElement("div");
    content.innerHTML = textareaElement.value.replace(/\n/g, "<br>");
    content.style.lineHeight = "1.6";

    const closeButton = createButton("Close", "#dc3545", "#c82333");
    closeButton.style.marginTop = "20px";
    closeButton.addEventListener("click", () =>
      document.body.removeChild(modal)
    );

    modal.appendChild(content);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  });

  buttons.save.addEventListener("click", () => {
    const timestamp = new Date().toISOString();
    const draft = {
      content: textareaElement.value,
      timestamp: timestamp,
    };

    let drafts = JSON.parse(localStorage.getItem("writingDrafts") || "[]");
    drafts.push(draft);
    localStorage.setItem("writingDrafts", JSON.stringify(drafts));
    alert("Draft saved successfully!");
  });

  buttons.format.addEventListener("click", () => {
    let text = textareaElement.value;
    // Basic text formatting
    text = text.replace(/\s+/g, " "); // Remove extra spaces
    text = text.replace(/\n{3,}/g, "\n\n"); // Normalize paragraphs
    text = text.replace(/([.!?])\s*(?=\w)/g, "$1 "); // Ensure space after punctuation
    textareaElement.value = text.trim();
    updateStats();
  });

  buttons.findReplace.addEventListener("click", () => {
    const findReplaceModal = document.createElement("div");
    Object.assign(findReplaceModal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      zIndex: "1000",
      borderRadius: "8px",
    });

    findReplaceModal.innerHTML = `
      <div style="margin-bottom: 15px;">
        <input type="text" id="findText" placeholder="Find" style="margin-right: 10px; padding: 5px;">
        <input type="text" id="replaceText" placeholder="Replace with" style="padding: 5px;">
      </div>
    `;

    const replaceButton = createButton("Replace All", "#007bff", "#0056b3");
    replaceButton.addEventListener("click", () => {
      const findText = document.getElementById("findText").value;
      const replaceText = document.getElementById("replaceText").value;
      if (findText) {
        const regex = new RegExp(findText, "g");
        textareaElement.value = textareaElement.value.replace(
          regex,
          replaceText
        );
        updateStats();
      }
    });

    const closeButton = createButton("Close", "#dc3545", "#c82333");
    closeButton.addEventListener("click", () =>
      document.body.removeChild(findReplaceModal)
    );

    findReplaceModal.appendChild(replaceButton);
    findReplaceModal.appendChild(closeButton);
    document.body.appendChild(findReplaceModal);
  });

  // Add buttons to tools panel
  Object.values(buttons).forEach((button) => toolsPanel.appendChild(button));

  // Event listeners
  textareaElement.addEventListener("input", () => {
    updateStats();
    localStorage.setItem("writingSubmissionAutosave", textareaElement.value);
  });

  // Assemble the UI
  container.appendChild(toolsPanel);
  container.appendChild(textareaElement);
  container.appendChild(statsPanel);

  // Initial stats update
  updateStats();

  // Insert into the page
  const referenceElement = document.querySelector(
    'div[class="py4 undo-collapse"]'
  );
  if (!referenceElement) {
    console.error("Reference element not found.");
  } else {
    referenceElement.parentNode.insertBefore(container, referenceElement);
  }
}
