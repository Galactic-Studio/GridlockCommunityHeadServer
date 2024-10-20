const fs = require('fs');
const path = require("path")
const axios = require('axios');
let authCode;
let serverId;
const log = require('simple-node-logger').createSimpleLogger('headOutput.log');

try {
    authCode = fs.readFileSync(path.join(__dirname, "..", ".auth"), 'utf8');
    log.info('Auth Code:', authCode);
} catch (err) {
    log.info('Error reading .auth file:', err);
    authCode = 0
}

function getServerId(){
    return new Promise (resolve => {
        serverId =  fs.readFileSync(path.join(__dirname, "..", ".server"), 'utf8').trim();
        log.info('Server ID:', serverId);
        resolve(serverId)
    })
}

function getAuth(){
    return new Promise (resolve => {
        authCode = fs.readFileSync(path.join(__dirname, "..", ".auth"), 'utf8').trim();
        log.info('Auth Code:', authCode);
        resolve(authCode)
    })
}


async function sendServerReady(){
    return new Promise(async resolve => {
        await getServer()
        await getAuth()
        log.info(`Server sending ready: ${serverId}`)
        let request = axios.request({
            method: "post",
            url:`${process.env.API_URL}/${serverId}/ready`,
            headers:{
                'authorization': authCode,
                "requester": "head"
            }
        }).then(res =>{
            resolve()
        }).catch(err =>{
            log.info(err)
        })
        log.info("Server Ready")
        log.info(request)
    })
}
async function sendServerShutdown(){
    return new Promise(async resolve => {
        await getServer()
        await getAuth()
        log.info(`Server sending shutdown: ${serverId}`)
        let request = axios.request({
            method: "delete",
            url:`${process.env.API_URL}/stopHeadServer/${serverId}`,
            headers:{
                'authorization': authCode,
                'requester': 'head'
            }
        }).then(res =>{
            resolve()
        }).catch(err =>{
            log.info(err)
        })
        log.info("Server Ready")
        log.info(request)
    })
}
module.exports = {
    sendServerReady,
    getAuth,
    getServerId,
    sendServerShutdown
}