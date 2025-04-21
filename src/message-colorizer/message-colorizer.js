import { Transform } from 'stream';

class MessageColorizer {

    constructor() {
        this.ESCAPE_CHARACTER_DEFAULT = this.escapeCharacterWrapper('0');
        this.TRANSFORM_CHUNK_COLOR = 'white';
    }

    colorize = (message, attribute) => {

        let colorCode = this.mapAttribute(attribute);
        let escapeCharacter = this.escapeCharacterWrapper(colorCode);
        let stringifiedObject = this.isObject(message) ? this.objectNormalizer(message) : message;
        let coloredString = `${escapeCharacter}${stringifiedObject}${this.ESCAPE_CHARACTER_DEFAULT}`;
        return coloredString;

    }

    mapAttribute = (attribute) => {

        let colorCode;

        switch (attribute) {

            case 'black':
                colorCode = '30';
                break;
            case 'red':
                colorCode = '31';
                break;
            case 'green':
                colorCode = '32';
                break;
            case 'yellow':
                colorCode = '33';
                break;
            case 'blue':
                colorCode = '34';
                break;
            case 'magenta':
                colorCode = '35';
                break;
            case 'cyan':
                colorCode = '36';
                break;
            case 'white':
                colorCode = '37';
                break;
            case 'black_bgc':
                colorCode = '40';
                break;
            case 'red_bgc':
                colorCode = '41';
                break;
            case 'green_bgc':
                colorCode = '42';
                break;
            case 'yellow_bgc':
                colorCode = '43';
                break;
            case 'blue_bgc':
                colorCode = '44';
                break;
            case 'magenta_bgc':
                colorCode = '45';
                break;
            case 'cyan_bgc':
                colorCode = '46';
                break;
            case 'white_bgc':
                colorCode = '47';
                break;
            default:
                colorCode = '0';

        }

        return colorCode

    }

    escapeCharacterWrapper = (code) => {
        return `\x1b[${code}m`;
    }

    
    isObject = (variable) => {
        return variable !== null && typeof variable === 'object';
    }

    objectNormalizer = (object) => {
        return JSON.stringify(object, (key, value) => {
            return value === undefined ? "undefined" : value;
        }, '\t');
    }

    setTransformChunkColor = (color) => {
        this.TRANSFORM_CHUNK_COLOR = color;
    }

    getTransformStreamColorizer = (color = this.TRANSFORM_CHUNK_COLOR) => {

        return new Transform({
            transform: (chunk, encoding, callback) => {

                try {

                    let stringifiedChunk = String(chunk);

                    let asciiChars = stringifiedChunk.match(/[\x20-\x7E]/g);
                    let newLineChars = /(\r\n|\n|\r)/g;
                    let is80PercentAscii = asciiChars && asciiChars.length / stringifiedChunk.replace(newLineChars, '').length > 0.8;
                    let asciiAlert = `${this.colorize('The data contains less than 80% ASCII characters. It seems that this is not a text data. But the transform stream will continue anyway.\n', 'red')}`;
                    is80PercentAscii ? null : process.stdout.write(asciiAlert);

                    callback(null, `${this.colorize(stringifiedChunk, color)}`);

                } catch(e) {
                    throw e;
                }
                
            },
        });

    }

}

export { MessageColorizer };