package com.bibimartins.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

@Service
public class KeepAliveService {

    // Runs every 10 minutes (600,000 milliseconds)
    @Scheduled(fixedRate = 600000)
    public void keepAlive() {
        try {
            String appUrl = System.getenv("APP_URL");
            if (appUrl == null || appUrl.isEmpty()) {
                System.out.println("KeepAlive: APP_URL not set. Skipping ping.");
                return;
            }

            URL url = URI.create(appUrl).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(5000);
            int responseCode = conn.getResponseCode();
            
            System.out.println("KeepAlive Ping sent to " + appUrl + " - Response: " + responseCode);
        } catch (Exception e) {
            System.err.println("KeepAlive Ping failed: " + e.getMessage());
        }
    }
}
