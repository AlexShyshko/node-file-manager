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
    
        this.printHelp();
        console.log(`${this.MC.colorize('\n' + this.MESSAGES.GREETING_MESSAGE + ', ', 'green')}${this.MC.colorize(this.USER_NAME, 'yellow')}${this.MC.colorize('!', 'green')}`);
        this.printPath();

    }

    checkUserCommand = (command, userArguments) => {

        switch (command) {

            case this.CLI_COMMANDS.HELP:
                return this.printHelp;
            case this.CLI_COMMANDS.EXIT:
                return process.exit.bind(null, 0);
            case this.CLI_COMMANDS.GO_UP_FROM_DIRECTORY:
                return this.navUpHandler;
            case this.CLI_COMMANDS.GO_TO_DIRECTORY:
                return this.navGoDirectoryHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.PRINT_DIRECTORY_CONTENT:
                return this.navPrintContentHandler;
            case this.CLI_COMMANDS.GO_TO_APPLICATION_HOME_DIRECTORY:
                return this.navGoHomeHandler;
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
            case this.CLI_COMMANDS.OPERATING_SYSTEM_SUPPORTED_ARGUMENTS:
                return this.osrPrintOptionalArgumentsHandler;
            case this.CLI_COMMANDS.OPERATING_SYSTEM:
                return this.osrPrintReportHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.HASH_SUPPORTED_ARGUMENTS:
                return this.htPrintOptionalArgumentsHandler;
            case this.CLI_COMMANDS.HASH_ALGORITHMS:
                return this.htPrintHashAlgorithmsHandler;
            case this.CLI_COMMANDS.HASH_ENCODINGS:
                return this.htPrintHashEncodingsHandler;
            case this.CLI_COMMANDS.HASH:
                return this.htPrintHashHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.COMPRESS:
                return this.ctCompressFileHandler.bind(null, userArguments);
            case this.CLI_COMMANDS.DECOMPRESS:
                return this.ctDecompressFileHandler.bind(null, userArguments);
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

    navGoHomeHandler = async () => {
        return await this.NV.goHome();
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

    osrPrintOptionalArgumentsHandler = () => {
        return this.OSR.printOptionalArguments();
    }

    osrPrintReportHandler = (userArguments) => {

        let parsedCliArguments = this.parseCliArgs((userArguments).split(' '), this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_OPERATOR);
        let normalizedCliArguments = this.normalizeCliArguments(parsedCliArguments, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_MARKER, '');
        return this.OSR.printReport(normalizedCliArguments);
    
    }

    htPrintOptionalArgumentsHandler = () => {
        return this.HT.printOptionalArguments();
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

    ctCompressFileHandler = (userArguments) => {

        let parsedUserArguments = this.parseUserArguments(userArguments);
        return this.CT.compressDecompressFileBrotli(parsedUserArguments[0], parsedUserArguments[1], 'compress');

    }

    ctDecompressFileHandler = (userArguments) => {

        let parsedUserArguments = this.parseUserArguments(userArguments);
        return this.CT.compressDecompressFileBrotli(parsedUserArguments[0], parsedUserArguments[1], 'decompress');

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

    printHelp = () => {

        let helpText = `
            ${this.MC.colorize('Before checking the task, make sure that you use NodeJS version', 'red')} ${this.MC.colorize(this.NODE_VERSION, 'red_bgc')}${this.MC.colorize('. Different version may not work properly!', 'red')}
            ${this.MC.colorize('Start this application using command', 'green')} ${this.MC.colorize('npm run start', 'blue_bgc')}${this.MC.colorize('. An optional argument', 'green')} ${this.MC.colorize('username', 'yellow')} ${this.MC.colorize('is acceptable', 'green')} ${this.MC.colorize('npm run start -- --username=your_username', 'blue_bgc')} 
            ${this.MC.colorize('Below is a list of all available', 'green')} ${this.MC.colorize('command names', 'yellow')}${this.MC.colorize(',', 'green')} ${this.MC.colorize('arguments', 'magenta')} ${this.MC.colorize('and', 'green')} ${this.MC.colorize('optional arguments', 'cyan')} ${this.MC.colorize('with command examples:', 'green')} ${this.MC.colorize('correct', 'blue_bgc')} ${this.MC.colorize('and', 'green')} ${this.MC.colorize('incorrect', 'red_bgc')}
            ${this.MC.colorize('Arguments containing spaces must be quoted:', 'yellow')} ${this.MC.colorize('"../QUOTED CORRECT/SPACED PATH"', 'blue_bgc')} ${this.MC.colorize('../UNQUOTED INCORRECT/SPACED PATH', 'red_bgc')}
            ${this.MC.colorize('Unquoted arguments containing spaces for commands, which require more than 1 argument, produce errors!', 'red')}
            ${this.MC.colorize('You can use', 'green')} ${this.MC.colorize('command examples', 'blue_bgc')} ${this.MC.colorize('to speed up the review.', 'green')} ${this.MC.colorize('In this case execute', 'yellow')} ${this.MC.colorize('hm', 'blue_bgc')} ${this.MC.colorize('command before executing every', 'yellow')} ${this.MC.colorize('command example', 'blue_bgc')} ${this.MC.colorize('to make sure, that you are in the RESULT folder', 'yellow')}
            ${this.MC.colorize('If you have any questions, ask me in discord:', 'red')} ${this.MC.colorize('alexshyshko', 'red_bgc')}

            ${this.MC.colorize('Available commands:', 'green')}

            ${this.MC.colorize('help', 'yellow')}
            ${this.MC.colorize('prints this guide to the console', 'green')}
            ${this.MC.colorize('help', 'blue_bgc')}

            ${this.MC.colorize('.exit', 'yellow')}
            ${this.MC.colorize('closes this application (the same as', 'green')} ${this.MC.colorize('CTRL + C', 'yellow')} ${this.MC.colorize('keys pressed)', 'green')}
            ${this.MC.colorize('.exit', 'blue_bgc')}

            ${this.MC.colorize('up', 'yellow')}
            ${this.MC.colorize('goes to the directory one level above', 'green')}
            ${this.MC.colorize('up', 'blue_bgc')}

            ${this.MC.colorize('cd', 'yellow')} ${this.MC.colorize('path_to_directory', 'magenta')}
            ${this.MC.colorize('goes to the dedicated folder', 'green')}
            ${this.MC.colorize('cd ../SOURCE', 'blue_bgc')}
            ${this.MC.colorize('cd ../SOURCE/NON EXISTENT FOLDER', 'red_bgc')}

            ${this.MC.colorize('ls', 'yellow')}
            ${this.MC.colorize('prints list of all files and folders in current directory to the console', 'green')}
            ${this.MC.colorize('ls', 'blue_bgc')}

            ${this.MC.colorize('hm', 'yellow')}
            ${this.MC.colorize('goes to the RESULT directory (uses for executing example commands)', 'green')}
            ${this.MC.colorize('hm', 'blue_bgc')}

            ${this.MC.colorize('cat', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')}
            ${this.MC.colorize('prints a file content to the console', 'green')}
            ${this.MC.colorize('cat ../SOURCE/TO READ.txt', 'blue_bgc')}
            ${this.MC.colorize('cat ../SOURCE/NON EXISTENT.txt', 'red_bgc')}

            ${this.MC.colorize('add', 'yellow')} ${this.MC.colorize('new_file_name', 'magenta')}
            ${this.MC.colorize('creates a new empty file', 'green')}
            ${this.MC.colorize('add VALID FILE NAME.txt', 'blue_bgc')}
            ${this.MC.colorize('add INVALID FILE NAME (\/:*?"<>|).txt', 'red_bgc')}

            ${this.MC.colorize('mkdir', 'yellow')} ${this.MC.colorize('new_directory_name', 'magenta')}
            ${this.MC.colorize('creates a new directory', 'green')}
            ${this.MC.colorize('mkdir VALID FOLDER NAME', 'blue_bgc')}
            ${this.MC.colorize('mkdir INVALID FOLDER NAME (\/:*?"<>|)', 'red_bgc')}

            ${this.MC.colorize('rn', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')} ${this.MC.colorize('new_filename', 'magenta')}
            ${this.MC.colorize('renames the file', 'green')}
            ${this.MC.colorize('rn "../SOURCE/JUMPING KANGAROO.jpg" "FLYING BIRD.jpg"', 'blue_bgc')}
            ${this.MC.colorize('rn "../SOURCE/CLIMBING SQUIRREL.jpg" "SWIMMING ALLIGATOR.jpg"', 'red_bgc')}
            
            ${this.MC.colorize('cp', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')} ${this.MC.colorize('path_to_new_directory', 'magenta')}
            ${this.MC.colorize('copies the file', 'green')}
            ${this.MC.colorize('cp "../SOURCE/PUPPIES TO COPY.jpg" ./', 'blue_bgc')}
            ${this.MC.colorize('cp "../SOURCE/FOLDER TO COPY" ./', 'red_bgc')}
            
            ${this.MC.colorize('mv', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')} ${this.MC.colorize('path_to_new_directory', 'magenta')}
            ${this.MC.colorize('moves the file', 'green')}
            ${this.MC.colorize('mv "../SOURCE/PUPPY TO CUT.jpg" ./', 'blue_bgc')}
            ${this.MC.colorize('mv "../SOURCE/FOLDER TO CUT" ./', 'red_bgc')}
            
            ${this.MC.colorize('rm', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')}
            ${this.MC.colorize('deletes the file', 'green')}
            ${this.MC.colorize('rm ../SOURCE/TO DELETE.txt', 'blue_bgc')}
            ${this.MC.colorize('rm ../SOURCE/FOLDER TO DELETE', 'red_bgc')}

            ${this.MC.colorize('osarg', 'yellow')}
            ${this.MC.colorize('prints all operating system optional arguments to the console', 'green')}
            ${this.MC.colorize('osarg', 'blue_bgc')}

            ${this.MC.colorize('os', 'yellow')} ${this.MC.colorize('--optional_argument_1', 'cyan')} ${this.MC.colorize('--optional_argument_2', 'cyan')} ${this.MC.colorize('--optional_argument_3', 'cyan')} ${this.MC.colorize('--optional_argument_4', 'cyan')} ${this.MC.colorize('--optional_argument_5', 'cyan')}
            ${this.MC.colorize('prints information about the operating system to the console according to passed optional arguments (at least 1 is required)', 'green')}
            ${this.MC.colorize('os --EOL --cpus --homedir --username --architecture', 'blue_bgc')}
            ${this.MC.colorize('os --unknown', 'red_bgc')}

            ${this.MC.colorize('hasharg', 'yellow')}
            ${this.MC.colorize('prints all hash optional arguments to the console', 'green')}
            ${this.MC.colorize('hasharg', 'blue_bgc')}

            ${this.MC.colorize('hashalg', 'yellow')}
            ${this.MC.colorize('prints all supported hash algorithms to the console', 'green')}
            ${this.MC.colorize('hashalg', 'blue_bgc')}

            ${this.MC.colorize('hashenc', 'yellow')}
            ${this.MC.colorize('prints all supported hash digest encodings to the console', 'green')}
            ${this.MC.colorize('hashenc', 'blue_bgc')}

            ${this.MC.colorize('hash', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')} ${this.MC.colorize('--optional_argument_1=value_1', 'cyan')} ${this.MC.colorize('--optional_argument_2=value_2', 'cyan')}
            ${this.MC.colorize('prints a hash for the file to the console according to passed optional arguments (uses default values if no optional arguments are passed)', 'green')}
            ${this.MC.colorize('hash "../SOURCE/TO CALCULATE HASH.txt" --alg=id-rsassa-pkcs1-v1_5-with-sha3-384 --enc=utf16le', 'blue_bgc')}
            ${this.MC.colorize('hash "../SOURCE/FOLDER TO CALCULATE HASH"', 'red_bgc')}
            
            ${this.MC.colorize('compress', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')} ${this.MC.colorize('path_to_destination', 'magenta')}
            ${this.MC.colorize('compresses the file using Brotli algorithm (target archive should have "br" extension)', 'green')}
            ${this.MC.colorize('compress "../SOURCE/GIRAFFE TO COMPRESS.jpg" "./COMPRESSED GIRAFFE.jpg.br"', 'blue_bgc')}
            ${this.MC.colorize('compress "../SOURCE/GIRAFFE TO COMPRESS.jpg" "./COMPRESSED GIRAFFE.jpg.zip"', 'red_bgc')}
            
            ${this.MC.colorize('decompress', 'yellow')} ${this.MC.colorize('path_to_file', 'magenta')} ${this.MC.colorize('path_to_destination', 'magenta')}
            ${this.MC.colorize('decompresses the file using Brotli algorithm (source archive should have "br" extension)', 'green')}
            ${this.MC.colorize('decompress "../SOURCE/COMPRESSED GIRAFFE.jpg.br" "./DECOMPRESSED GIRAFFE.jpg"', 'blue_bgc')}
            ${this.MC.colorize('decompress "../SOURCE/COMPRESSED GIRAFFE.jpg.zip" "./DECOMPRESSED GIRAFFE.jpg"', 'red_bgc')}
        `;
        let truncatedText = helpText.replace(/^\n+|\n+$/g, '');
        let untabbedText = truncatedText.replace(/^[ ]+/gm, '');
        console.log(untabbedText);

    }

    setNormalizedUserArguments = (normalizedUserArguments) => {
        this.NORMALIZED_USER_ARGUMENTS = normalizedUserArguments;
    }

    setUserName = (name) => {
        this.USER_NAME = name;
    }

    setNodeVersion = (nodeVersion) => {
        this.NODE_VERSION = nodeVersion;
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

    setColorizerProperties = (colorizerProperties) => {
        this.COLORIZER_PROPERTIES = colorizerProperties;
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

    setCompressTool = (compressTool) => {
        this.CT = compressTool;
    }

    setClassPropertyValueOutside = (classInstance, classPropertyName, propertyValue) => {
        classInstance[classPropertyName] = propertyValue;
    }

}

export { CommandLineInterface };