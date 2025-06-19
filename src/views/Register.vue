<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="form-header">
        <h2>用户注册</h2>
        <p>创建您的新账号</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="floating-form">
        <!-- 用户名 -->
        <div class="input-group">
          <input
            v-model.trim="form.name"
            type="text"
            placeholder=" "
            required
            @input="validateUsername"
          />
          <label>用户名 (2-20位字母数字)</label>
          <span class="hint" v-if="usernameValid === false">❌ 格式不符合要求</span>
        </div>

        <!-- 密码 -->
        <div class="input-group">
          <input
            v-model.trim="form.password"
            type="password"
            placeholder=" "
            required
            @input="validatePassword"
          />
          <label>密码 (6-20位含特殊符号)</label>
          <span class="hint" v-if="passwordValid === false">❌ 需包含数字、字母和特殊符号</span>
        </div>

        <!-- 邮箱 -->
        <div class="input-group">
          <input
            v-model.trim="form.email"
            type="email"
            placeholder=" "
          />
          <label>邮箱 (可选)</label>
        </div>

        <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>

        <button type="submit" class="submit-btn" :disabled="!formValid">
          立即注册
        </button>

        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login">去登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import md5 from 'blueimp-md5'

const router = useRouter()
const form = reactive({
  name: '',
  password: '',
  email: ''
})
const usernameValid = ref(null)
const passwordValid = ref(null)
const errorMsg = ref('')

const formValid = computed(() => {
  return usernameValid.value && passwordValid.value
})

const validateUsername = () => {
  usernameValid.value = /^[a-zA-Z0-9]{2,20}$/.test(form.name)
}

const validatePassword = () => {
  passwordValid.value = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/.test(form.password)
}

const handleRegister = async () => {
  try {
    const res = await axios.post('/user/register', {
      ...form,
      password: md5(form.password)
    })
    
    if (res.data.code === 0) {
      alert('注册成功！')
      router.push('/login')
    } else {
      errorMsg.value = res.data.msg
    }
  } catch (error) {
    errorMsg.value = '注册失败，请稍后重试'
  }
}
</script>

<style scoped>
/* 复用登录页的样式，只需新增提示样式 */
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
  margin-bottom: 30px;
}

.form-header h2 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-header p {
  color: #7f8c8d;
  font-size: 14px;
}

/* 输入框样式 */
.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: border 0.3s;
}

.input-group input:focus {
  border-color: #3498db;
  outline: none;
}

.input-group label {
  position: absolute;
  left: 16px;
  top: 14px;
  color: #95a5a6;
  font-size: 15px;
  transition: all 0.3s;
  pointer-events: none;
  background: white;
  padding: 0 5px;
}

.input-group input:focus + label,
.input-group input:not(:placeholder-shown) + label {
  top: -10px;
  font-size: 12px;
  color: #3498db;
}

/* 错误消息样式 */
.error-message {
  color: #f56c6c;
  text-align: center;
  margin: 10px 0;
  font-size: 14px;
}

/* 按钮样式 */
.submit-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  background: #2980b9;
}

/* 底部链接样式 */
.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
  margin: 0 5px;
}

.form-footer a:hover {
  text-decoration: underline;
}

.forgot-password {
  display: block;
  margin-top: 10px;
}

.hint {
  display: block;
  font-size: 12px;
  color: #f56c6c;
  margin-top: 4px;
}

.submit-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>