let video = document.querySelector(".video"); 
let recordBtnCont = document.querySelector(".record-btn-cont"); 
let recordBtn = document.querySelector(".record-btn"); 
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn"); 
let recordFlag = false; 
let transparentColor = "transparent";
let recorder; 
let chunks = []; 
let constraints = {
    audio: false,
    video: true,
} 

navigator.mediaDevices.getUserMedia(constraints) 
.then((stream) => {
    video.srcObject = stream;
    recorder = new MediaRecorder(stream); 
    
    recorder.addEventListener("start", (e) => {
        chunks = [];
    }); 
    
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    }); 
    
    recorder.addEventListener("stop", (e) => {
        let blob = new Blob(chunks, {type: "video/mp4"}); 
        let videoURL = URL.createObjectURL(blob); 
        let a = document.createElement('a'); 
        a.href = videoURL; 
        a.download = "stream.mp4"; 
        a.click();
    }); 
    
    recordBtnCont.addEventListener("click", (e) => {
        if (!recorder) return;
        recordFlag = !recordFlag; 
        if (recordFlag) {
            recorder.start(); 
            recordBtn.classList.add("scale-record");
            startTimer();  // Start the timer
        } else {
            recorder.stop(); 
            recordBtn.classList.remove("scale-record");
            stopTimer();  // Stop the timer
        }
    });
});

captureBtnCont.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture"); 
    let canvas = document.createElement("canvas"); 
    canvas.width = video.videoWidth; 
    canvas.height = video.videoHeight;
    let imageURL = canvas.toDataURL("image/jpeg"); 
    let tool = canvas.getContext("2d"); 
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);  
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);
    
    let a = document.createElement('a'); 
    a.href = imageURL; 
    a.download = "Image.jpg"; 
    a.click(); 
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 500);
});

let filterLayer = document.querySelector(".filter-layer"); 
let allFilters = document.querySelectorAll(".filter"); 

allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color"); 
        filterLayer.style.backgroundColor = transparentColor;
    });
});

let timer = document.querySelector(".timer");  
let timerId;
let counter = 0;

function startTimer() {
    timer.style.display = "block"; 
    function displayTimer() {
        let totalSeconds = counter;
        let hours = Math.floor(totalSeconds / 3600); 
        totalSeconds %= 3600; 
        let minutes = Math.floor(totalSeconds / 60); 
        let seconds = totalSeconds % 60; 
        hours = (hours < 10) ? `0${hours}` : hours; 
        minutes = (minutes < 10) ? `0${minutes}` : minutes; 
        seconds = (seconds < 10) ? `0${seconds}` : seconds; 
        timer.innerText = `${hours}:${minutes}:${seconds}`; 
        counter++;
    } 
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId); 
    counter = 0;
    timer.innerText = "00:00:00"; 
    timer.style.display = "none";
}
