const video = document.getElementById('video');
const predText = document.getElementById('prediction');

// Ask for webcam access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream })
  .catch(err => console.error("Camera error:", err));

// Send one frame per second to backend
setInterval(() => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d').drawImage(video, 0, 0);
  canvas.toBlob(blob => {
    const formData = new FormData();
    formData.append('frame', blob);

    // ❗ replace localhost with your friend’s IP later
    fetch('http://127.0.0.1:5000/predict', { 
      method: 'POST', 
      body: formData 
    })
    .then(res => res.json())
    .then(data => {
      predText.innerText = "Prediction: " + data.prediction;
    })
    .catch(err => console.error("Error:", err));
  }, 'image/jpeg');
}, 1000); // 1 frame per second
