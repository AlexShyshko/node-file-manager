import { CommandLineInterface } from './cli.js';
import { MESSAGES, CLI_COMMANDS, CLI_ARGUMENTS_CREDENTIALS, COLORIZER_PROPERTIES } from '../CONST.js';
import { MessageColorizer } from '../message-colorizer/message-colorizer.js';
import { Navigator } from '../navigator/navigator.js';
import { FileManager } from '../file-manager/file-manager.js';
import { OperatingSystemReport } from '../operating-system-report/operating-system-report.js';
import { HashTool } from '../hash-tool/hash-tool.js';

class DefaultCommandLineInterface extends CommandLineInterface {

    static MESSAGES = MESSAGES;
    static CLI_COMMANDS = CLI_COMMANDS;
    static CLI_ARGUMENTS_CREDENTIALS = CLI_ARGUMENTS_CREDENTIALS;
    static MC = new MessageColorizer();
    static NV = new Navigator();
    static FM = new FileManager();
    static OSR = new OperatingSystemReport();
    static HT = new HashTool();

    constructor() {

        super();

        this.setMessages(DefaultCommandLineInterface.MESSAGES);
        this.setCommands(DefaultCommandLineInterface.CLI_COMMANDS);
        this.setArgumentsCredentials(DefaultCommandLineInterface.CLI_ARGUMENTS_CREDENTIALS);
        this.setMessageColorizer(DefaultCommandLineInterface.MC);
        this.setNavigator(DefaultCommandLineInterface.NV);
        this.setFileManager(DefaultCommandLineInterface.FM);
        this.setOperatingSystemReport(DefaultCommandLineInterface.OSR);
        this.setHashTool(DefaultCommandLineInterface.HT);

        this.MC.setTransformChunkColor(COLORIZER_PROPERTIES.TRANSFORM_CHUNK_COLOR);

        this.setClassPropertyValueOutside(this.NV, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.FM, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.OSR, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.OSR, 'CLI_ARGUMENTS_CREDENTIALS', this.CLI_ARGUMENTS_CREDENTIALS);
        this.setClassPropertyValueOutside(this.HT, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.HT, 'CLI_ARGUMENTS_CREDENTIALS', this.CLI_ARGUMENTS_CREDENTIALS);

    }

}

export { DefaultCommandLineInterface };