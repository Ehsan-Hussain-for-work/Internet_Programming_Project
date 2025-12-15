//Autentication
function getAuthToken() {
    const match = document.cookie.match(/authToken=([^;]+)/);
    if (!match) {
        window.location.href = "login.html";
        return null;
    }
    return match[1];
}

function logout() {
    document.cookie = "authToken=; max-age=0; path=/";
    window.location.href = "login.html";
}

//Make Cookie
function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=86400; path=/; SameSite=Lax`;
}

//Get Made Cookie
function getCookie(name) {
    const match = document.cookie.match(new RegExp(name + "=([^;]+)"));
    return match ? decodeURIComponent(match[1]) : null;
}

//Changes Profile Info
function editProfile() {
    const currentName = document.getElementById("username").textContent;
    const currentEmail = document.getElementById("email").textContent;

    const newName = prompt("Edit name:", currentName);
    if (!newName) return;

    const newEmail = prompt("Edit email:", currentEmail);
    if (!newEmail) return;

    document.getElementById("username").textContent = newName;
    document.getElementById("email").textContent = newEmail;

    setCookie("profileName", newName);
    setCookie("profileEmail", newEmail);
}

document.addEventListener("DOMContentLoaded", () => {
    getAuthToken();

    fetch("https://reqres.in/api/users/2", {
        headers: {
            "x-api-key": "reqres_1fdf06d6cdab4156a84c62cd8939fb0b"
        }
    })
        .then(res => res.json())
        .then(data => {
            const user = data.data;

            const savedName = getCookie("profileName");
            const savedEmail = getCookie("profileEmail");

            document.getElementById("username").textContent =
                savedName || `${user.first_name} ${user.last_name}`;

            document.getElementById("email").textContent =
                savedEmail || user.email;

            document.getElementById("member-since").textContent = "2024";
            document.getElementById("order-count").textContent = 12;
            document.getElementById("saved-count").textContent = 5;
        })
        .catch(() => {
            alert("Unable to load profile data.");
        });
});