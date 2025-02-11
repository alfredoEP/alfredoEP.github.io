document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        const response = await fetch("https://alfredoepapi.duckdns.org/authenticate", { // Update if hosted elsewhere
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert("Good! Welcome back sir.");
        } else {
            alert("Authentication failed: " + result.detail);
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
    }
});

document.querySelector(".forgot-password").addEventListener("click", async function() {
    const email = document.getElementById("email").value;
    
    if (!email) {
        alert("Please enter your email.");
        return;
    }
    
    try {
        const response = await fetch("https://alfredoepapi.duckdns.org/forgot-password", { // Update if hosted elsewhere
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert("Password reset link sent to your email.");
        } else {
            alert("Failed to send password reset link.");
        }
    } catch (error) {
        alert("An error occurred. Please try again later.");
    }
});
