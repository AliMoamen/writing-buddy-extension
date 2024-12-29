console.log("Writing Extension Loaded!");

// Get the content of the writing submission
const writingSubmission = document.querySelector(
  'p[style="user-select: text;"]'
).innerHTML;

// Create a new input element dynamically
const textareaElement = document.createElement("textarea");
textareaElement.innerHTML = writingSubmission;
textareaElement.style = 'height: "500px";';

// Find the reference element
const referenceElement = document.querySelector(
  'div[class="py4 undo-collapse"]'
);

// Insert the input element before the reference element
referenceElement.parentNode.insertBefore(textareaElement, referenceElement);
