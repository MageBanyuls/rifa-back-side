import 'dotenv/config'
import paymentService from '../service/paymentService.js'
import { io } from '../../index.js'

const URL = process.env.HOST
const MPTKN = process.env.MERCADOPAGO_TOKEN
const plan = process.env.PLAN_ID


import axios from 'axios';
import { Preference, MercadoPagoConfig } from 'mercadopago';
import userService from '../service/userService.js'

const client = new MercadoPagoConfig({accessToken: MPTKN})

export const createSuscription = async (req, res, next) => {
  try {
    //userEmail = req.body.payer.email;
    console.log('hola ')
    const { idUsuario, token, email } = req.body;
    console.log(req.body)
    const data = {
      preapproval_plan_id: plan,
      payer_email: "test_user_422112672@testuser.com",
      card_token_id: token,
      /*     back_url: `https://promise-habits-olympic-dans.trycloudflare.com/mp/feedback/${email}`,*/
      status: "authorized", 
    };

    const usuarionuevo = await userService.signUpUser(idUsuario, email)

    const generarSuscripcion = async () => {
      console.log('generando suscripcion')

      try {
        const response = await axios.post(
          "https://api.mercadopago.com/preapproval",
          data,
          {
            headers: {
              Authorization: "Bearer APP_USR-6042457912670930-061210-8ca40ae15924091738f5f364d8383ee6-1853466315",
            },
          }
        );
        console.log('suscripcion generada')
        console.log(response)

        await paymentService.payService({id_user:usuarionuevo.id,...response.data});
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
    };

    const useeer = {
      idUsuario :req.body.idUsuario,
      email: req.body.email
    }

    await userService.signUpUser(useeer.idUsuario,useeer.email);

    const preference = new Preference(client);

    const result = await preference.create({body});
   
    return res.status(200).json(result.init_point)

  }catch(error){
    console.log(error)
    res.status(500).json({
      error: "error al crear el pago :(",
      err : error
    })
  }
}
  
export const receiveWebhook = async(req,res)=>{
  console.log("entre a feedback:");
  const { query } = req;
  const topic = query.topic || query.type;
  console.log("topic:", topic);
  if (topic === "payment") {
    const paymentId = query.id || query["data.id"];

    await paymentService.registerPay(paymentId)

    // const startdate =new Date(result.date_created)
    // startdate.setMonth(startdate.getMonth() + 12)

    // const dia = startdate.getDate()
    
    // const enddate = startdate.toISOString()
    // const datitos = {
    //   id:result.id,
    //   id_user: useeer.idUsuario,
    //   date_created:result.date_created,
    //   card_id:"sfdfsdfsfsdfds",//result.payment_methods.default_card_id,
    //   payment_method_id:"dfsfdsfsfsddf", //result.payment_methods.default_payment_method_id,
    //   preapproval_plan_id: plan,
    //   auto_recurring:{
    //     end_date: enddate,
    //     transaction_amount: body.items[0].unit_price * body.items[0].quantity,
    //     currency_id: body.items[0].currency_id
    //   },
    //   billing_day: dia,
    //   next_payment_date: enddate


    // };
    
    // const pagoregister = await paymentService.payService(datitos)

    // await paymentService.registerPay(paymentId)
    // registerPay(paymentId)
    // console.log(paymentId)
    // console.log(query)
  }
  return res.status(200).send("OK")
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