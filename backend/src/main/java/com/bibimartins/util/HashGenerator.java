package com.bibimartins.util;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        Argon2PasswordEncoder encoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        String password = "310412rsm";
        String hash = encoder.encode(password);
        System.out.println("Generated Argon2 Hash: " + hash);
    }
}
