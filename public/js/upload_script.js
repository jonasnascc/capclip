let validSubmit = false;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("upload_form")
    const videoInput = document.getElementById("video_input")
    const videoPreview = document.getElementById("video_preview")
    const submitButton = document.getElementById("submit_button")
    const msgPopupButton = document.getElementById("msg_popup_button")

    const codeInput = document.getElementById("code")

    submitButton.disabled = true
    msgPopupButton.disabled = true

    videoInput.addEventListener("change", () => {
        const file = videoInput.files[0];
        if (!file) {
            previewEmpty = true
            return
        };

        setValidSubmit(!!codeInput.value)
        previewEmpty = false

        const url = URL.createObjectURL(file);
        videoPreview.src = url;
        videoPreview.load();
        videoPreview.play();
    })

    codeInput.addEventListener("input", (e) => {
        const val = e.target.value

        setValidSubmit(!!val && !previewEmpty)
    })

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        uploadVideo(form)
    });
})

const setValidSubmit = (state) => {
    validSubmit = state

    const submitButton = document.getElementById("submit_button")
    const msgPopupButton = document.getElementById("msg_popup_button")

    submitButton.disabled = !state
    msgPopupButton.disabled = !state

    console.log(state)

    if(!state) setExpandMsgPopup(false)
}

async function uploadVideo(form) {
    const status = document.getElementById("send_status")

    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
        status.textContent = '⏳ Enviando...'
    });

    xhr.onload = () => {
        if (xhr.status === 200) {
            status.textContent = xhr.response.status
        } else {
            status.textContent = '❌ Erro na requisição.'
        }
    };

    xhr.onerror = () => {
        status.textContent = '❌ Erro de conexão.'
    };

    xhr.responseType = "json";
    xhr.open('POST', '/upload');
    xhr.send(formData);
}