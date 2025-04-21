class CommandLineInterface {

    constructor() {
        this.CLI_ARGUMENTS = process.argv.slice(2);
    }

    startApplication = () => {

        const parsedUserArguments = this.parseCliArgs(this.CLI_ARGUMENTS, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_OPERATOR);
        const normalizedUserArguments = this.normalizeCliArguments(parsedUserArguments, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, '');
        this.setNormalizedUserArguments(normalizedUserArguments);
        this.setUserName(normalizedUserArguments.username);
        
        process.stdin.on('data', (input) => {
            
            const stringifiedInput = String(input).trim();
            const splitInput = stringifiedInput.split(' ');
            const command = String(splitInput[0]);
            const userArguments = splitInput.slice(1).join(' ').trim();
            const commandHandler = this.checkUserCommand(command, userArguments);
            const response = commandHandler();

            if (response instanceof Promise) {

                response.then(

                    (promiseResponse) => {
                        this.commandResponseHandler(promiseResponse);
                    },

                    (promiseError) => {
                        this.commandResponseHandler(promiseError);
                    }
            
                );

            } else {
                this.commandResponseHandler(response);
            }

        });

        process.on('exit', () => {
            console.log(`${this.MC.colorize('\n' + this.MESSAGES.FAREWELL_MESSAGE + ',', 'green')} ${this.MC.colorize(this.USER_NAME, 'yellow')}${this.MC.colorize(', ' + this.MESSAGES.FAREWELL_PHRASE + '!' + '\n', 'green')}`);
        });

        process.on('SIGINT', () => {
            process.exit(0);
        });
    
        console.log(`${this.MC.colorize('\n' + this.MESSAGES.GREETING_MESSAGE + ', ', 'green')}${this.MC.colorize(this.USER_NAME, 'yellow')}${this.MC.colorize('!', 'green')}`);
        this.printPath();

    }

    checkUserCommand = (command, userArguments) => {

        switch (command) {

            case this.CLI_COMMANDS.EXIT:
                return process.exit.bind(null, 0);
            case this.CLI_COMMANDS.GO_UP_FROM_DIRECTORY:
                return this.navUpHandler;
            case this.CLI_COMMANDS.GO_TO_DIRECTORY:
                return this.navGoDirectoryHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.PRINT_DIRECTORY_CONTENT:
                return this.navPrintContentHandler;
            case this.CLI_COMMANDS.READ_AND_PRINT_CONTENT_IN_CONSOLE:
                return this.fmReadAndPrintHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.CREATE_FILE:
                return this.fmCreateFileHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.CREATE_DIRECTORY:
                return this.fmCreateDirectoryHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.RENAME_FILE:
                return this.fmRenameFileHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.COPY_FILE:
                return this.fmCopyFileHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.CUT_FILE:
                return this.fmCutFileHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.DELETE_FILE:
                return this.fmDeleteFileHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.OPERATING_SYSTEM:
                return this.osrPrintReportHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.HASH_ALGORITHMS:
                return this.htPrintHashAlgorithmsHandler;
            case this.CLI_COMMANDS.HASH_ENCODINGS:
                return this.htPrintHashEncodingsHandler;
            case this.CLI_COMMANDS.HASH:
                return this.htPrintHashHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.COMPRESS:
                return this.tempHandler.bind(null, command);
            case this.CLI_COMMANDS.DECOMPRESS:
                return this.tempHandler.bind(null, command);
            default:
                return this.unknownCommandHandler.bind(null, command);

        }

    }

    tempHandler = (command) => {
        return new Error(`${this.MC.colorize('Temp command handler for','red')} ${this.MC.colorize(command,'yellow')}`);
    }

    navUpHandler = () => {
        return this.NV.up();
    }

    navGoDirectoryHandler = async (directoryPathParameter) => {
        return await this.NV.goDirectory(this.normalizeQuotedPath(directoryPathParameter));
    }

    navPrintContentHandler = async () => {
        return await this.NV.printContent();
    }

    fmReadAndPrintHandler = (filePathParameter) => {
        return this.FM.readAndPrint(this.normalizeQuotedPath(filePathParameter));
    }

    fmCreateFileHandler = (fileName) => {
        return this.FM.createFileOrDirectory(this.normalizeQuotedPath(fileName), 'file');
    }

    fmCreateDirectoryHandler = (directoryName) => {
        return this.FM.createFileOrDirectory(this.normalizeQuotedPath(directoryName), 'directory');
    }

    fmRenameFileHandler = (userArguments) => {

        let parsedUserArguments = this.parseUserArguments(userArguments);
        return this.FM.renameFile(parsedUserArguments[0], parsedUserArguments[1]);

    }

    fmCopyFileHandler = (userArguments) => {

        let parsedUserArguments = this.parseUserArguments(userArguments);
        return this.FM.copyFile(parsedUserArguments[0], parsedUserArguments[1]);

    }

    fmCutFileHandler = (userArguments) => {

        let parsedUserArguments = this.parseUserArguments(userArguments);
        return this.FM.cutFile(parsedUserArguments[0], parsedUserArguments[1]);

    }

    fmDeleteFileHandler = (filePathParameter) => {
        return this.FM.deleteFile(this.normalizeQuotedPath(filePathParameter));
    }

    osrPrintReportHandler = (userArguments) => {

        let parsedCliArguments = this.parseCliArgs((userArguments).split(' '), this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_OPERATOR);
        let normalizedCliArguments = this.normalizeCliArguments(parsedCliArguments, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, '');
        return this.OSR.printReport(normalizedCliArguments);
    
    }

    htPrintHashAlgorithmsHandler = () => {
        return this.HT.printHashAlgorithms();
    }

    htPrintHashEncodingsHandler = () => {
        return this.HT.printHashEncodings();
    }

    htPrintHashHandler = (userArguments) => {

        let parsedUserArguments = this.parseUserArguments(userArguments);
        let parsedCliArguments = this.parseCliArgs(parsedUserArguments.slice(1), this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_OPERATOR);
        let normalizedCliArguments = this.normalizeCliArguments(parsedCliArguments, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, '');
        return this.HT.printHash(parsedUserArguments[0], normalizedCliArguments);

    }

    unknownCommandHandler = (command) => {
        return new Error(`${this.MC.colorize(this.MESSAGES.INVALID_INPUT, 'red')} ${this.MC.colorize(command, 'yellow')}`);
    }

    commandResponseHandler = (response) => {

        if (response instanceof Error) {

            console.log(this.MC.colorize(this.MESSAGES.OPERATION_FAILED, 'red'));
            console.log(response.message);

        } else {

            console.log(this.MC.colorize(this.MESSAGES.OPERATION_SUCCESS, 'green'));
            response ? console.log(response) : null;

        }

        this.printPath();

    }

    normalizeQuotedPath = (pathParameter) => {
        
        let quotedStringTemplate = /^".*"$/;
        let replaceTemplate = /^"|"$/g;

        if (quotedStringTemplate.test(pathParameter)) {

            let unquotedPath = pathParameter.replace(replaceTemplate, '');
            return unquotedPath;

        } else {
            return pathParameter;
        }

    }

    parseUserArguments = (userArguments) => {

        let parsedArguments = [];
        let argumentTemplate = /"([^"]*)"|(\S+)/g;
        let match;

        while ((match = argumentTemplate.exec(userArguments)) !== null) {

            let isDefined;

            if (match[1] !== undefined) {
                parsedArguments.push(match[1]);
            } else if (match[2] !== undefined) {
                parsedArguments.push(match[2]);
            }

        }

        return parsedArguments;

    }

    parseCliArgs = (argumentsArray, regexpArgumentMarker, argumentOperator) => {

        let cliArguments = {};

        argumentsArray.forEach((argument, index, array) => {
            
            if (regexpArgumentMarker.test(argument)) {

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

    printPath = () => {
        console.log(`${this.MC.colorize('\n' + this.MESSAGES.CURRENT_DIRECTORY, 'magenta')} ${this.MC.colorize(process.cwd() + '\n', 'cyan')}`);
    }

    setNormalizedUserArguments = (normalizedUserArguments) => {
        this.NORMALIZED_USER_ARGUMENTS = normalizedUserArguments;
    }

    setUserName = (name) => {
        this.USER_NAME = name;
    }

    setMessages = (messages) => {
        this.MESSAGES = messages;
    }

    setCommands = (commands) => {
        this.CLI_COMMANDS = commands;
    }

    setArgumentsCredentials = (argumentsCredentials) => {
        this.CLI_ARGUMENTS_CREDENTIALS = argumentsCredentials;
    }

    setMessageColorizer = (messageColorizer) => {
        this.MC = messageColorizer;
    }

    setNavigator = (navigator) => {
        this.NV = navigator;
    }
    
    setFileManager = (fileManager) => {
        this.FM = fileManager;
    }

    setOperatingSystemReport = (operatingSystemReport) => {
        this.OSR = operatingSystemReport;
    }

    setHashTool = (hashTool) => {
        this.HT = hashTool;
    }

    setClassPropertyValueOutside = (classInstance, classPropertyName, propertyValue) => {
        classInstance[classPropertyName] = propertyValue;
    }

}

export { CommandLineInterface };