import express from "express";
import ht from "http"
import path from "path";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import utilidade from './src/utilidade.js'
import * as proc from 'child_process'

import 'dotenv/config'

const app = express()
const server = ht.createServer(app);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

let messages = []


const io = new Server(server, {
    cors: { origin: `http://${process.env.IP}:3000`, methods: ["GET", "POST"] },
  });

  
  io.on("connection", (socket) => {
    console.log(`a user connected o ${socket.id}`);
    socket.emit("receive_message", messages);

    // utilidade.utilidade(socket, messages)
    const start = proc.spawn("iptables -L",{cwd: "../",shell: true})
    start.stdout.on('data', (data) => {
      const oxe = data.toString()
        console.log('ok ok rodou')
        // (/\d{2}\/\d{2}\/\d{2}/)
        messages = [data.toString().split('Chain OUTPUT (policy ACCEPT)\n')[1].split('\n')[1]]
    });
    
    socket.on("send_message", (data) => {
        // messages.push(data.message)
        console.log('ok recebi uma mensagem', data.message)
      socket.emit("receive_message", messages);
    });
  });

  server.listen(4000, () => {
    console.log(`listening on http://${process.env.IP}:4000`);
  });
