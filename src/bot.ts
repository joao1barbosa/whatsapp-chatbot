import { ActivityHandler, TurnContext } from 'botbuilder';
import { sendMessage } from './services/twilioService';

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context: TurnContext, next) => {
            const userMessage = context.activity.text;

            // Enviar mensagem usando Twilio
            await sendMessage('+1234567890', `Você disse: ${userMessage}`); // Substitua '+1234567890' pelo número do destinatário

            // Responder ao usuário no bot
            await context.sendActivity(`Você disse: ${userMessage}`);
            await next();
        });
    }
}