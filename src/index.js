import { MESSAGES } from './CONST.js';
import { CLI, FM, MC } from './TOOLS.js';

const runFileManager = async () => {

    try {

        const mc = MC.colorize; // mc('message', 'red_bgc);

        const cliArgumensMarker = /^--/;
        const argumentOperator = '=';
        const parsedUserArguments = CLI.parseCliArgs(cliArgumensMarker, argumentOperator);
        const userArguments = CLI.normalizeCliArguments(parsedUserArguments, cliArgumensMarker, '');
        const userName = userArguments.username;

        CLI.setUserName(userName);
        CLI.setMessageColorizer(MC);

        CLI.startApplication();

        console.log(`${mc(MESSAGES.GREETING_MESSAGE + ', ', 'green')}${mc(userName, 'yellow')}${mc('!', 'green')}`);

    } catch(e) {
        console.log(e);
    }

}

runFileManager();