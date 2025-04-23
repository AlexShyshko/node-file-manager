import path from 'path';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { stat, createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';

class CompressTool {

    constructor() {

        this.DEFAULT_EXTENSION_REGEXP = /\.br$/i;
        this.DEFAULT_EXTENSION = 'br';

    }

    compressDecompressFileBrotli = (filePath, destinationFilePath, operationType) => {

        return new Promise((resolve, reject) => {

            try {

                let absolutePath = path.resolve(filePath);
                let destinationAbsolutePath = path.resolve(destinationFilePath);
                let pathToMatchExtension;
                let compressorDecompressor;

                switch (operationType) {

                    case 'compress':

                        pathToMatchExtension = destinationAbsolutePath;
                        compressorDecompressor = createBrotliCompress();
                        break;

                    case 'decompress':

                        pathToMatchExtension = absolutePath;
                        compressorDecompressor = createBrotliDecompress();
                        break;
                        
                    default:
                        reject(new Error(`${this.MC.colorize('Unknown operation type ' , 'red')} ${this.MC.colorize(operationType, 'yellow')}`));

                }

                stat(filePath, (statError, stats) => {

                    if (statError) {

                        statError.message = this.MC.colorize(statError.message, 'red');
                        reject(statError); 

                    } else {

                        if (!stats.isFile()) {
                            reject(new Error(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('is not a file.', 'red')}`));
                        } else {

                            let correctFileExtension = this.DEFAULT_EXTENSION_REGEXP.test(pathToMatchExtension);

                            if (correctFileExtension) {

                                stat(destinationAbsolutePath, (destinationStatError, destinationStats) => {

                                    if (destinationStatError) {

                                        if (destinationStatError.code === 'ENOENT') {

                                            let readStream = createReadStream(absolutePath);
                                            let writeStream = createWriteStream(destinationAbsolutePath);

                                            pipeline(readStream, compressorDecompressor, writeStream, (pipelineError) => {

                                                if (pipelineError) {

                                                    pipelineError.message = this.MC.colorize(pipelineError.message, 'red');
                                                    reject(pipelineError); 

                                                } else {
                                                    resolve(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has been ' + operationType + 'ed to', 'green')} ${this.MC.colorize(destinationAbsolutePath, 'yellow')}`);
                                                }

                                            });

                                        } else {

                                            destinationStatError.message = this.MC.colorize(destinationStatError.message, 'red');
                                            reject(destinationStatError); 

                                        }

                                    } else {
                                        reject(new Error(`${this.MC.colorize(destinationAbsolutePath, 'yellow')} ${this.MC.colorize('has already exist.' , 'red')}`));
                                    }

                                });

                            } else {
                                reject(new Error(`${this.MC.colorize(pathToMatchExtension, 'yellow')} ${this.MC.colorize('file name extension must be', 'red')} ${this.MC.colorize(this.DEFAULT_EXTENSION, 'yellow')}`));
                            }

                        }

                    }

                });

            } catch(e) {

                e.message = this.MC.colorize(e.message, 'red');
                reject(e); 

            }

        });

    }
    
}

export { CompressTool }