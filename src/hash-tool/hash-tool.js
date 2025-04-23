import path from 'path';
import { createReadStream } from 'fs';
import { getHashes, createHash } from 'crypto';

class HashTool {

    constructor() {

        this.DEFAULT_ALGORITHM = 'SHA256';
        this.DEFAULT_ENCODING = 'HEX';

    }

    printOptionalArguments = () => {
        
        let supportedOptionalArguments = this.getOptionalArguments();
        console.log(`${this.MC.colorize('Supported optional arguments:', 'green')} ${this.MC.colorize(supportedOptionalArguments.join(', '), 'yellow')}`);

    }

    printHashAlgorithms = () => {

        let supportedAlgorithms = getHashes();
        console.log(`${this.MC.colorize('Supported hash algorithms:', 'green')} ${this.MC.colorize(supportedAlgorithms.join(', '), 'yellow')}`);

    }

    printHashEncodings = () => {

        let supportedEncodings = this.getHashEncodings();
        console.log(`${this.MC.colorize('Supported digest encodings:', 'green')} ${this.MC.colorize(supportedEncodings.join(', '), 'yellow')}`);

    }

    printHash = (filePath, cliArguments) => {

        try {

            let checkedCliArguments = this.getCheckedCliArguments(cliArguments);
            let passedAlgorithm = checkedCliArguments[this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ALGORITHM];
            let passedEncoding = checkedCliArguments[this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ENCODING];
            let isUndefinedPassedEncoding = passedEncoding === undefined;
            let isNullPassedEncoding = passedEncoding === null;
            let isEmptyPassedEncoding = passedEncoding === '';
            let supportedAlgorithms = getHashes();
            let includingIndex = supportedAlgorithms.findIndex((algorithmName) => {
                return new RegExp(`^${passedAlgorithm}$`, 'i').test(algorithmName);
            });
            
            if (passedAlgorithm && includingIndex === -1) {
                return new Error(`${this.MC.colorize(passedAlgorithm, 'yellow')} ${this.MC.colorize('is not in supported algorithms:', 'red')} ${this.MC.colorize(supportedAlgorithms.join(', '), 'yellow')}`);
            } else {

                return new Promise((resolve, reject) => {

                    this.getHash(filePath, checkedCliArguments[this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ALGORITHM]).then(
    
                        (promiseResponse) => {
    
                            let absolutePath = path.resolve(filePath);
                            let algorithm = passedAlgorithm ?? this.DEFAULT_ALGORITHM;
                            let encoding = (isUndefinedPassedEncoding && !isNullPassedEncoding && !isEmptyPassedEncoding) ? this.DEFAULT_ENCODING : passedEncoding;
                            let hashDidgest = promiseResponse.digest(encoding);

                            if (hashDidgest instanceof Buffer && encoding) {

                                let supportedEncodings = this.getHashEncodings();
                                reject(new Error(`${this.MC.colorize(encoding, 'yellow')} ${this.MC.colorize('is not in supported encodings:', 'red')} ${this.MC.colorize(supportedEncodings.join(', '), 'yellow')}`));

                            } else {

                                console.log(`${this.MC.colorize('Hash for', 'green')} ${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('is:', 'green')} ${this.MC.colorize((hashDidgest instanceof Buffer ? JSON.stringify(hashDidgest) : hashDidgest), 'yellow_bgc')}${this.MC.colorize('. Algorithm:', 'green')} ${this.MC.colorize(algorithm, 'yellow')}${this.MC.colorize(', encoding:', 'green')} ${this.MC.colorize(encoding, 'yellow')}`);
                                resolve();

                            }

                        },
    
                        (promiseError) => {
                            reject(promiseError);
                        }
    
                    );
    
                });

            }

        } catch(e) {

            e.message = this.MC.colorize(e.message, 'red');
            return e;
            
        }

    }

    getHash = (filePath, algorithm = this.DEFAULT_ALGORITHM, options = {}) => {

        return new Promise((resolve, reject) => {

            try {

                let absolutePath = path.resolve(filePath);
                let hash = createHash(algorithm, options);
                let readStream = createReadStream(absolutePath);
            
                readStream.on('error', (readStreamError) => {
    
                    readStreamError.message = this.MC.colorize(readStreamError.message, 'red');
                    reject(readStreamError);
    
                });
    
                readStream.on('data', (chunk) => {
                    hash.update(chunk);
                });
            
                readStream.on('end', () => {
                    resolve(hash);
                });

            } catch(e) {

                e.message = this.MC.colorize(e.message, 'red');
                reject(e);

            }

        });

    }

    getCheckedCliArguments = (cliArguments) => {

        try {

            let checkedCliArguments = Object.keys(cliArguments).reduce((acc, key) => {

                switch (key) {

                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ALGORITHM:
                        if (cliArguments[key]) {
                            acc[key] = cliArguments[key];
                        }
                        break;
                    case this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ENCODING:
                        acc[key] = cliArguments[key];
                        break;
                    default:
                        throw this.unknownArgumentHandler(key);

                }

                return acc;

            }, {});

            return checkedCliArguments;

        } catch(e) {

            e.message = this.MC.colorize(e.message, 'red');
            throw e;

        }

    }

    getOptionalArguments = () => {
        return [this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ALGORITHM, this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_VALUE_ENCODING];
    }

    getHashEncodings = () => {

        let binaryToTextEncoding = ['base64', 'base64url', 'hex', 'binary'];
        let characterEncoding = ['utf8', 'utf-8', 'utf16le', 'utf-16le', 'latin1'];
        let legacyCharacterEncoding = ['ascii', 'binary', 'ucs2', 'ucs-2'];

        let resultArray = binaryToTextEncoding.slice(0, -1).concat(characterEncoding).concat(legacyCharacterEncoding);
        return resultArray;

    }

    unknownArgumentHandler = (argument) => {
        return new Error(`${this.MC.colorize(this.CLI_ARGUMENTS_CREDENTIALS.ARGUMENT_INVALID, 'red')} ${this.MC.colorize(argument, 'yellow')}`);
    }

    setMessageColorizer = (messageColorizer) => {
        this.MC = messageColorizer;
    }

}

export { HashTool };