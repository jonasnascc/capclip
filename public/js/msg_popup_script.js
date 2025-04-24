const expandIcon = `<i class="bi bi-chevron-up"></i>`
const decreaseIcon = `<i class="bi bi-chevron-down"></i>`

let msgPopupExpanded = false

document.addEventListener("DOMContentLoaded", () => {
    const msgPopupButton = document.getElementById("msg_popup_button")
    const msgPopup = document.getElementById("msg_popup")
    const closePopupBtn = document.getElementById("close_popup_btn")

    msgPopupButton.innerHTML = `<span>DESCRIÇÃO + ENVIAR</span>${expandIcon}`

    msgPopup.addEventListener("click", (e) => {
        e.stopPropagation()
    })

    msgPopupButton.addEventListener("click", (e) => {
        e.stopPropagation()
        setExpandMsgPopup(!msgPopupExpanded)
    })

    closePopupBtn.addEventListener('click', () => {
        setExpandMsgPopup(false)
    })

    document.addEventListener('click', (e) => {
        if (!msgPopup.contains(e.target) && !msgPopupButton.contains(e.target)) {
            setExpandMsgPopup(false)
        }
    });
})

const setExpandMsgPopup = (state) => {
    const msgPopupButton = document.getElementById("msg_popup_button")
    const msgPopup = document.getElementById("msg_popup")

    msgPopup.style.visibility = state ? "visible" : "hidden"
    msgPopup.style.opacity = state ? 100 : 0

    msgPopupButton.innerHTML = `<span>DESCRIÇÃO + ENVIAR</span>${state ? decreaseIcon : expandIcon}`

    msgPopupExpanded = state;
}