package com.enote.security;

import com.enote.entity.User;
import com.enote.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * 安全相关工具类
 * 用于获取当前登录用户等安全相关操作
 */
@Component
public class SecurityUtils {

    @Autowired
    private UserRepository userRepository;

    /**
     * 获取当前登录用户
     * @return 当前登录的用户实体
     * @throws IllegalStateException 如果未登录或用户不存在
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("用户未登录");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("用户不存在"));
    }
    
    /**
     * 获取当前登录用户ID
     * @return 当前登录的用户ID
     * @throws IllegalStateException 如果未登录或用户不存在
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
    
    /**
     * 检查当前是否已登录
     * @return 如果已登录则返回true，否则返回false
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
}