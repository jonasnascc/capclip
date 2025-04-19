const expandIcon = `<i class="bi bi-chevron-up"></i>`
const decreaseIcon = `<i class="bi bi-chevron-down"></i>`

let msgPopupExpanded = false

document.addEventListener("DOMContentLoaded", () => {
    const msgPopupButton = document.getElementById("msg_popup_button")
    const msgPopup = document.getElementById("msg_popup")

    const msgPopupBody = document.getElementById("msg_popup_body")

    msgPopupButton.innerHTML = `<span>DESCRIÇÃO + ENVIAR</span>${expandIcon}`

    msgPopupButton.addEventListener("click", () => {
        msgPopupExpanded = !msgPopupExpanded

        msgPopup.style.visibility = msgPopupExpanded ? "visible" : "hidden"
        msgPopup.style.opacity = msgPopupExpanded ? 100 : 0

        msgPopupButton.innerHTML = `<span>DESCRIÇÃO + ENVIAR</span>${msgPopupExpanded ? decreaseIcon : expandIcon}`
    })
})