const crypto = require('crypto');

async function decryptSecret(encryptedHex, secret) {
    try {
        const keyData = crypto.createHash('sha256').update(secret).digest();
        const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']);

        const encryptedBytes = new Uint8Array(encryptedHex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
        const nonce = encryptedBytes.slice(0, 12);
        const ciphertext = encryptedBytes.slice(12);

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: nonce },
            cryptoKey,
            ciphertext
        );

        return new TextDecoder().decode(decryptedBuffer);
    } catch (e) {
        return null;
    }
}

const hex = "4c25bd31799987f48877481f9cabcc2ff496db90756626a95811387e670a2513ac3c130f7b1b311581986b227173f2afa7801b155afcf1506838acce71d4424b56e34c5f20f4bd858eafedc1e0b9297da1fc985875c8383b2d2e";
const secret = "a8b3c9f2-7d4e-41a5-92b8-f1e0d3c7a9b6";
decryptSecret(hex, secret).then(console.log);
