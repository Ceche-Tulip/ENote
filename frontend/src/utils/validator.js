/**
 * 数据验证工具
 * 
 * 此工具用于验证 API 返回的数据是否符合预期结构，
 * 有助于提前捕获数据不一致问题，增强应用的健壮性
 */

/**
 * 验证对象是否符合指定的模式
 * @param {Object} data 需要验证的数据对象
 * @param {Object} schema 数据应当遵循的结构模式，包含预期的字段和类型
 * @param {boolean} strict 是否进行严格检查（不允许额外字段）
 * @returns {Object} 包含验证结果的对象
 */
export const validateSchema = (data, schema, strict = false) => {
  // 如果数据为空，但模式要求非空对象
  if (!data && schema) {
    return {
      valid: false,
      errors: ['数据为空或未定义']
    };
  }

  const errors = [];
  
  // 检查数据类型
  if (typeof data !== typeof schema) {
    return {
      valid: false,
      errors: [`数据类型不匹配: 预期 ${typeof schema}, 实际 ${typeof data}`]
    };
  }

  // 如果是数组，检查数组项
  if (Array.isArray(schema)) {
    if (!Array.isArray(data)) {
      return {
        valid: false,
        errors: ['预期为数组，但实际不是数组']
      };
    }
    
    // 如果模式数组有第一项，用它作为数组项的模式
    if (schema.length > 0 && data.length > 0) {
      const itemSchema = schema[0];
      data.forEach((item, index) => {
        const result = validateSchema(item, itemSchema, strict);
        if (!result.valid) {
          result.errors.forEach(error => {
            errors.push(`数组索引 [${index}]: ${error}`);
          });
        }
      });
    }
  }
  // 如果是对象，检查对象属性
  else if (typeof schema === 'object' && schema !== null) {
    // 检查必需字段
    for (const key in schema) {
      if (schema[key] !== undefined) {
        // 如果值是函数，表示它是一个类型检查器
        if (typeof schema[key] === 'function') {
          if (data[key] === undefined) {
            // 对于可选字段，不报告错误
            if (!isOptionalField(key, schema)) {
              errors.push(`缺少必需字段: ${key}`);
            }
          } else if (!schema[key](data[key])) {
            errors.push(`字段 ${key} 的类型不符合预期`);
          }
        } 
        // 否则它是一个子模式
        else if (data[key] === undefined) {
          // 对于可选字段，不报告错误
          if (!isOptionalField(key, schema)) {
            errors.push(`缺少必需字段: ${key}`);
          }
        } else {
          const result = validateSchema(data[key], schema[key], strict);
          if (!result.valid) {
            result.errors.forEach(error => {
              errors.push(`字段 ${key}: ${error}`);
            });
          }
        }
      }
    }
    
    // 严格模式下检查额外字段
    if (strict) {
      for (const key in data) {
        if (schema[key] === undefined) {
          errors.push(`发现额外字段: ${key}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// 判断字段是否为可选字段
function isOptionalField(fieldName, schema) {
  // 笔记模式中的可选字段
  if (schema === noteSchema) {
    return ['content', 'category', 'tags', 'updatedAt'].includes(fieldName);
  }
  
  // 其他模式中的可选字段
  const optionalFieldsMap = {
    [userSchema]: ['roles'],
    [categorySchema]: ['description'],
    [tagSchema]: ['color']
  };
  
  for (const [schemaType, optionalFields] of Object.entries(optionalFieldsMap)) {
    if (schema === schemaType && optionalFields.includes(fieldName)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 笔记数据模式
 */
export const noteSchema = {
  id: String,
  title: String,
  content: String, // 可选
  category: {  // 可选
    id: String,
    name: String
  }, 
  tags: [{ // 可选
    id: String,
    name: String,
    color: String // 可选
  }],
  createdAt: String,
  updatedAt: String // 可选
};

/**
 * 用户数据模式
 */
export const userSchema = {
  id: String,
  username: String,
  email: String,
  // 不包含密码字段
  roles: [String], // 可选
  createdAt: String
};

/**
 * 分类数据模式
 */
export const categorySchema = {
  id: String,
  name: String,
  description: String // 可选
};

/**
 * 标签数据模式
 */
export const tagSchema = {
  id: String,
  name: String,
  color: String // 可选
};

/**
 * 检查特定类型的数据
 * @param {Object} data 需要验证的数据
 * @param {Object} schemaType 数据模式的类型
 * @param {boolean} strict 是否进行严格检查
 * @returns {boolean} 验证是否通过
 */
export const validateData = (data, schemaType, strict = false) => {
  const schemas = {
    note: noteSchema,
    user: userSchema,
    category: categorySchema,
    tag: tagSchema
  };
  
  const schema = schemas[schemaType];
  if (!schema) {
    console.error(`未知的模式类型: ${schemaType}`);
    return false;
  }
  
  const result = validateSchema(data, schema, strict);
  if (!result.valid) {
    console.warn(`数据验证失败 (${schemaType}):`, result.errors);
    return false;
  }
  
  return true;
};

/**
 * 预定义的类型检查函数
 */
export const isString = (value) => typeof value === 'string';
export const isNumber = (value) => typeof value === 'number' && !isNaN(value);
export const isBoolean = (value) => typeof value === 'boolean';
export const isArray = (value) => Array.isArray(value);
export const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
export const isDate = (value) => value instanceof Date && !isNaN(value.getTime());
export const isStringDate = (value) => {
  if (typeof value !== 'string') return false;
  return !isNaN(Date.parse(value));
};