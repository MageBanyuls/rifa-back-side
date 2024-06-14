import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import userrouter from './src/routes/userRouter.js';
import paymentRouter from './src/routes/mercadoRouter.js';
import cors from "cors";
import morgan from "morgan";
import { MercadoPagoConfig, Payment} from 'mercadopago'


const PORT = process.env.PORT || 4500



// Initializations
const app = express();
app.use(cors())
app.use(express.json())

app.use(morgan('dev'));
app.use('/user',userrouter);
app.use( paymentRouter)


const server = http.createServer(app);
export const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});




io.on("connection", socket => {
  console.log(socket.id);
  /*
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
  */
});

server.listen(PORT);
console.log(`server on port ${PORT}`);


// const paymentId = '80142447861'
// const client = new MercadoPagoConfig({
//   accessToken: process.env.MERCADOPAGO_TOKEN,
// });
// console.log("paymentid:", paymentId);
// console.log("inside register pay");

// const payment = await new Payment(client).get({ id: paymentId });
// console.log(payment)