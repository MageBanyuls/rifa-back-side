export const receiveWebhook = async (req, res) => {
    try {
      console.log("entre a feedback:");
      const { query, params, body } = req;
      const topic = query.topic || query.type;
  
      // Obtener datos de los parámetros de la ruta
      const { id, email, plan, telefono, nombre, rut, password, fecha } = params;
  
      if (topic === "payment") {
        const paymentId = query.id || query["data.id"];
        const payment = await mpRepository.registerPay(paymentId)
  
        if (payment.status === "approved") {
          // Calcular la fecha de finalización
          const startdate = new Date(data.date_created);
          startdate.setMonth(startdate.getMonth() + 12);
          const dia = startdate.getDate();
          const enddate = startdate.toISOString();
  
          const datitos = {
            id: data.id,
            id_user: id,
            date_created: payment.date_created,
            card_id: `${payment.card.first_six_digits}${payment.card.last_four_digits}`,
            payment_method_id: payment.payment_method_id,
            preapproval_plan_id: plan,
            auto_recurring: {
              end_date: enddate,
              transaction_amount: payment.transaction_amount,
              currency_id: payment.currency_id
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
        } else if (payment.status === "rejected") {
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