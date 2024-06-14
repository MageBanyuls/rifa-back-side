import 'dotenv/config'
import paymentService from '../service/paymentService.js'
import { io } from '../../index.js'
import userRepository from '../persistence/repository/userRepository.js'
import { CustomError } from "../utils/handlerResponse.js";

const URL = process.env.HOST
const MPTKN = process.env.MERCADOPAGO_TOKEN



import axios from 'axios';
import { Preference, MercadoPagoConfig } from 'mercadopago';
import userService from '../service/userService.js'
import { completeRegister } from './userController.js'
import { sendEmailBienvenida } from '../utils/emailSender.js';

const client = new MercadoPagoConfig({accessToken: MPTKN})

export const createSuscription = async (req, res, next) => {
  try {
    //userEmail = req.body.payer.email;
    console.log('hola ')
    const { idUsuario, token, email, rut, telefono, fecha, password, nombre, plan} = req.body;
    console.log(req.body)
    const data = {
      preapproval_plan_id: plan,
      payer_email: "test_user_422112672@testuser.com",
      card_token_id: token,
      /*     back_url: `https://promise-habits-olympic-dans.trycloudflare.com/mp/feedback/${email}`,*/
      status: "authorized", 
    };

    const datosUser = {

      id: idUsuario,
      nombre: nombre,
      email: email,
      celular: telefono,
      rut: rut,
      fecha_de_nacimiento: fecha,
      activo: true,
      password: password,
      complete_register: true,
      plan: plan

    }

    const generarSuscripcion = async () => {
      console.log('generando suscripcion')

      try {
        const response = await axios.post(
          "https://api.mercadopago.com/preapproval",
          data,
          {
            headers: {
              Authorization: `Bearer ${MPTKN}`,
            },
          }
        );
        console.log('suscripcion generada')
        console.log(response)

        await paymentService.payService({id_user:idUsuario,...response.data});

        await userService.signUpUser(datosUser)
        //console.log(response)
        //ResponseHandler.Ok(res, "Ok");
        //console.log("response first endpoint:", response.data);
        io.emit(`pago_suscripcion_${idUsuario}`,{status:"APRO"})
        return res.status(200).send("OK")
      } catch (error) {
        io.emit(`pago_suscripcion_${idUsuario}`,{status:"REJ"})
        return res.status(400)
      }
    };

    if (token) {
      await generarSuscripcion();
    }

  } catch (error) {
    return res.status(400)
  }
};

export const createPreference = async (req, res) => {
  try {
    const body = {
      items : [{
        title : req.body.title,
        quantity : Number(req.body.quantity),
        unit_price : Number(req.body.unit_price),
        currency_id : req.body.currency_id

      }],
      back_urls: {
        success: "https://www.youtube.com/watch?v=oL3qDpubXU8",
        failure: "https://www.youtube.com/watch?v=oL3qDpubXU8",
        pending: "https://www.youtube.com/watch?v=oL3qDpubXU8"
      },
      auto_return: "approved",
      notification_url: `https://d5b3-190-15-204-189.ngrok-free.app/webhook/${req.body.idUsuario}/${req.body.email}/${req.body.plan}/${req.body.telefono}/${req.body.nombre}/${req.body.rut}/${req.body.password}/${req.body.fecha}`
    };


    

    const preference = new Preference(client);

    const result = await preference.create({body});
   
    return res.status(200).json({init_point: result.init_point})

  }catch(error){
    console.log(error)
    res.status(500).json({
      error: "error al crear el pago :(",
      err : error
    })
  }
}
  
export const receiveWebhook = async (req, res) => {
  try {
    console.log("entre a feedback:");
    const { query, params, body } = req;
    const topic = query.topic || query.type;

    // Obtener datos de los parámetros de la ruta
    const { id, email, plan, telefono, nombre, rut, password, fecha } = params;

    if (topic === "payment") {
      const paymentId = query.id || query["data.id"];
      const data = body;

      if (data.status === "approved") {
        // Calcular la fecha de finalización
        const startdate = new Date(data.date_created);
        startdate.setMonth(startdate.getMonth() + 12);
        const dia = startdate.getDate();
        const enddate = startdate.toISOString();

        const datitos = {
          id: data.id, // Esto debe ser definido o removido si no es necesario
          id_user: id,
          date_created: data.date_created,
          card_id: `${data.card.first_six_digits}${data.card.last_four_digits}`,
          payment_method_id: data.payment_method_id,
          preapproval_plan_id: plan,
          auto_recurring: {
            end_date: enddate,
            transaction_amount: data.transaction_amount,
            currency_id: data.currency_id
          },
          billing_day: dia,
          next_payment_date: enddate
        };

        const datosUser = {
          id: id,
          nombre: nombre,
          email: email,
          celular: telefono,
          rut: rut,
          fecha_de_nacimiento: fecha,
          activo: true,
          password: password,
          complete_register: true,
          plan: plan
        };

        await paymentService.payService(datitos);
        await userService.signUpUser(datosUser);
        io.emit(`pago_suscripcion_${id}`, { status: "APRO" });
      } else if (data.status === "rejected") {
        io.emit(`pago_suscripcion_${id}`, { status: "REJ" });
      } else {
        io.emit(`pago_suscripcion_${id}`, { status: "ERR" });
      }

      return res.status(200).send("OK");
    } else {
      return res.status(400).send("Invalid topic");
    }
  } catch (error) {
    console.error("Error in receiveWebhook:", error);
    return res.status(500).send("Internal Server Error");
  }
};




async function registerPay (paymentId){
  const data = await mercadopago.payment.findById(paymentId);
  console.log(data.body);
  
  if(data.body.status === 'approved'){
    console.log('EL PAGO FUE APROBADO')
    io.emit('pagoRegister',{status:"APRO"})
    //aca ya puedo hacer todos los registros correspondientes al pago	
  }
};

// export const sendmail = async (req, res) => {
//   try {
//     const email =req.body.email
//     const codigo = req.body.codigo

//     const enviomail = await sendEmailBienvenida(email, codigo)

//     return enviomail;
//   }catch(error){
//     res.status(500).json({
//       error: "error al crear el pago :(",
//       err : error
//   });
// }

// }
// }
