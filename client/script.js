import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')


let loadInterval;

const loader = (element) => {
  element.textContent = '';

  loadInterval = setInterval(()=>{
    element.textContent += '.';

    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 333)
};

let typeInterval

const typeText = (element, text) => {

  let i = 0;

  typeInterval = setInterval(()=>{
    element.innerHTML += text.charAt(i);
    i += 1;

    if (i == text.length){
      clearInterval(typeInterval);
    }
  }, 20)

};

const generateUnqiueId = () => {

  const timestamp = Date.now();
  const randomNumber = Math.random() * 256 * 256;
  const hex = randomNumber.toString(16);

  return `id-${timestamp}-${hex}`;
};

const chatStripe = (isAi, value='', uId=0) => {

  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi? './assets/bot.svg':'./assets/user.svg'}" 
          alt="${isAi? 'AI' : 'user'}">
        </div>
        <div class="message" id="${uId}">${value}</div>
      </div>
    </div>
    `
  );

};

const handleSubmit = async (e) => {

  e.preventDefault();

  const data = new FormData(form);

  const PROMPT = data.get('prompt');

  chatContainer.innerHTML += chatStripe(false, PROMPT);

  form.reset();

  const uId = generateUnqiueId();

  chatContainer.innerHTML += chatStripe(true, "", uId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uId);

  loader(messageDiv);

  const request = {
    method:"POST",
    headers:{
      'Content-Type':'application-json'
    },
  };

  const url = `https://leokamikazegpt.onrender.com?prompt=${PROMPT}`;

  const response = await fetch(url, request);

  console.log(PROMPT);
  console.log(request);

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok){

    const jsonresponse = await response.json();

    const parsedData = jsonresponse.bot.trim();

    typeText(messageDiv, parsedData);

  } else {

    const error = await response.json()

    typeText(messageDiv, "Something went wrong big man!");

    alert(error);
  }

};




form.addEventListener("submit", handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13){
    handleSubmit(e);
  }
});