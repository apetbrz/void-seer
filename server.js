import path from "path";
import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import gatherFissureMissions from "./server/data.js";
import "react-router";
import { createRequestHandler } from "@react-router/express";

let port;
let corsOrigin;
if (process.env.ENVIRONMENT == "RELEASE") {
    port = 4001;
    corsOrigin = "https://relics.apetbrz.dev";
}
else {
    port = 3000;
    corsOrigin = "*"
}

console.log("cors origin: " + corsOrigin);

const app = express();

const corsOptions = {
    origin: [corsOrigin]
};
app.use(cors(corsOptions));

let wfdata = {};
let updateTime = 0;

app.get("/", (req, res) => {
    let fileName = path.resolve("./build/client/index.html");
    res.sendFile(fileName);
});
// app.use("/*", express.static("./build/client/"));
app.use("/assets", express.static("./build/client/assets"));
app.get("/worldstate", async (req, res) => {
    let now = Date.now();
    let clientIp = req.get("x-real-ip");
    if (!clientIp) clientIp = req.ip + " - not proxied";
    console.log("worldstate requested - " + new Date(now).toLocaleTimeString() + " - " + clientIp)

    let output = { wfdata: wfdata, timestamp: updateTime };
    res.set("Access-Control-Allow-Origin", "*")
    res.json(output);
})

let updateData = async () => {
    console.log("refreshing data: " + new Date().toTimeString())
    console.log("fetching wfdata...");
    await fetch('https://content.warframe.com/dynamic/worldState.php')
        .then((res) => res.json())
        .then((data) => {
            updateTime = data.Time * 1000;
            console.log("...wfdata loaded");
            wfdata = gatherFissureMissions(data);
            console.log("...wfdata parsed");
        })
        .catch((err) => {
            console.log("WORLDSTATE FETCH ERR: " + err);
            if (!wfdata) {
                console.log("FAILED TO CACHE INIT WORLDSTATE, EXITING...")
                exit(1);
            }
            else console.log("CONTINUING WITH CACHED FILE FROM " + new Date(updateTime).toLocaleTimeString());
        });
}

setInterval(() => {
    updateData();
}, 2 * 60 * 1000);

var server;
if (process.env.ENVIRONMENT == "RELEASE") {
    console.log("production environment, HTTPS");
    const key = fs.readFileSync(import.meta.dirname + "/secret/selfsigned.key");
    const cert = fs.readFileSync(import.meta.dirname + "/secret/selfsigned.crt");
    const certOptions = {
        key: key,
        cert: cert
    };
    server = https.createServer(certOptions, app);
}
else {
    console.log("development environment, no HTTPS");
    server = app;
}

let main = async () => {
    await updateData();
    server.listen(port, () => {
        console.log("server started on port " + port + "\n\n");
    });
}

main();
