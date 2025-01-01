console.log(document.querySelectorAll('p[style="user-select: text;"]'));
// Get the content of the writing submission
const writingSubmission =
  document.querySelectorAll('p[style="user-select: text;"]')[3]?.innerText ||
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
  textareaElement.value = writingSubmission;

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

  // Analysis panel
  const analysisPanel = document.createElement("div");
  analysisPanel.style.marginBottom = "15px";
  analysisPanel.style.display = "grid";
  analysisPanel.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(200px, 1fr))";
  analysisPanel.style.gap = "10px";

  // Writing patterns
  const patterns = {
    transitionWords:
      /\b(furthermore|moreover|however|therefore|consequently|additionally|nevertheless|in\s+addition|on\s+the\s+other\s+hand|in\s+conclusion)\b/gi,
  };

  // Update analysis function
  const updateAnalysis = () => {
    const text = textareaElement.value;

    // Basic statistics
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean);

    // Readability
    const syllableCount = words.reduce(
      (count, word) => count + countSyllables(word),
      0
    );
    const fleschKincaid = (
      0.39 * (words.length / sentences.length) +
      11.8 * (syllableCount / words.length) -
      15.59
    ).toFixed(1);

    // Vocabulary diversity
    const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
    const vocabularyDiversity = (
      (uniqueWords.size / words.length) *
      100
    ).toFixed(1);

    // Transition words analysis
    const transitionWordsMatches = text.match(patterns.transitionWords) || [];
    const transitionWordsPercentage = (
      (transitionWordsMatches.length / sentences.length) *
      100
    ).toFixed(1);

    // Update basic stats panel
    analysisPanel.innerHTML = `
      <div class="stat-item">Words: ${words.length}</div>
      <div class="stat-item">Sentences: ${sentences.length}</div>
      <div class="stat-item">Paragraphs: ${paragraphs.length}</div>
      <div class="stat-item">Readability Grade: ${fleschKincaid}</div>
      <div class="stat-item">Vocabulary Diversity: ${vocabularyDiversity}%</div>
      <div class="stat-item">Transition Words Frequency: ${transitionWordsPercentage}%</div>
    `;

    // Style stat items
    Array.from(analysisPanel.children).forEach((item) => {
      Object.assign(item.style, {
        padding: "8px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        textAlign: "center",
      });
    });
  };

  // Helper function to estimate syllables
  function countSyllables(word) {
    word = word.toLowerCase();
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }

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
    preview: createButton("Preview", "#007bff", "#0056b3"),
  };

  // Add button functionality
  buttons.reset.addEventListener("click", () => {
    if (
      confirm("Are you sure you want to reset? This action cannot be undone.")
    ) {
      textareaElement.value = writingSubmission;
      updateAnalysis();
    }
  });

  buttons.preview.addEventListener("click", () => {
    const popup = window.open("", "PreviewWindow", "width=800,height=600");
    popup.document.write(`
      <html>
        <head>
          <title>Preview</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
              background-color: #f8f9fa;
            }
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              border: 1px solid #ced4da;
              padding: 15px;
              border-radius: 4px;
              background-color: #fff;
            }
          </style>
        </head>
        <body>
          <h1>Preview</h1>
          <pre>${writingSubmission}</pre>
          <button onclick="window.close()" style="
            background-color: #dc3545; 
            color: #fff; 
            border: none; 
            padding: 10px 20px; 
            cursor: pointer; 
            border-radius: 5px;
          ">Close</button>
        </body>
      </html>
    `);
  });

  // Add buttons to tools panel
  Object.values(buttons).forEach((button) => toolsPanel.appendChild(button));

  // Event listeners
  textareaElement.addEventListener("input", () => {
    updateAnalysis();
  });

  // Assemble the UI
  container.appendChild(toolsPanel);
  container.appendChild(textareaElement);
  container.appendChild(analysisPanel);

  // Initial analysis update
  updateAnalysis();

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
