package com.enote.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 分类请求数据传输对象
 * 用于接收创建和更新分类的请求数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    
    @NotBlank(message = "分类名称不能为空")
    @Size(min = 1, max = 50, message = "分类名称长度必须在1到50个字符之间")
    private String name;
    
    @Size(max = 255, message = "分类描述不能超过255个字符")
    private String description;
}