import { MercadoPagoConfig, Payment } from "mercadopago";
import mpRepository from "../persistence/repository/mpRepository.js";
import "dotenv/config";
import { CustomError } from "../utils/handlerResponse.js";

class mpService {
    async registerPay(paymentId) {
      try {
        const client = new MercadoPagoConfig({
          accessToken: process.env.MERCADOPAGO_TOKEN,
        });
        console.log("paymentid:", paymentId);
        console.log("inside register pay");
  
        const payment = await new Payment(client).get({ id: paymentId });

        console.log(payment)
  
        // console.log("RegisterPay - Payment Status:", payment.status);
        // console.log("RegisterPay - Payment Payer:", payment.payer);
        // console.log(payment)
        // if (payment.status === "approved") {
        //   console.log("RegisterPay - Payment Approved");
        //   //console.log(payment)
        //   return ('ok')//await mpRepository.registerPay(payment);
        // } else {
        //   throw new CustomError("400", "Payment not approved");
        // }
      } catch (error) {
        console.error("RegisterPay - Error:", error);
        throw new CustomError("500", error.message || "Internal Server Error");
      }
    }

    async payService (data) {
      try {
        return await mpRepository.registerPay(data)
      }catch (error){
        throw new CustomError("500", error.message || "Internal Server Error");
      }
    }
  }
  
  export default new mpService();