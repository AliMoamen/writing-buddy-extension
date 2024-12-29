console.log("Writing Extension Loaded!");

// Get the content of the writing submission
const writingSubmission = document.querySelectorAll(
  'p[style="user-select: text;"]'
)[1].innerText;

// Create a new textarea element dynamically
const textareaElement = document.createElement("textarea");
textareaElement.innerHTML = writingSubmission;

// Set the dimensions of the textarea
textareaElement.style.height = "300px";
textareaElement.style.width = "100%";

// Create a reset button
const resetButton = document.createElement("button");
resetButton.textContent = "Reset to Original Submission";
resetButton.style.marginBottom = "10px"; // Add some spacing

resetButton.style.display = "block"; // Make it appear on a new line

// Add a click event listener to reset the textarea content
resetButton.addEventListener("click", () => {
  textareaElement.value = writingSubmission;
});

// Find the reference element
const referenceElement = document.querySelector(
  'div[class="py4 undo-collapse"]'
);

referenceElement.parentNode.insertBefore(resetButton, referenceElement);
referenceElement.parentNode.insertBefore(textareaElement, referenceElement);
