import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';

let validSubmit = false;
let tempFiles = []

let ffmpeg = createFFmpeg();

ffmpeg.setLogger(({message}) => {
    const match = message.match(/bitrate:\s+(\d+)\s+kb\/s/)
    const durationMatch = message.match(/Duration:\s+(\d+):(\d+):(\d+\.\d+)/);
    if(match) {
        setCurrentVideoBitrate(match[1])
        console.log(match[1])
    }
    if(durationMatch) console.log(message)
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("upload_form")
    const videoInput = document.getElementById("video_input")
    const videoPreview = document.getElementById("video_preview")
    const submitButton = document.getElementById("submit_button")
    const msgPopupButton = document.getElementById("msg_popup_button")

    const codeInput = document.getElementById("code")

    updateUser()

    submitButton.disabled = true
    msgPopupButton.disabled = true

    const onVideoInputChange = async (file) => {
        if (!file) {
            previewEmpty = true
            return
        };

        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }

        const inputName = "input1.mp4"
        ffmpeg.FS('writeFile', inputName , await fetchFile(file));
        await ffmpeg.run("-i", inputName)
        tempFiles.push(inputName);

        setVideoMetrics({tamanho: `${(file.size / (1024 * 1024)).toFixed(2)} MB`})
        videoPreview.addEventListener("loadedmetadata", () => {setVideoMetrics({duracao: secsToHours(videoPreview.duration)})})

        setValidSubmit(!!codeInput.value)
        previewEmpty = false

        const url = URL.createObjectURL(file);
        videoPreview.src = url;
        await videoPreview.load();
        await videoPreview.play();
    }

    window.handleVideoInputChange = onVideoInputChange

    videoInput.addEventListener("change", async () => {
        const file = videoInput.files[0];
        onVideoInputChange(file)
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
    const status = document.getElementById("status")

    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();

    if(start > 0 || end !== videoPreview.duration) {
        const blob = await getCuttedVideoBlob()

        formData.set('video_file', blob, 'video_cortado.mp4');
    }

    xhr.upload.addEventListener('loadstart', () => {
        updateProgressBar(0)
    })

    xhr.upload.addEventListener('progress', (e) => {
        const percent = Math.round((e.loaded / e.total) * 100);
        updateProgressBar(percent)
        status.textContent = 'Enviando...'
    });

    xhr.onload = () => {
        if (xhr.status === 200) {
            status.textContent = xhr.response.message
            saveUser()
        } else if(xhr.status === 413){
            status.textContent = 'Erro: O tamanho do vídeo excede o tamanho permitido (50 MB).'
        }else {
            status.textContent = 'Erro na requisição.'
        }
        cleanFFmpeg()
    };

    xhr.onerror = () => {
        status.textContent = 'Erro de conexão.'
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

    tempFiles.push(inputName, outputName);

    ffmpeg.FS('writeFile', inputName, await fetchFile(file));

    ffmpeg.setProgress(({ ratio }) => {
        const percent = Math.round(ratio * 100);
        updateProgressBar(percent);
    });

    await ffmpeg.run(
        '-i', inputName,
        '-ss', String(start),
        '-to', String(end),
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'ultrafast',
        outputName
    );

    const data = ffmpeg.FS('readFile', outputName);
    return new Blob([data.buffer], { type: 'video/mp4' });
}

async function cleanFFmpeg() {
    for (const filename of tempFiles) {
        try {
            ffmpeg.FS('unlink', filename);
        } catch (err) {
            console.warn(`Failed to delete ${filename}:`, err);
        }
    }

    tempFiles = [];

    await ffmpeg.exit();
    ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
}


function updateProgressBar(percent) {
    const status = document.getElementById("status")
    const bar = document.getElementById('status_progress');
    if(percent < 99) {
        status.textContent = "Processando vídeo..."
    }
    if (bar) {
        bar.style.width = `${percent}%`;
        bar.textContent = `${percent}%`;
    }
}