package com.bibimartins.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
@Converter
public class AttributeEncryptor implements AttributeConverter<String, String> {

    private static final String AES = "AES";
    
    // We need a 16, 24, or 32 byte key for AES.
    // In production, this should be an environment variable.
    private static String encryptionKey;

    @Value("${app.encryption.secret:12345678901234567890123456789012}")
    public void setEncryptionKey(String key) {
        AttributeEncryptor.encryptionKey = key;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            Cipher cipher = Cipher.getInstance(AES);
            SecretKeySpec secretKeySpec = new SecretKeySpec(encryptionKey.getBytes(), AES);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            byte[] encryptedBytes = cipher.doFinal(attribute.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new IllegalStateException("Error encrypting attribute", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            Cipher cipher = Cipher.getInstance(AES);
            SecretKeySpec secretKeySpec = new SecretKeySpec(encryptionKey.getBytes(), AES);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(dbData));
            return new String(decryptedBytes);
        } catch (Exception e) {
            // It might not be encrypted yet (legacy data).
            // If decryption fails, we assume it's legacy plain text and return it as is.
            return dbData;
        }
    }
}
