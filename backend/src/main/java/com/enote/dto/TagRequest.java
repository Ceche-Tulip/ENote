package com.enote.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 标签请求数据传输对象
 * 用于创建或更新标签时接收前端传入的数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagRequest {

    /**
     * 标签名称，不能为空，长度限制为1-30个字符
     */
    @NotBlank(message = "标签名不能为空")
    @Size(min = 1, max = 30, message = "标签名长度必须在1-30个字符之间")
    private String name;
}