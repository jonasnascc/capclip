import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';

let validSubmit = false;

// const ffmpeg = createFFmpeg({ log: true });
let ffmpeg = createFFmpeg();

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

    if(!state) setExpandMsgPopup(false)
}

const uploadVideo = async (form) => {
    const videoPreview = document.getElementById("video_preview")
    // const status = document.getElementById("send_status")

    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();

    if(start > 0 || end !== videoPreview.duration) {
        const blob = await getCuttedVideoBlob()

        formData.set('video_file', blob, 'video_cortado.mp4');
    }

    xhr.upload.addEventListener('progress', (e) => {
        // status.textContent = '⏳ Enviando...'
    });

    xhr.onload = () => {
        if (xhr.status === 200) {
            // status.textContent = xhr.response.status
            const files = ffmpeg.FS('readdir', '/');
            files.forEach(file => {
                if (file !== '.' && file !== '..') {
                    ffmpeg.FS('unlink', file);
                }
            });
            (async () => {
                ffmpeg.exit();
                ffmpeg = createFFmpeg();
                await ffmpeg.load();
            })();
        } else {
            // status.textContent = '❌ Erro na requisição.'
        }
    };

    xhr.onerror = () => {
        // status.textContent = '❌ Erro de conexão.'
    };

    xhr.responseType = "json";
    xhr.open('POST', '/upload');
    xhr.send(formData);
}

const getCuttedVideoBlob = async () => {
    const videoInput = document.getElementById("video_input")
    if(!videoInput) return null;

    const file = videoInput.files[0];

    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    ffmpeg.FS('writeFile', inputName, await fetchFile(file));

    await ffmpeg.run(
        '-i', inputName,
        '-ss', String(start),
        '-to', String(end),
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-strict', 'experimental',
        '-preset', 'ultrafast',
        outputName
    );

    const data = ffmpeg.FS('readFile', outputName);
    return new Blob([data.buffer], { type: 'video/mp4' });
}