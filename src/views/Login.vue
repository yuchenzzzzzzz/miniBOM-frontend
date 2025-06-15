<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="form-header">
        <h2>用户登录</h2>
        <p>欢迎回来，请登录您的账号</p>
      </div>
      <form @submit.prevent="handleLogin" class="floating-form">
        <!-- 用户名输入框 -->
        <div class="input-group">
          <input 
            id="username" 
            v-model.trim="loginForm.username" 
            type="text" 
            autocomplete="off" 
            required 
            @input="clearError" 
          />          
          <label for="username">用户名</label>
        </div>

        <!-- 密码输入框 -->
        <div class="input-group">
          <input 
            id="password" 
            v-model.trim="loginForm.password" 
            type="password" 
            autocomplete="off" 
            required 
            @input="clearError" 
          />         
           <label for="password">密码</label>
        </div>

        <!-- 错误提示 -->
        <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>

        <!-- 登录按钮 -->
        <button type="submit" class="submit-btn">
          登录
        </button>

        <!-- 注册链接 -->
        <div class="form-footer">
          <span>还没有账号？</span>
          <a href="/register">立即注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

const errorMsg = ref('')
// NEW: 清除错误信息
const clearError = () => {
  errorMsg.value = ''
}
// const isFormValid = ref(false)

// // 输入验证
// const validateInput = () => {
//   isFormValid.value = loginForm.username && loginForm.password
// }

// 登录处理
const handleLogin = async () => {
    // NEW: 先校验输入是否为空
  if (!loginForm.username || !loginForm.password) {
    errorMsg.value = '请输入用户名和密码'
    return // 直接返回，不继续执行
  }
  try {
    // 模拟一个简单的用户验证
    const mockUsers = [
      { username: 'user1', password: 'password123' },
      { username: 'user2', password: 'password456' }
    ]

    const user = mockUsers.find(user => user.username === loginForm.username)
    
    if (!user) {
      errorMessage('用户名不存在')
      return
    }

    // 验证密码
    if (user.password === loginForm.password) {
      // NEW: 登录成功提示
      errorMsg.value = '登录成功！正在跳转...'
      
      // 模拟延迟跳转
      setTimeout(() => {
        router.push('/home')
      }, 1500)
    } else {
      errorMsg.value = '密码错误'
    }
  } catch (error) {
    errorMsg.value = '登录失败，请稍后重试'
  }
}

// 错误提示
const errorMessage = (text) => {
  errorMsg.value = text
  setTimeout(() => {
    errorMsg.value = ''
  }, 3000)
}


</script>

<style scoped>
/* 背景和容器设置 */
.login-wrapper {
  min-height: 100vh;          /* 确保背景充满整个页面 */
  width: 200%;                /* 占满整个页面宽度 */
  display: flex;              /* 使用flex来居中内容 */
  justify-content: center;    /* 水平居中 */
  align-items: center;        /* 垂直居中 */
  padding: 0;                 /* 移除内边距 */
  box-sizing: border-box;     /* 确保元素尺寸计算一致 */
  position: relative;         /* 使背景和内容层分开 */
  margin: 0;                  /* 移除默认外边距 */
}


/* 登录框样式 */
.login-container {
  width: 100%;         /* 宽度占满屏幕 */
  max-width: 400px;    /* 最大宽度，避免过宽 */
  background: white;
  border-radius: 20px;
  padding: 60px 80px;    /* 上下内边距，左右为适应屏幕 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
}

.login-wrapper::before {
  content: '';                /* 确保伪元素存在 */
  position: fixed;            /* 固定定位，填满整个页面 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;                  /* 让背景填充整个视口 */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: -1;                /* 确保背景位于最底层 */
}


/* 头部样式 */
.form-header {
  text-align: center;
  margin-bottom: 20px;
}

/* 输入框样式 */
.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 5px;
  background-color: transparent;
}

/* 输入框内文字浮动效果 */
.input-group label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #95a5a6;
  font-size: 14px;
  pointer-events: none;
  transition: 0.3s ease all;
}

/* 输入框有值时，label上浮 */
.input-group input:focus + label,
.input-group input:valid + label {
  top: -5px;
  font-size: 12px;
  color: #3498db;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #95a5a6;
}

/* 错误消息样式 */
.error-message {
  color: #f56c6c;
  text-align: center;
  margin-top: 10px;
}

/* 底部注册链接 */
.form-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
