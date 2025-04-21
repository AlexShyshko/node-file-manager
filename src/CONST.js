const MESSAGES = {
    GREETING_MESSAGE: 'Welcome to the File Manager',
    FAREWELL_MESSAGE: 'Thank you for using File Manager',
    FAREWELL_PHRASE: 'goodbye',
    CURRENT_DIRECTORY: 'You are currently in',
    INVALID_INPUT: 'Invalid input',
    OPERATION_FAILED: 'Operation failed',
    OPERATION_SUCCESS: 'Operation was completed successfully',
};

const CLI_COMMANDS = {
    EXIT: '.exit',
    // Navigation
    GO_UP_FROM_DIRECTORY: 'up',
    GO_TO_DIRECTORY: 'cd',
    PRINT_DIRECTORY_CONTENT: 'ls',
    // Files operation
    READ_AND_PRINT_CONTENT_IN_CONSOLE: 'cat',
    CREATE_FILE: 'add',
    CREATE_DIRECTORY: 'mkdir',
    RENAME_FILE: 'rn',
    COPY_FILE: 'cp',
    CUT_FILE: 'mv',
    DELETE_FILE: 'rm',
    // OS info
    OPERATING_SYSTEM: 'os',
    // Hash
    HASH_ALGORITHMS: 'hashalg',
    HASH_ENCODINGS: 'hashenc',
    HASH: 'hash',
    // Compress
    COMPRESS: 'compress',
    DECOMPRESS: 'decompress',

};

const CLI_ARGUMENTS_CREDENTIALS = {
    ARGUMENT_MARKER: /^--/,
    ARGUMENT_OPERATOR: '=',
    ARGUMENT_INVALID: 'Invalid argument',
    ARGUMENT_VALUE_END_OF_LINE: 'EOL',
    ARGUMENT_VALUE_CPUS: 'cpus',
    ARGUMENT_VALUE_HOME_DIRECTORY: 'homedir',
    ARGUMENT_VALUE_SYSTEM_USER_NAME: 'username',
    ARGUMENT_VALUE_CPU_ARCHITECTURE: 'architecture',
    ARGUMENT_VALUE_ALGORITHM: 'alg',
    ARGUMENT_VALUE_ENCODING: 'enc',
}

const COLORIZER_PROPERTIES = {
    TRANSFORM_CHUNK_COLOR: 'magenta_bgc',
}

export {
    MESSAGES,
    CLI_COMMANDS,
    CLI_ARGUMENTS_CREDENTIALS,
    COLORIZER_PROPERTIES
}