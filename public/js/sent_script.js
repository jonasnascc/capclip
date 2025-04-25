document.addEventListener("DOMContentLoaded", () => {
    const undoBtn = document.getElementById("undo")
    const userCode = sessionStorage.getItem("userCode")

    if(undoBtn) undoBtn.addEventListener("click", async () => {
        const undoButton = document.getElementById("undo")
        if(!userCode) return;

        const resp = await fetch("/undoLastClip", {
            method: "POST", 
            body: JSON.stringify({userCode}),
            headers: {
                "Content-Type": "application/json"
            },
        })

        if(resp.ok) {
            undoButton.textContent = "upload desfeito."
            undoButton.removeAttribute("onclick")
            undoButton.disabled = true
        }
    })

    const val = sessionStorage.getItem("showSentConfirmation")
    if(!val) {
        const div = document.querySelector(".videoSentPageDiv")
        div.remove()
        window.location = "/"
    }
    sessionStorage.removeItem("showSentConfirmation")
    sessionStorage.removeItem("userCode")
})