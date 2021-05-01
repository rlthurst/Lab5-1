// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');

const form = document.getElementById('generate-meme');
const input = document.getElementById('image-input');
const top = document.getElementById('text-top');
const bottom = document.getElementById('text-bottom');

const reset = document.querySelector("[type='reset']");
const button = document.querySelector("[type='button']");
const submit = document.querySelector("[type='submit']");
const voiceSelect = document.getElementById('voice-selection');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";
  context.fillRect(0,0,400,400);
  var dim = getDimmensions(400, 400, img.width, img.height);
  context.drawImage(img, dim['startX'], dim['startY'], dim['width'], dim['height']);
  submit.disabled = false;
});

input.addEventListener('change', () => {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = input.value.replace('C:\\fakepath\\', '');
});

form.addEventListener('submit', function(e) {
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "40px Impact";
  context.fillText(top.value, 200, 50);
  context.fillText(bottom.value, 200, 380);

  context.strokeText(top.value, 200, 50);
  context.strokeText(bottom.value, 200, 380);

  reset.disabled = false;
  button.disabled = false;
  submit.disabled = true;
  voiceSelect.disabled = false;

  e.preventDefault();
});

reset.addEventListener('click', function(e) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  reset.disabled = true;
  button.disabled = true;
  submit.disabled = false;

  e.preventDefault();
});

var synth = window.speechSynthesis;
var voices = synth.getVoices();
const volume = document.getElementById('volume-group');

for(var i = 0; i < voices.length; i++) {
  if(i==0){
    voiceSelect.removeChild(document.querySelector("[value='none']"));
  }
  var option = document.createElement('option');
  option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
  option.value = i;
  voiceSelect.appendChild(option);
}

button.addEventListener('click', () => {
  var speech = new SpeechSynthesisUtterance(top.value+bottom.value);
  speech.voice = voices[voiceSelect.value];
  speech.volume = volume.children[1].value*1.0/100;
  synth.speak(speech);
});

volume.addEventListener('input', () => {
  const volumeImg = volume.children[0];
  const range = volume.children[1];
  if(range.value > 66){
    volumeImg.src = "icons/volume-level-3.svg";
    volumeImg.alt = "Volume Level 3";

  }
  else if(range.value > 33){
    volumeImg.src = "icons/volume-level-2.svg";
    volumeImg.alt = "Volume Level 2";
  }
  else if(range.value > 0){
    volumeImg.src = "icons/volume-level-1.svg";
    volumeImg.alt = "Volume Level 1";
  }
  else{
    volumeImg.src = "icons/volume-level-0.svg";
    volumeImg.alt = "Volume Level 0";
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
