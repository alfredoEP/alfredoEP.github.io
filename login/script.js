document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    try {
        const response = await fetch("http://alfredoepapi/authenticate", { // Update if hosted elsewhere
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
