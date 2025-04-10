class MessageColorizer {

    constructor() {
        this.ESCAPE_CHARACTER_DEFAULT = this.escapeCharacterWrapper('0');
    }

    colorize = (message, attribute) => {

        let colorCode = this.mapAttribute(attribute);
        let escapeCharacter = this.escapeCharacterWrapper(colorCode);
        let stringifiedObject = this.isObject(message) ? this.objectNormalizer(message) : message;
        return `${escapeCharacter}${stringifiedObject}${this.ESCAPE_CHARACTER_DEFAULT}`;

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

}

export { MessageColorizer };