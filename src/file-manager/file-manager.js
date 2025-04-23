import path from 'path';
import { access, stat, writeFile, mkdir } from 'fs';
import { createReadStream, createWriteStream, rename, unlink } from 'fs';
import { Buffer } from 'buffer';

class FileManager {

    constructor() {}

    readAndPrint = (filePath) => {

        return new Promise((resolve, reject) => {

            access(filePath, (accessError) => {

                if (accessError) {

                    accessError.message = this.MC.colorize(accessError.message, 'red');
                    reject(accessError);

                } else {

                    stat(filePath, (statError, stats) => {

                        if (statError) {

                            statError.message = this.MC.colorize(statError.message, 'red');
                            reject(statError); 

                        } else {

                            let absolutePath = path.resolve(filePath);

                            if (!stats.isFile()) {
                                reject(new Error(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('is not a file.', 'red')}`));
                            } else {
                                
                                try {

                                    let readStream = createReadStream(absolutePath);
                                    let transformStream = this.MC.getTransformStreamColorizer();

                                    readStream.pipe(transformStream).pipe(process.stdout);

                                    readStream.on('error', (readStreamError) => {
                                    
                                        readStreamError.message = this.MC.colorize(readStreamError.message, 'red');
                                        reject(readStreamError); 
    
                                    });
    
                                    readStream.on('end', () => {
    
                                        transformStream.unpipe(process.stdout);
                                        readStream.unpipe(transformStream);
                                        process.stdout.write('\n');
                                        resolve(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('content', this.MC.TRANSFORM_CHUNK_COLOR)} ${this.MC.colorize('has been printed above.', 'green')}`);
    
                                    });

                                } catch(e) {

                                    e.message = this.MC.colorize(e.message, 'red');
                                    reject(e); 

                                }

                            }

                        }

                    });

                }

            })

        });

    }

    createFileOrDirectory = (name, type, buffer = Buffer.alloc(0)) => {

        return new Promise((resolve, reject) => {

            let nameCheckResult = this.checkFileOrDirectoryName(name);
            let isErrorCheck = nameCheckResult instanceof Error;
            let isNameNotValid = nameCheckResult;

            if (isErrorCheck) {
                reject(nameCheckResult);
            } else if (isNameNotValid) {
                reject(new Error(`${this.MC.colorize('Characters not allowed for a ' + type + ' name', 'red')} ${this.MC.colorize('(' + isNameNotValid.join(', ') + ')', 'yellow')} ${this.MC.colorize('were found.', 'red')}`));
            } else {

                stat(name, (statError, stats) => {

                    let absolutePath = path.resolve(name);

                    if (statError) {
                        
                        if (statError.code === 'ENOENT') {

                            let successMessage = `${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has been added.', 'green')}`;
                            let unifiedCallback = this.getUnifiedCallback(reject, resolve.bind(null, successMessage));
                            
                            switch (type) {

                                case 'file':

                                    writeFile(absolutePath, buffer, unifiedCallback);    

                                    break;

                                case 'directory':

                                    mkdir(absolutePath, unifiedCallback);

                                    break;
                                    
                                default:
                                    reject(new Error(`${this.MC.colorize('Unknown operation type ' , 'red')} ${this.MC.colorize(type, 'yellow')}`));

                            }

                        } else {

                            statError.message = this.MC.colorize(statError.message, 'red');
                            reject(statError); 

                        }

                    } else {
                        reject(new Error(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has already exist.' , 'red')}`));
                    }
    
                });

            }

        });

    }

    renameFile = (filePath, newFileName) => {

        return new Promise((resolve, reject) => {

            let nameCheckResult = this.checkFileOrDirectoryName(newFileName);
            let isErrorCheck = nameCheckResult instanceof Error;
            let isNameNotValid = nameCheckResult;

            if (isErrorCheck) {
                reject(nameCheckResult);
            } else if (isNameNotValid) {
                reject(new Error(`${this.MC.colorize('Characters not allowed for a file name', 'red')} ${this.MC.colorize('(' + isNameNotValid.join(', ') + ')', 'yellow')} ${this.MC.colorize('were found.', 'red')}`));
            } else {

                let absolutePath = path.resolve(filePath);
                let directoryPath = path.dirname(absolutePath);
                let renamedFilePath = path.join(directoryPath, newFileName);

                stat(renamedFilePath, (statError, stats) => {

                    if (statError) {
        
                        if (statError.code === 'ENOENT') {

                            let successMessage = `${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has been renamed to', 'green')} ${this.MC.colorize(renamedFilePath, 'yellow')}`;
                            let unifiedCallback = this.getUnifiedCallback(reject, resolve.bind(null, successMessage));
                            
                            rename(absolutePath, renamedFilePath, unifiedCallback);

                        } else {

                            statError.message = this.MC.colorize(statError.message, 'red');
                            reject(statError); 

                        }
        
                    } else {
                        reject(new Error(`${this.MC.colorize(renamedFilePath, 'yellow')} ${this.MC.colorize('has already exist.' , 'red')}`));
                    }
        
                });

            }

        });
        
    }

    copyFile = (filePath, directoryPath) => {

        return new Promise((resolve, reject) => {

            let absolutePath = path.resolve(filePath);
            let fileName = path.basename(absolutePath);
            let absoluteDestinationFolderPath = path.resolve(directoryPath);
            let newAbsolutePath = path.join(absoluteDestinationFolderPath, fileName);

            stat(absolutePath, (statError, stats) => {

                if (statError) {

                    statError.message = this.MC.colorize(statError.message, 'red');
                    reject(statError);

                } else {

                    if (!stats.isFile()) {
                        reject(new Error(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('is not a file.', 'red')}`));
                    } else {

                        stat(newAbsolutePath, (statError, stats) => {

                            if (statError) {
            
                                if (statError.code === 'ENOENT') {

                                    let readStream = createReadStream(absolutePath);
                                    let writeStream = createWriteStream(newAbsolutePath);
            
                                    readStream.pipe(writeStream);

                                    let universalStreamErrorHandler = (universalError) => {

                                        this.deleteFile(newAbsolutePath).then(

                                            (promiseResponse) => {
                                                
                                                universalError.message = this.MC.colorize(universalError.message, 'red');
                                                reject(universalError);

                                            },
                        
                                            (promiseError) => {

                                                universalError.message = this.MC.colorize(universalError.message, 'red');
                                                reject(universalError);

                                            }

                                        );

                                    }
            
                                    readStream.on('error', (readStreamError) => {

                                        writeStream.end();
                                        universalStreamErrorHandler(readStreamError);

                                    });

                                    writeStream.on('error', (writeStreamError) => {

                                        readStream.destroy();
                                        universalStreamErrorHandler(writeStreamError);

                                    });

                                    writeStream.on('finish', () => {

                                        readStream.close();
                                        writeStream.close();
                                        resolve(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has been copied to', 'green')} ${this.MC.colorize(newAbsolutePath, 'yellow')}`);
                                    
                                    });
            
                                } else {
            
                                    statError.message = this.MC.colorize(statError.message, 'red');
                                    reject(statError); 
            
                                }
            
                            } else {
                                reject(new Error(`${this.MC.colorize(newAbsolutePath, 'yellow')} ${this.MC.colorize('has already exist.' , 'red')}`));
                            }
            
                        });

                    }

                }

            });

        });

    }

    cutFile = (filePath, directoryPath) => {

        return new Promise((resolve, reject) => {

            let absolutePath = path.resolve(filePath);
            let fileName = path.basename(absolutePath);
            let absoluteDestinationFolderPath = path.resolve(directoryPath);
            let newAbsolutePath = path.join(absoluteDestinationFolderPath, fileName);

            this.copyFile(filePath, directoryPath).then(

                (promiseResponse) => {

                    this.deleteFile(filePath).then(

                        (promiseResponse) => {
                            resolve(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has been moved to', 'green')} ${this.MC.colorize(newAbsolutePath, 'yellow')}`);
                        },
        
                        (promiseError) => {
                            reject(promiseError);
                        }
                
                    );

                },

                (promiseError) => {
                    reject(promiseError);
                }
        
            );

        });

    }

    deleteFile = (filePath) => {

        return new Promise((resolve, reject) => {

            let absolutePath = path.resolve(filePath);
            let successMessage = `${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('has been deleted.', 'green')}`;
            let unifiedCallback = this.getUnifiedCallback(reject, resolve.bind(null, successMessage));

            unlink(filePath, unifiedCallback);

        });

    }

    checkFileOrDirectoryName = (potentialName) => {

        if (!potentialName) {
            return new Error(`${this.MC.colorize('Empty file (or directory) path or name.' , 'red')}`);
        } else {

            try {

                let notAllowedCharacters = /[<>:"\/\\|?*\x00-\x1F]/g;
                return potentialName.match(notAllowedCharacters);
    
            } catch(e) {
                
                e.message = this.MC.colorize(e.message, 'red');
                return e;

            }

        }

    }

    setMessageColorizer = (messageColorizer) => {
        this.MC = messageColorizer;
    }

    getUnifiedCallback = (errorCallback, successCallback) => {

        return (unifiedError) => {

            if (unifiedError) {

                unifiedError.message = this.MC.colorize(unifiedError.message, 'red');
                errorCallback(unifiedError); 

            } else {
                successCallback();
            }

        };
        
    }

}

export { FileManager };