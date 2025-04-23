import { platform, userInfo, homedir } from 'os';
import path from 'path';
import { access, stat, readdir } from 'fs/promises';

class Navigator {

    constructor() {

        this.PLATFORM = platform();
        this.setStartingWorkingDirectory();
        this.setCurrentWorkingDirectory(this.STARTING_WORKING_DIRECTORY);

    }

    up = () => {

        let currentWorkingDirectory = process.cwd();
        let root = path.parse(currentWorkingDirectory).root;

        if (currentWorkingDirectory === root) {
            return new Error(`${this.MC.colorize(currentWorkingDirectory, 'yellow')} ${this.MC.colorize('is a root. The application can\'t navigate above the root directory.', 'red')}`);
        } else {

            let upPath = path.join(currentWorkingDirectory, '../');
            this.setCurrentWorkingDirectory(upPath);

        }
        
    }

    goDirectory = async (directoryPathParameter) => {

        let operationResult;

        await access(directoryPathParameter)
		.then(async () => {
            
            await stat(directoryPathParameter).then(

                (promiseResponse) => {

                    if (promiseResponse.isDirectory()) {
                        this.setCurrentWorkingDirectory(directoryPathParameter);
                    } else {

                        let absolutePath = path.resolve(directoryPathParameter);
                        operationResult = new Error(`${this.MC.colorize(absolutePath, 'yellow')} ${this.MC.colorize('is not a directory.', 'red')}`);

                    }
                    
                },

                (promiseError) => {
                    
                    promiseError.message = this.MC.colorize(promiseError.message, 'red');
                    operationResult = promiseError;

                }

            );

		})
		.catch((e) => {

            e.message = this.MC.colorize(e.message, 'red');
			operationResult = e;

		});

        return operationResult;

    }

    printContent = async () => {

        let currentWorkingDirectory = process.cwd();
        let contentList = await readdir(currentWorkingDirectory);
        let contentListPromises = contentList.map(async (item) => {

            let itemPath = path.join(currentWorkingDirectory, item);
            let itemStatistic = {
                name: item,
            };

            await stat(itemPath).then(

                (promiseResponse) => {
                    itemStatistic.type = promiseResponse.isDirectory() ? 'directory' : 'file';
                },

                (promiseError) => {
                    itemStatistic.type = promiseError.message;
                }

            );

            return itemStatistic;

        });
        let detailedContentList = await Promise.all(contentListPromises);
        detailedContentList.sort((a, b) => {

            let aName = a.name.toLowerCase();
            let bName = b.name.toLowerCase();

            if (a.type === 'directory' && b.type !== 'directory') {
                return -1;
            } else if (a.type !== 'directory' && b.type === 'directory') {
                return 1;
            } else if (a.type === 'directory' && b.type === 'directory') {
                return (aName < bName) ? -1 : 1;
            } else {

                if (a.type === 'file' && b.type !== 'file') {
                    return -1;
                } else if (a.type !== 'file' && b.type === 'file') {
                    return 1;
                } else if (a.type === 'file' && b.type === 'file') {
                    return (aName < bName) ? -1 : 1;
                } else {
                    return (aName < bName) ? -1 : 1;
                }

            }

        });

        console.table(detailedContentList);

    }

    goHome = async () => {

        let homePath = path.join(import.meta.dirname, '../FILES FOR PRESENTATION/RESULT');
        return await this.goDirectory(homePath);

    }

    setStartingWorkingDirectory = () => {

        let startingWorkingDirectory;

        switch (this.PLATFORM) {

            case 'win32':
                startingWorkingDirectory = homedir() || process.env.USERPROFILE;
                break;
            case 'darwin':
                startingWorkingDirectory = homedir() || path.join('/Users', userInfo().username);
                break;
            case 'linux':
                startingWorkingDirectory = homedir() || path.join('/home', userInfo().username);
                break;
            default:
                startingWorkingDirectory = homedir() || process.cwd();

        }

        this.STARTING_WORKING_DIRECTORY = startingWorkingDirectory;

    }

    setCurrentWorkingDirectory = (directoryPath) => {
        process.chdir(directoryPath);
    }

    setMessageColorizer = (messageColorizer) => {
        this.MC = messageColorizer;
    }


}

export { Navigator }