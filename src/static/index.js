(function() {
    const socket = io.connect("http://localhost:8080");
    const handle = document.getElementById("handle");
    const message = document.getElementById("message");
    const output = document.getElementById("output");
    const form = document.querySelector("form");
    const typing = document.getElementById("typing");
    let timer; 
    let isTyping = false;
    let chatNum = 0;
    let timeBetweenPress = 0;
    let name;

    function handleSubmit(e) {
        e.preventDefault();
        let data;
        if (chatNum === 0) {
            name = handle.value;
        }
        data = {
            handle: name,
            message: message.value
        }
        socket.emit("chat", data);
        form.reset();
        handle.classList.add("hide");
        chatNum++;
    }

    function handlePress(e) {
        let data = {}
        if (!handle.value && chatNum === 0) {
            e.preventDefault();
            alert("Enter a handle");
            return;
        }
        isTyping = true;
        data.name = chatNum === 0 ? handle.value : name;
        socket.emit("typing", data);
    }

    function removeMessage() {
        isTyping = false;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            socket.emit("stopped", {typing: false})
        }, 1000);
    }

    //DOM Event Listeners
    form.addEventListener("submit", handleSubmit);
    message.addEventListener("keydown", handlePress);
    message.addEventListener("keyup", removeMessage);

    //Socket Listeners
    socket.on("chat", (data) => {
        let newMessage = document.createElement("p");
        let sentTime = new Date();
        sentTime = sentTime.toLocaleTimeString();
        newMessage.classList.add("messages");
        newMessage.innerHTML = `<strong>${data.handle}</strong><br/>${data.message}`;
        newMessage.innerHTML += `<span class="date">${sentTime}</span>`
        output.appendChild(newMessage);
    });

    socket.on("typing", (data) => {
        typing.innerHTML = `${data.name} is typing...`;
    });

    socket.on("stopped", (data) => {
        typing.innerHTML = ""
    });
}());