import { 
    CloudAdapter, TurnContext,
    ConfigurationBotFrameworkAuthentication 
} from 'botbuilder';
import express from 'express';
import dialogflow from '@google-cloud/dialogflow';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

//Loading DialogFlow Credentials
const dialogflowConfig = path.join(__dirname, '..', 'dialogflow-key.json');
const sessionClient = new dialogflow.SessionsClient({ keyFilename: dialogflowConfig });
const projectId = 'arteecroche-hnqt';

//Express Config
const server = express();
server.use(express.json());

//Adapter Config Without Auth
const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication({});
const adapter = new CloudAdapter(botFrameworkAuthentication);

async function handleDialogflowQuery(context: TurnContext) {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, uuidv4());
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: context.activity.text,
                languageCode: 'pt-BR',
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult?.fulfillmentText;

    if (result) {
        await context.sendActivity(result);
    }
}

// Endpoint to bot messages
server.post('/api/messages', (req, res) => {
    adapter.process(req, res, async (context) => {
        if (context.activity.type === 'message') {
            await handleDialogflowQuery(context);
        }
    });
});

// Start Server
const PORT = process.env.PORT || 3978;
server.listen(PORT, () => {
    console.log(`Bot está ouvindo na porta ${PORT}`);
});
