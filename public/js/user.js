function saveUser() {
    const codeInput = document.getElementById("code");
    localStorage.setItem("userCode", JSON.stringify({ code: codeInput.value.trim() }));
}

function updateUser() {
    const codeInput = document.getElementById("code");
    
    const saved = localStorage.getItem("userCode");
    if (!saved) return;

    const user = JSON.parse(saved);
    codeInput.value = user.code;
}