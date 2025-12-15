const regEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const regPass  = /^.{6,32}$/;

var loginInProgress = false;

//Entry Point
function sendData() {
	if (loginInProgress) return;
	loginInProgress = true;

	var email = $("#email").val().trim();
	var pass  = $("#pass").val().trim();

	if (!regEmail.test(email) || !regPass.test(pass)) {
		showMessage("Invalid email or password format.", "red");
		loginInProgress = false;
		return;
	}

	sendLoginRequest(email, pass);
}

//Login Request
function sendLoginRequest(email, password) {

	fetch("https://reqres.in/api/login", {
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
	.then(function (response) {
		return response.json().then(function (data) {
			return {
				status: response.status,
				data: data
			};
		});
	})
	.then(function (result) {
		handleResponse(result.status, result.data);
	})
	.catch(function () {
		loginInProgress = false;
		showMessage("Network error. Please try again.", "red");
	});
}

//Response Handler
function handleResponse(status, data) {
	loginInProgress = false;

	if (status === 200 && data.token) {
		saveTokenCookie(data.token);
		window.location.href = "profile.html";
	} else {
		showMessage(data.error || "Login failed.", "red");
	}
}

//UI Message
function showMessage(text, color) {
	$("#message").text(text).css("color", color);
}

//Cookies
function saveTokenCookie(token) {
	document.cookie =
		"authToken=" + token + "; max-age=3600; path=/; " + 
		"SameSite=Lax";
}