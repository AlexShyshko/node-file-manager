class CommandLineInterface {

    constructor(messages, commands) {

        this.CLI_ARGUMENTS = process.argv.slice(2);
        this.MC = {
            colorize: (message, attribute) => {
                return message;
            }
        };

        this.MESSAGES = messages;
        this.CLI_COMMANDS = commands;
    }

    startApplication = () => {

        process.stdin.on('data', (input) => {
            
            const stringifiedInput = String(input).trim();
            const splitCommand = stringifiedInput.split(' ');
            const command = String(splitCommand[0]);
            const commandHandler = this.checkUserCommand(command, splitCommand);
            commandHandler();

        });

        process.on('exit', () => {
            console.log(`${this.MC.colorize(this.MESSAGES.FAREWELL_MESSAGE + ',', 'green')} ${this.MC.colorize(this.userName, 'yellow')}${this.MC.colorize(', ' + this.MESSAGES.FAREWELL_PHRASE + '!', 'green')}`);
            //process.exit(0);
        });

        
        process.on('SIGINT', () => {
            process.exit(0);
        });
    

    }

    checkUserCommand = (command, splitCommand) => {

        switch (command) {

            case this.CLI_COMMANDS.EXIT:
                return process.exit.bind(null, 0);
            default:
                return this.unknownCommandHandler.bind(null, command);

        }

    }

    exitApplication = () => {

    }

    unknownCommandHandler = (command) => {
        console.log(`${this.MC.colorize(this.MESSAGES.INVALID_INPUT, 'red')} ${this.MC.colorize(command, 'yellow')}`);
    }

    parseCliArgs = (regexpTemplate, argumentOperator) => {

        let cliArguments = {};

        this.CLI_ARGUMENTS.forEach((argument, index, array) => {
            
            if (regexpTemplate.test(argument)) {

                let nameValuePair = argument.split(argumentOperator);
                cliArguments[nameValuePair[0]] = nameValuePair[1] ?? null;
                
            }
    
        });

        return cliArguments;

    }

    normalizeCliArguments = (argumentsObject, keyToReplace, valueToReplace) => {

        const normalizedArguments = Object.keys(argumentsObject).reduce((acc, key) => {

            const normalizedKey = key.replace(keyToReplace, '');
            let normalizedValue;

            if (argumentsObject[key]) {
                normalizedValue = argumentsObject[key].replace(valueToReplace, '');
            } else {
                normalizedValue = argumentsObject[key];
            }

            acc[normalizedKey] = normalizedValue;
            return acc;

        }, {});

        return normalizedArguments;

    }

    setUserName = (name) => {
        this.userName = name;
    }

    setMessageColorizer = (messageColorizer) => {
        this.MC = messageColorizer;
    }

}

export { CommandLineInterface };