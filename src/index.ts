import express from 'express';
import { 
    CloudAdapter, ConfigurationServiceClientCredentialFactory, 
    ConfigurationBotFrameworkAuthentication 
} from 'botbuilder';
import { EchoBot } from './bot';
import dotenv from 'dotenv';

dotenv.config();

// Auth Config
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword
});

// const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({}, credentialsFactory);

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({}); //Config to Local Tests
const adapter = new CloudAdapter(botFrameworkAuthentication);

const bot = new EchoBot();

const server = express();
server.use(express.json());

// Endpoint to bot messages
server.post('/api/messages', (req, res) => {
    adapter.process(req, res, async (context) => {
        await bot.run(context);
    });
});

// Start Server
const PORT = process.env.PORT || 3978;
server.listen(PORT, () => {
    console.log(`Bot está ouvindo na porta ${PORT}`);
});
