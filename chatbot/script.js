document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const chatHistory = document.getElementById("chat-history");
    const inputContainer = document.getElementById("input-container");

    function addMessage(text, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "system-message");
        messageDiv.textContent = text; // Use textContent to preserve formatting
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll
    }

    function startChat() {
        if (userInput.value.trim() !== "") {
            // Calculate available height for chat history
            const availableHeight = window.innerHeight - inputContainer.offsetHeight - 40; // 40px for margins
            const adjustedHeight = availableHeight * 0.98; // Reduce height by 2%
            chatHistory.style.height = `${adjustedHeight}px`; // Set height dynamically
            inputContainer.classList.add("move-input");

            addMessage(userInput.value, true); // User message
            userInput.value = ""; // Clear input

            // Simulate System Reply
            setTimeout(() => {
                addMessage("Hello! How can I assist you?", false);
            }, 200);
        }
    }

    // Event Listeners
    sendBtn.addEventListener("click", startChat);
    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            startChat();
            event.preventDefault(); // Prevent default behavior
        }
    });

    // Auto-focus on input field
    userInput.focus();
});
