document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const chatHistory = document.getElementById("chat-history");
    const inputContainer = document.getElementById("input-container");

    function addMessage(text, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "system-message");
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll
    }

    function startChat() {
        if (userInput.value.trim() !== "") {
            if (!chatHistory.classList.contains("expand")) {
                // Transition to Chat Stage
                chatHistory.classList.add("expand");
                chatHistory.style.height = "200px"; // Ensure height is updated
                inputContainer.classList.add("move-input");
            }

            addMessage(userInput.value, true); // User message
            userInput.value = ""; // Clear input

            // Simulate System Reply
            setTimeout(() => {
                addMessage("Hello! How can I assist you?", false);
            }, 1000);
        }
    }

    // Event Listeners
    sendBtn.addEventListener("click", startChat);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            startChat();
        }
    });

    // Auto-focus on input field
    userInput.focus();
});
