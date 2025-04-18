import { CommandLineInterface } from './cli.js';
import { MESSAGES, CLI_COMMANDS, CLI_ARGUMENTS_CREDENTIALS, COLORIZER_PROPERTIES } from '../CONST.js';
import { MessageColorizer } from '../message-colorizer/message-colorizer.js';
import { Navigator } from '../navigator/navigator.js';
import { FileManager } from '../file-manager/file-manager.js';

class DefaultCommandLineInterface extends CommandLineInterface {

    static MESSAGES = MESSAGES;
    static CLI_COMMANDS = CLI_COMMANDS;
    static CLI_ARGUMENTS_CREDENTIALS = CLI_ARGUMENTS_CREDENTIALS;
    static MC = new MessageColorizer();
    static NV = new Navigator();
    static FM = new FileManager();

    constructor() {

        super();

        this.setMessages(DefaultCommandLineInterface.MESSAGES);
        this.setCommands(DefaultCommandLineInterface.CLI_COMMANDS);
        this.setArgumentsCredentials(DefaultCommandLineInterface.CLI_ARGUMENTS_CREDENTIALS);
        this.setMessageColorizer(DefaultCommandLineInterface.MC);
        this.setNavigator(DefaultCommandLineInterface.NV);
        this.setFileManager(DefaultCommandLineInterface.FM);

        this.MC.setTransformChunkColor(COLORIZER_PROPERTIES.TRANSFORM_CHUNK_COLOR);

        this.setMessageColorizerOutside(this.NV, this.MC);
        this.setMessageColorizerOutside(this.FM, this.MC);

    }

}

export { DefaultCommandLineInterface };