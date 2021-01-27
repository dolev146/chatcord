const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});



const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// output Message to Dom
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
      <p class="meta">${message.username} <span>${message.time}</span></p>
                    <p class="text">
                     ${message.text}
                    </p>
    `;

  document.querySelector(".chat-messages").appendChild(div);
};

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //  get message text
  const msg = e.target.elements.msg.value;
  // Emit message to the server
  socket.emit("chatMessage", msg);

  // Clear inputs
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});


// add room name to Dom
function outputRoomName  (room)  {
  roomName.innerText = room;
};

// add users to DOM
function outputUsers(users) {
    console.log(users)
    userList.innerHTML = 
        `
        ${users.map(user=> `<li>${user.username}</li>`).join('')}
        `
}