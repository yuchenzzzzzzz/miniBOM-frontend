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

        <!-- 注册和忘记密码链接 -->
        <div class="form-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
          <a href="#" @click.prevent="showPasswordModal = true" class="forgot-password">忘记密码？</a>
        </div>
      </form>
    </div>

    <!-- 密码修改模态框 -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-container">
        <h3>修改密码</h3>
        <form @submit.prevent="handleChangePassword">
          <div class="input-group">
            <input
              v-model.trim="passwordForm.oldPassword"
              type="password"
              placeholder="当前密码"
              required
            />
          </div>
          <div class="input-group">
            <input
              v-model.trim="passwordForm.newPassword"
              type="password"
              placeholder="新密码"
              required
            />
          </div>
          <div class="input-group">
            <input
              v-model.trim="passwordForm.confirmPassword"
              type="password"
              placeholder="确认新密码"
              required
            />
          </div>
          <div class="error-message" v-if="passwordError">{{ passwordError }}</div>
          <div class="button-group">
            <button type="submit" class="confirm-btn">
              确认修改
            </button>
            <button type="button" class="cancel-btn" @click="showPasswordModal = false">
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入MD5加密库
import md5 from 'blueimp-md5'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errorMsg = ref('')
const passwordError = ref('')
const showPasswordModal = ref(false)

// 清除错误信息
const clearError = () => {
  errorMsg.value = ''
}

// 登录处理
const handleLogin = async () => {
  // 先校验输入是否为空
  if (!loginForm.username || !loginForm.password) {
    errorMsg.value = '请输入用户名和密码'
    return
  }

  try {
    const res = await axios.post('/user/login', {
      name: loginForm.username,
      password: md5(loginForm.password) // 密码加密传输
    })

    if (res.data.code === 0) {
      // 存储token
      localStorage.setItem('token', res.data.data)
      // 跳转到首页
      router.push('/home')
    } else {
      errorMsg.value = res.data.msg
    }
  } catch (error) {
    errorMsg.value = '登录失败，请稍后重试'
    console.error('登录错误:', error)
  }
}

// 修改密码处理
const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = '两次输入的新密码不一致'
    return
  }

  try {
    const res = await axios.patch('/user/updatePwd', {
      old_pwd: md5(passwordForm.oldPassword),
      new_pwd: md5(passwordForm.newPassword),
      re_ped: md5(passwordForm.confirmPassword)
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (res.data.code === 0) {
      alert('密码修改成功，请重新登录')
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      passwordError.value = res.data.msg
    }
  } catch (error) {
    passwordError.value = '修改失败，请检查旧密码是否正确'
    console.error('修改密码错误:', error)
  }
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
  box-shadow: 0 10px 30px #0000001a;
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.modal-container h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  flex: 1;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-btn {
  flex: 1;
  padding: 12px;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.confirm-btn:hover {
  background: #2980b9;
}

.cancel-btn:hover {
  background: #e0e0e0;
}
</style>