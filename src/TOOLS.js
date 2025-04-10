import { MESSAGES, CLI_COMMANDS } from './CONST.js';

import { CommandLineInterface } from './cli/cli.js';
import { FileManager } from './file-manager/file-manager.js';
import { MessageColorizer } from './message-colorizer/message-colorizer.js';

const CLI = new CommandLineInterface(MESSAGES, CLI_COMMANDS);
const FM = new FileManager();
const MC = new MessageColorizer();

export { CLI, FM, MC }