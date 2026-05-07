package com.bibimartins.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class KeepAliveService {

    // Runs every 10 minutes (600,000 milliseconds)
    @Scheduled(fixedRate = 600000)
    public void keepAlive() {
        try {
            // We'll try to ping the health endpoint or root
            // Render provides the PORT, but we need the public URL.
            // If the URL is not set, we just skip to avoid errors.
            String appUrl = System.getenv("APP_URL");
            if (appUrl == null || appUrl.isEmpty()) {
                System.out.println("KeepAlive: APP_URL not set. Skipping ping.");
                return;
            }

            URL url = new URL(appUrl);
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
