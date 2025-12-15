const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const regPass  = /^.{6,32}$/;

let registerInProgress = false;

//Validation
function sendData() {
    if (registerInProgress) {
        return;
    } else {
        registerInProgress = true;
    }

    const fname = $("#fname").val().trim();
    const lname = $("#lname").val().trim();
    const email = $("#email").val().trim();
    const pass1 = $("#pass").val().trim();
    const pass2 = $("#password2").val().trim();

    if (!fname || !lname) {
        showMessage("Please provide your First and last name.", "red");
        registerInProgress = false;
        return;
    }

    if (!regEmail.test(email)) {
        showMessage("Invalid email format.", "red");
        registerInProgress = false;
        return;
    }

    if (!regPass.test(pass1)) {
        showMessage("Your password must be between 6 to 32 characters.", "red");
        registerInProgress = false;
        return;
    }

    if (pass1 !== pass2) {
        showMessage("Passwords do not match.", "red");
        registerInProgress = false;
        return;
    }

    sendRegisterRequest(email, pass1);
}

//Register Request
function sendRegisterRequest(email, password) {
    fetch("https://reqres.in/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "reqres_1fdf06d6cdab4156a84c62cd8939fb0b"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(result => handleRegisterResponse(result.status, result.data))
    .catch(() => {
        registerInProgress = false;
        showMessage("Something went wrong. Please try again.", "red");
    });
}

//Response
function handleRegisterResponse(status, data) {
    registerInProgress = false;

    if (status === 200 && data.token) {
        window.location.href = "login.html"; //will only accept email: "..." and Pass: "..."
    } else {
        showMessage("The email provided already belongs to an account", "red");
    }
}

//UI Message
function showMessage(text, color) {
    $("#message").text(text).css("color", color);
}