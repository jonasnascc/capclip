document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.querySelector('.dropZone');
    const fileInput = document.getElementById('video_input');
    const videoPreview = document.getElementById('video_preview');

    dropZone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        dropZone.classList.add("hidden")
        videoPreview.classList.remove("hidden")
      }
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files;
        dropZone.classList.add("hidden")
        handleVideoInputChange(files[0])
        videoPreview.classList.remove("hidden")
      }
    });
})