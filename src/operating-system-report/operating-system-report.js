import { EOL, cpus, homedir, userInfo, arch } from 'os';

class OperatingSystemReport {

    constructor() {

        this.END_OF_LINE = EOL;
        this.CPUS = cpus();
        this.HOME_DIRECTORY = homedir() || process.cwd();
        this.SYSTEM_USER_NAME = userInfo().username;
        this.CPU_ARCHITECTURE = arch();

    }

    printReport = (userArguments) => {

        try {
            
            if (Object.keys(userArguments).length === 0) {
                throw new Error(`${this.MC.colorize('No arguments has been passed.' , 'red')}`);
            } else {

                let reportSummary = this.getReport(userArguments);
            
                for (let argument in reportSummary) {
                    console.log(`${this.MC.colorize(argument + ' =', 'green')} ${this.MC.colorize(reportSummary[argument], 'yellow')}`);
                }
    
            }

        } catch(e) {
            return e;
        }

    }

    getReport = (userArguments) => {

        try {

            let reportSummary = Object.keys(userArguments).reduce((acc, key) => {

                switch (key) {

                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_END_OF_LINE:
                        acc[key] = this.normalizeStringWithBackslashs(this.END_OF_LINE);
                        break;
                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_CPUS:
                        acc[key] = this.normalizeCpus(this.CPUS);
                        break;
                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_HOME_DIRECTORY:
                        acc[key] = this.HOME_DIRECTORY;
                        break;
                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_SYSTEM_USER_NAME:
                        acc[key] = this.SYSTEM_USER_NAME;
                        break;
                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_CPU_ARCHITECTURE:
                        acc[key] = this.CPU_ARCHITECTURE;
                        break;
                    default:
                        throw this.unknownArgumentHandler(key);

                }

                return acc;

            }, {});

            return reportSummary;

        } catch(e) {
            throw e;
        }

    }

    printOptionalArguments = () => {
        
        let supportedOptionalArguments = this.getOptionalArguments();
        console.log(`${this.MC.colorize('Supported optional arguments:', 'green')} ${this.MC.colorize(supportedOptionalArguments.join(', '), 'yellow')}`);

    }

    getOptionalArguments = () => {
        return [this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_END_OF_LINE, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_CPUS, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_HOME_DIRECTORY, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_SYSTEM_USER_NAME, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_CPU_ARCHITECTURE];
    }

    unknownArgumentHandler = (argument) => {
        return new Error(`${this.MC.colorize(this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_INVALID, 'red')} ${this.MC.colorize(argument, 'yellow')}`);
    }

    normalizeStringWithBackslashs = (stringWithBackslashs) => {
        return JSON.parse(JSON.stringify(stringWithBackslashs).replaceAll('\\', '\\\\'));
    }

    normalizeCpus = (cpusArray) => {

        let amountInformation = `${this.MC.colorize('The overall amount of CPU cores:', 'yellow')} ${this.MC.colorize(cpusArray.length, 'blue')}`;
        let result = cpusArray.reduce((acc, key, index) => {

            let coreInfo = `${this.MC.colorize('\n\tCore ' + (index + 1) + ': model -', 'yellow')} ${this.MC.colorize('"' + key.model + '"', 'blue')}${this.MC.colorize('; clock rate -', 'yellow')} ${this.MC.colorize((key.speed / 1000) + ' GHz', 'blue')}`;
            acc+=coreInfo;

            return acc;

        }, amountInformation);

        return result;
        
    }

    setArgumentsCredentials = (argumentsCredentials) => {
        this.CLI_ARGUMENTS_CREDENTIALS = argumentsCredentials;
    }

    setMessageColorizer = (messageColorizer) => {
        this.MC = messageColorizer;
    }

}

export { OperatingSystemReport }