// JavaScript code will go here
 document.addEventListener("DOMContentLoaded", function () {
    const chatLog = document.getElementById("chat-log");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        displayMessage(userMessage, "user");

        // Simulate server response
        simulateServerResponse(userMessage);
        
        userInput.value = "";
    }

    function displayMessage(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = message;
        chatLog.appendChild(messageDiv);
    }

   async function simulateServerResponse(userMessage) {
    const response = await fetch('http://localhost:8080/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
      });
      const result = await response.json();
      console.log(result)
            displayMessage(result.result|| result.message|| result, "bot");
    }
    


   
});