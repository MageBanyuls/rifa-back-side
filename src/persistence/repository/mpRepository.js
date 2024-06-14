import { idgenerate } from "../../utils/idGenerate.js";
import { prisma } from "../../utils/injection.js";
import handlePrismaError from "../../utils/prismaError.js";


class mpRepository {
    async registerPay(data) {
      try {
        const id = idgenerate('pagos');
        const idsus = `suscription-${data.id}`
        //console.log(data)
        const suscripciones = await prisma.suscripciones.create({
          data: {
          id: idsus,
          id_user: data.id_user,
          date_created: data.date_created,
          card_id: data.card_id,
          payment_method_id: data.payment_method_id,
          plan_id : data.preapproval_plan_id,
          end_date: data.auto_recurring.end_date,
          billing_day: data.auto_recurring.billing_day
          }
        });
        console.log ('hicesuscripciones')

        const pagos= await prisma.pagos.create({
          data:{
          id: id,
          next_payment_date: data.next_payment_date,
          date_created: data.date_created,
          suscription_id:suscripciones.id,
          transaction_amount: data.auto_recurring.transaction_amount,
          currency_id: data.auto_recurring.currency_id
          }

        })
        console.log ('hicepagos')


        return({pagos, suscripciones})
      } catch (error) {
        handlePrismaError(error);
      }
    }
  
    async findLinkByUserId(id) {
      try {
        return prisma.pagoMercadopago.findUnique({
          where: { id: id },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    }
  }
  export default new mpRepository();
  