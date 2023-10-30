export class Generator {

    static getId() {
        const uid =
            BigInt(10000000000000000n) * BigInt(1) +
            BigInt(1000000000000000000000n) +
            BigInt(new Date().getTime()) * BigInt(1000) +
            BigInt(Math.floor(Math.random() * 1000));
        return this.encodeNumber(uid);
    }

    static encodeNumber(number: bigint): string {
        const alphabet: string =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const base: number = alphabet.length;
        let encoded: string = "";

        while (number > 0n) {
            const remainder: number = Number(number % BigInt(base));
            encoded = alphabet[remainder] + encoded;
            number = number / BigInt(base);
        }
        // If the encoded string is empty, the input number is 0
        if (encoded === "") {
            encoded = "0";
        }

        return encoded;
    }

    static decodeNumber(encoded: string): BigInt {
        const alphabet: string =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const base: number = alphabet.length;
        let number: bigint = 0n;

        for (let i: number = 0; i < encoded.length; i++) {
            const char: string = encoded[i];
            const charValue: number = alphabet.indexOf(char);
            if (charValue === -1) {
                throw new Error("Invalid character in encoded string");
            }
            number = number * BigInt(base) + BigInt(charValue);
        }
        return number;
    }
}