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

const hex = "1a9917b7137f73cb9f38b252e0f24480427564bbc0158012a51f04e78a85e58645a8952a1c89f03c8804609e2ab2cfa57e6c39edf1658e3806786d0a250c66ff196f01cb35eb00e088de9ad35f43";
const secret = "a8b3c9f2-7d4e-41a5-92b8-f1e0d3c7a9b6";
decryptSecret(hex, secret).then(console.log);
