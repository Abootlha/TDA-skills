const crypto = require('crypto');

function decryptSecret(encryptedHex, secret) {
    try {
        const keyData = crypto.createHash('sha256').update(secret).digest();

        const encryptedBytes = Buffer.from(encryptedHex, 'hex');
        const nonce = encryptedBytes.slice(0, 12);
        const ciphertext = encryptedBytes.slice(12, encryptedBytes.length - 16);
        const authTag = encryptedBytes.slice(encryptedBytes.length - 16);

        const decipher = crypto.createDecipheriv('aes-256-gcm', keyData, nonce);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(ciphertext, null, 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        return "Error: " + e.message;
    }
}

const hex = "4c25bd31799987f48877481f9cabcc2ff496db90756626a95811387e670a2513ac3c130f7b1b311581986b227173f2afa7801b155afcf1506838acce71d4424b56e34c5f20f4bd858eafedc1e0b9297da1fc985875c8383b2d2e";
const secret = "a8b3c9f2-7d4e-41a5-92b8-f1e0d3c7a9b6";
console.log(decryptSecret(hex, secret));
