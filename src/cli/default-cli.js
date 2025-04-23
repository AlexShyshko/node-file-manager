import { CommandLineInterface } from './cli.js';
import { NODE_VERSION, MESSAGES, CLI_COMMANDS, CLI_ARGUMENTS_CREDENTIALS, COLORIZER_PROPERTIES } from '../CONST.js';
import { MessageColorizer } from '../message-colorizer/message-colorizer.js';
import { Navigator } from '../navigator/navigator.js';
import { FileManager } from '../file-manager/file-manager.js';
import { OperatingSystemReport } from '../operating-system-report/operating-system-report.js';
import { HashTool } from '../hash-tool/hash-tool.js';
import { CompressTool } from '../compress-tool/compress-tool.js';

class DefaultCommandLineInterface extends CommandLineInterface {

    static NODE_VERSION = NODE_VERSION;
    static MESSAGES = MESSAGES;
    static CLI_COMMANDS = CLI_COMMANDS;
    static CLI_ARGUMENTS_CREDENTIALS = CLI_ARGUMENTS_CREDENTIALS;
    static COLORIZER_PROPERTIES = COLORIZER_PROPERTIES;
    static MC = new MessageColorizer();
    static NV = new Navigator();
    static FM = new FileManager();
    static OSR = new OperatingSystemReport();
    static HT = new HashTool();
    static CT = new CompressTool();

    constructor() {

        super();

        this.setNodeVersion(DefaultCommandLineInterface.NODE_VERSION);
        this.setMessages(DefaultCommandLineInterface.MESSAGES);
        this.setCommands(DefaultCommandLineInterface.CLI_COMMANDS);
        this.setArgumentsCredentials(DefaultCommandLineInterface.CLI_ARGUMENTS_CREDENTIALS);
        this.setColorizerProperties(DefaultCommandLineInterface.COLORIZER_PROPERTIES);
        this.setMessageColorizer(DefaultCommandLineInterface.MC);
        this.setNavigator(DefaultCommandLineInterface.NV);
        this.setFileManager(DefaultCommandLineInterface.FM);
        this.setOperatingSystemReport(DefaultCommandLineInterface.OSR);
        this.setHashTool(DefaultCommandLineInterface.HT);
        this.setCompressTool(DefaultCommandLineInterface.CT);

        this.setClassPropertyValueOutside(this.MC, 'TRANSFORM_CHUNK_COLOR', COLORIZER_PROPERTIES.TRANSFORM_CHUNK_COLOR);
        this.setClassPropertyValueOutside(this.NV, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.FM, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.OSR, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.OSR, 'CLI_ARGUMENTS_CREDENTIALS', this.CLI_ARGUMENTS_CREDENTIALS);
        this.setClassPropertyValueOutside(this.HT, 'MC', this.MC);
        this.setClassPropertyValueOutside(this.HT, 'CLI_ARGUMENTS_CREDENTIALS', this.CLI_ARGUMENTS_CREDENTIALS);
        this.setClassPropertyValueOutside(this.CT, 'MC', this.MC);

    }

}

export { DefaultCommandLineInterface };