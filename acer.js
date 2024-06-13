route.post('/api/create-order',async(req,res)=>{    
    const { nombre, precio } = req.body;
 
    if(response){
        mercadopago.configure({
            access_token:'TEST-token-vendedor'
          })
      
        const result = await mercadopago.preferences.create({
            items:[
              {   
                title: nombre,
                unit_price: precio,
                currency_id:"ARS",
                quantity:1
              }
            ],
            notification_url: `tunel_https_con_ngrok/webhook`,
        })

        return res
        .json({
			ok:true,
            data:result
        })
        .status(200)
    }

    return res
    .json({message:'error en la obtencion de los datos'})
    .status(400)

})


route.post('/webhook',async(req,res)=>{
    console.log('evento webhook')
    const { query } = req;
    const topic = query.topic || query.type

    console.log({query})
	//el topic puede ser "merchant_order" o "payment"
    console.log('topic')
    console.log(topic)

    if(topic === "payment"){
        const paymentId = query.id || query['data.id']
		//funcion registro de pago
        await registerPay(paymentId)
    }
	//ESTATUS OBLIGATORIO
    return res.status(200).send("OK")
})


async function registerPay (paymentId){
    const data = await mercadopago.payment.findById(paymentId);
    console.log(data.body);
    
    if(data.body.status === 'approved'){
      console.log('EL PAGO FUE APROBADO')
      io.emit('pegoRegister',{status:"APRO"})
      //aca ya puedo hacer todos los registros correspondientes al pago	
    }
}

