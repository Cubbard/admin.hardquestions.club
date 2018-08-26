const sha256     = require('sha256');
const alphabet   = require('alphabet');
const randString = require('random-string');


class Crypto
{
    static getSalt() {
        return randString({ special: true, length: 4 });
    } 

    static getPepper() {
        let randI1, randI2, letter1, letter2, isLower;

        randI1 = Math.floor(Math.random() * 25);
        randI2 = Math.floor(Math.random() * 25);
        while (randI1 === randI2) {
            randI2 = Math.floor(Math.random() * 25);
        }

        letter1 = alphabet[randI1];
        letter2 = alphabet[randI2];
        
        isLower = Math.round(Math.random());
        letter1 = !!isLower ? letter1.toLowerCase() : letter1;

        isLower = Math.round(Math.random());
        letter2 = !!isLower ? letter2.toLowerCase() : letter2;

        return letter1 + letter2;
    }

    static getHash(message) {
        const mLength = message.length;
        const randPos = Math.floor(Math.random() * mLength);
        const salt = this.getSalt();

        return [sha256(message.substring(0, randPos) + this.getPepper() + message.substring(randPos) + salt), salt];
    }
}

module.exports = Crypto;