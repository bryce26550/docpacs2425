const express = require("express");
const ws = require("ws");

const app = express();
const http = require("http").Server(app);
const wss = new ws.WebSocketServer({ server: http });
app.set("view engine", "ejs");

function broadcast(wss, message) {
    for (const client of wss.clients) {
        client.send(message);
    }
}

function userList(wss) {
    const users = [];
    for (const client of wss.clients) {
        const name = client.name;
        if (name) {
            users.push(name);
        }
    }
    
    return users;
}

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/chat", (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.redirect("/");
    }

    res.render("chat", { username: name });
});

wss.on("connection", (ws) => {
    // Handle the names of people joining and their messages
    ws.on("message", (message) => {
        message = JSON.parse(message);
        if (message.name) {
            ws.name = message.name;
            broadcast(wss, JSON.stringify({
                names: userList(wss)
            }));
        }

        if (message.text) {
            broadcast(wss, JSON.stringify({ message: message.text }));
        }
    });

    // When a websocket closes, remove the person's name from the list
    ws.on("close", () => {
        // Get the new user list without the person who left and send it to every client
        let users = userList(wss);
        broadcast(wss, JSON.stringify({ names: users }));
    });
});

http.listen(3000, () => {
    console.log("Server is running on port 3000");
});