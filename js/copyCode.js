function initClipboard() {
  // Initialize Clipboard.js
  new ClipboardJS("#copy-button");

  // Show a message indicating that the command was copied
  var copyButton = document.getElementById("copy-button");
  copyButton.addEventListener("click", () => {
    copyButton.innerText = "Copied!";
    setTimeout(() => {
      copyButton.innerText = "Copy to Clipboard";
    }, 3000);
  });
}
