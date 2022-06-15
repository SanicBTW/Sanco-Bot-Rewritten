import Discord from 'discord.js';
const intents = new Discord.Intents(32767);
export var client:Discord.Client = new Discord.Client({intents})!;
import {token} from './src/data/secrets/Token.json';
import * as readline from 'readline';
export var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
});
import {Logger} from './src/NewLogger';
import {InitFunctions} from './src/terminal/ConfHandler';
import {InitConsoleCommands} from './src/terminal/TermHandler';
//import {prefix, presName} from './src/data/config/DConf.json';
import {eventHandler} from './src/EventHandler';
import {setupOptionFile, configuration, availableIndexes} from './src/OptFHandler';

//setups config stuff
setupOptionFile('./src/settings.optf');
var prefix = configuration[0].optState;
var presenceName = configuration[0 + 1].optState; //kind of easy bypass i guess

/*
availableIndexes.forEach(idx => {
    switch(idx)
    {
        case 1:
            break;
    }
});*/

client.on('ready', async () => {
    await InitFunctions().then(() => {
        Logger(`Logged in as ${client.user!.tag}`, "INFO");
        client.user!.setPresence({
            activities:[{
                name: "hola",
                type: 'PLAYING'
            }], status: "dnd"
        })
        InitConsoleCommands();
    });
});

new eventHandler(client);

client.on('messageCreate', async(message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    let args = message.content.substring(prefix.length).split(" ");

    if(args[0] === "ping")
    {
        const calcping = new Discord.MessageEmbed()
        .setTitle('Calculando el ping...');

        message.channel.send({embeds:[calcping]}).then(resultMessage => {
            const msgpingsomething = resultMessage.createdTimestamp - message.createdTimestamp;

            const pingresult = new Discord.MessageEmbed()
            .setTitle('Pong! :ping_pong:')
            .addFields
            (
                { name: 'Latencia del bot ', value: `${msgpingsomething}ms`, inline: true},
                { name: 'Ping del bot ', value: `${client.ws.ping}ms`, inline: true},
            ).setColor('GREEN');

            resultMessage.edit({embeds: [pingresult]});
        });
    }

    if(args[0] === "exit")
    {
        client.destroy();
        process.exit();
    }
});

client.login(token);