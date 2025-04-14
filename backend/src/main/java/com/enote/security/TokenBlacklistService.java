package com.enote.security;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {
    private final ConcurrentHashMap<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token, Long expirationTime) {
        blacklistedTokens.put(token, expirationTime);
    }

    public boolean isBlacklisted(String token) {
        if (!blacklistedTokens.containsKey(token)) {
            return false;
        }
        
        // 如果token已过期，从黑名单中移除
        if (System.currentTimeMillis() > blacklistedTokens.get(token)) {
            blacklistedTokens.remove(token);
            return false;
        }
        
        return true;
    }
}