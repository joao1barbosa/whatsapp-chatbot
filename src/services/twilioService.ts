// src/twilioService.ts
import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const client = new Twilio(accountSid, authToken);

export async function sendMessage(to: string, body: string) {
    try {
        const message = await client.messages.create({
            body,
            from: 'whatsapp:+14155238886', // Seu número de Twilio para WhatsApp
            to: `whatsapp:${to}`
        });
        console.log(`Mensagem enviada: ${message.sid}`);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
    }
}
