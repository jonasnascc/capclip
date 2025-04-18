document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("upload_form")
    const videoInput = document.getElementById("video_input")
    const videoPreview = document.getElementById("video_preview")

    videoInput.addEventListener("change", () => {
        const file = videoInput.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        videoPreview.src = url;
        videoPreview.load();
        videoPreview.play();
    })

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        uploadVideo(form)
    });
})

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