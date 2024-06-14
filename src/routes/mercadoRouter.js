import { Router } from 'express';
import {createPreference, createSuscription, receiveWebhook, sendmail } from '../controller/paymentController.js';


const router = Router()

router.post('/create-sus', createSuscription);

router.post('/create-order', createPreference);

router.get('/success', (req, res) => res.send("Success"));

router.post('/webhook/:id/:email/:plan/:telefono/:nombre/:rut/:password/:fecha', receiveWebhook);

router.post('/email', sendmail)

export default router


