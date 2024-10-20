const log = require('simple-node-logger').createSimpleLogger('headOutput.log');
log.info("Starting Head Server")
log.info("Logger Started")
const {ChildServer} = require("./src/server")
const express = require("express");
const wrapper = require("./src/apiWrapper");
const app = express();
const sys = require('systeminformation');

let childServers = [];

app.use(express.json());
const port = 80;

app.listen(port);

app.get("/", (req, res)=>{
    res.status(200).send({message: "Head Server is Running", "status": "OK"})
})

app.post("/createGameServer/:serverId", async (req, res)=>{
    let data = req.body
    log.info(data)
    let auth = await wrapper.getAuth()
    if (req.headers.authorization === auth){
        log.info(data)
        log.info("Starting a Game Server")
        let server = new ChildServer(data.message.serverName, data.message.ownerId, data.message.gameId, data.message.serverMap, req.params.serverId)
        log.info(server)
        server.startChildServer()
        childServers.push(server)
        res.status(201).send("Server Started")
    }else{
        res.status(401).send("Bad Auth Code")
    }
})

function shutdownServer() {
    return new Promise(async (resolve, reject) => {
        log.info("Shutting Down Server")
        await wrapper.sendServerShutdown()
        process.exit(0)
        childServers.forEach(server => {
            server.sendServerShutdown()
        })
    })

}

app.post("/shutdownServer", async (req, res)=>{
    log.info("Shutting Down Server")
    let auth = await wrapper.getAuth()
    if (req.headers.authorization === auth){
        log.info("Shutting Down Child Servers")
        shutdownServer()
        res.status(201).send("Shutting Down Server")
    }else{
        res.status(401).send("Bad Auth Code")
    }
})


wrapper.sendServerReady()