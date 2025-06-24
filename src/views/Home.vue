<template>
  <div class="home-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration"></div>
    
    <!-- 主内容区 -->
    <div class="content-wrapper">
      <h1 class="welcome-title">欢迎进入系统！</h1>
      
      <!-- 四个功能按钮，使用网格布局 -->
      <div class="button-grid">
        <router-link to="/attributemanager" class="btn btn-attribute">
          <i class="fa fa-list-alt"></i>
          <span>属性管理</span>
        </router-link>
        
        <router-link to="/categorymanagement" class="btn btn-category">
          <i class="fa fa-th-large"></i>
          <span>分类管理</span>
        </router-link>
        
        <router-link to="/part" class="btn btn-part">
          <i class="fa fa-cogs"></i>
          <span>部件管理</span>
        </router-link>
        
        <router-link to="/bom" class="btn btn-bom">
          <i class="fa fa-sitemap"></i>
          <span>bom管理</span>
        </router-link>
      </div>
      
      <!-- 页脚信息 -->
      <footer class="footer">
        <p>© 2025 minibom管理平台 | 版本 v1.0</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Vue3 语法糖，直接写逻辑（这里暂时无业务逻辑）
</script>

<style scoped>
/* 导入 Font Awesome 图标库（如果项目中未引入，需要在 index.html 中添加） */
/* <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet"> */

/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 背景设置 */
.home-container {
  position: relative;
  min-height: 100vh;
  width: 200%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  opacity: 0.9;
  z-index: -1;
}

/* 主内容区包装器 */
.content-wrapper {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 1200px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.6s ease-out forwards;
}

/* 欢迎标题 */
.welcome-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 60px;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

/* 按钮网格布局 */
.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  justify-items: center;
  padding: 20px;
}

/* 按钮基础样式 */
.btn {
  width: 100%;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-decoration: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  transform: translateY(0);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: white;
}

/* 按钮悬停效果 */
.btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* 按钮图标样式 */
.btn i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.btn:hover i {
  transform: scale(1.2);
}

/* 不同按钮的颜色主题 */
.btn-attribute {
  background: linear-gradient(135deg, #4a90e2 0%, #2979ff 100%);
}

.btn-category {
  background: linear-gradient(135deg, #f5a623 0%, #f97316 100%);
}

.btn-part {
  background: linear-gradient(135deg, #7ed321 0%, #4ade80 100%);
}

.btn-bom {
  background: linear-gradient(135deg, #9013fe 0%, #c084fc 100%);
}

/* 页脚样式 */
.footer {
  margin-top: 80px;
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 40px 20px;
  }
  
  .welcome-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  .button-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0;
  }
  
  .btn {
    min-height: 100px;
  }
  
  .footer {
    margin-top: 60px;
  }
}
</style>
