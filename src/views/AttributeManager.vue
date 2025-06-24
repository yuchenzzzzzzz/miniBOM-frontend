<template>
  <div class="attribute-manager">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>
    
    <!-- 主内容区 -->
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="page-title">属性管理</h1>
        <div class="header-actions">
          <button @click="toggleDarkMode" class="action-button">
            <i :class="isDarkMode ? 'fa fa-sun-o' : 'fa fa-moon-o'"></i>
          </button>
        </div>
      </header>
      
      <!-- 搜索栏 -->
      <div class="search-section">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            placeholder="搜索属性名称..." 
            class="search-input"
          >
          <button class="search-button">
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
      
      <!-- 创建属性卡片 -->
      <div class="create-card">
        <h2 class="card-title">创建新属性</h2>
        <form @submit.prevent="createAttribute" class="form-grid">
          <div class="form-group">
            <label for="enName" class="form-label">英文名称 <span class="required">*</span></label>
            <input 
              id="enName" 
              v-model="formData.enName" 
              required 
              class="form-input"
              placeholder="如：length"
            >
          </div>
          <div class="form-group">
            <label for="cnName" class="form-label">中文名称 <span class="required">*</span></label>
            <input 
              id="cnName" 
              v-model="formData.cnName" 
              required 
              class="form-input"
              placeholder="如：长度"
            >
          </div>
          <div class="form-group">
            <label for="dataType" class="form-label">数据类型 <span class="required">*</span></label>
            <select 
              id="dataType" 
              v-model="formData.dataType" 
              required 
              class="form-input"
            >
              <option value="string">字符串</option>
              <option value="number">数值</option>
              <option value="boolean">布尔值</option>
              <option value="date">日期</option>
            </select>
          </div>
          <div class="form-group">
            <label for="desc" class="form-label">描述</label>
            <input 
              id="desc" 
              v-model="formData.desc" 
              class="form-input"
              placeholder="简要说明属性用途"
            >
          </div>
          <button type="submit" class="create-button">
            <i class="fa fa-plus mr-2"></i> 创建属性
          </button>
        </form>
      </div>
      
      <!-- 属性列表卡片 -->
      <div class="list-card">
        <div class="card-header">
          <h2 class="card-title">属性列表</h2>
          <div class="card-meta">
            <span>共 {{ filteredAttributes.length }} 条属性</span>
          </div>
        </div>
        <div class="table-container">
          <table class="attribute-table">
            <thead>
              <tr>
                <th>英文名称</th>
                <th>中文名称</th>
                <th>数据类型</th>
                <th>描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="attr in filteredAttributes" 
                :key="attr.id" 
                class="table-row"
                :class="{ 'hover-row': hoveredId === attr.id }"
                @mouseenter="hoverRow(attr.id)"
                @mouseleave="leaveRow()"
              >
                <td class="table-cell">{{ attr.enName }}</td>
                <td class="table-cell">{{ attr.cnName }}</td>
                <td class="table-cell data-type">
                  <span :class="['type-tag', 'type-' + attr.dataType]">{{ getDataTypeText(attr.dataType) }}</span>
                </td>
                <td class="table-cell desc-cell">{{ attr.desc || '未填写' }}</td>
                <td class="table-cell actions">
                  <button 
                    class="action-button edit"
                    @click="editAttribute(attr)"
                    title="编辑"
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button 
                    class="action-button delete"
                    @click="deleteAttribute(attr.id)"
                    title="删除"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const formData = ref({ enName: '', cnName: '', dataType: 'string', desc: '' });
const searchQuery = ref('');
const hoveredId = ref(null);
const isDarkMode = ref(false);
const attributes = ref([
  { id: 1, enName: 'length', cnName: '长度', dataType: 'number', desc: '物体的长度尺寸' },
  { id: 2, enName: 'width', cnName: '宽度', dataType: 'number', desc: '物体的宽度尺寸' },
  { id: 3, enName: 'color', cnName: '颜色', dataType: 'string', desc: '物体的颜色属性' },
  { id: 4, enName: 'weight', cnName: '重量', dataType: 'number', desc: '物体的重量参数' },
  { id: 5, enName: 'isActive', cnName: '是否激活', dataType: 'boolean', desc: '状态标识' }
]);

const filteredAttributes = computed(() =>
  attributes.value.filter(attr =>
    attr.enName.includes(searchQuery.value) || attr.cnName.includes(searchQuery.value)
  )
);

const getDataTypeText = (type) => {
  const types = {
    'string': '字符串',
    'number': '数值',
    'boolean': '布尔值',
    'date': '日期'
  };
  return types[type] || type;
};

const createAttribute = () => {
  if (!formData.value.enName || !formData.value.cnName) return;
  
  const newAttr = {
    id: attributes.value.length + 1,
    ...formData.value
  };
  attributes.value.push(newAttr);
  formData.value = { enName: '', cnName: '', dataType: 'string', desc: '' };
};

const deleteAttribute = (id) => {
  if (confirm('确定要删除该属性吗？此操作不可恢复。')) {
    attributes.value = attributes.value.filter(attr => attr.id !== id);
  }
};

const editAttribute = (attr) => {
  formData.value = { ...attr };
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
};

onMounted(() => {
  // 初始化主题（可根据本地存储或系统设置）
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
});
</script>

<style scoped>
/* 导入Font Awesome图标库 */
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css');

/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.attribute-manager {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  transition: background-color 0.3s ease;
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
  opacity: 0.9;
  z-index: -1;
}

body.dark-mode .bg-decoration {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

/* 主内容包装器 */
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

body.dark-mode .content-wrapper {
  background: rgba(0, 0, 0, 0.8);
}

/* 页面标题区 */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

body.dark-mode .page-title {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.header-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.action-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e2e8f0;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

body.dark-mode .action-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #475569;
  color: #ffffff;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.2);
}

/* 搜索栏 */
.search-section {
  margin-bottom: 40px;
  text-align: center;
}

.search-container {
  display: inline-flex;
  align-items: center;
  max-width: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

body.dark-mode .search-container {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  border: none;
  font-size: 1rem;
  color: #1e293b;
  background: transparent;
  outline: none;
}

body.dark-mode .search-input {
  color: #ffffff;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-button {
  padding: 14px 20px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background: #359e6b;
}

/* 卡片样式 */
.create-card, .list-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 30px;
}

body.dark-mode .create-card, 
body.dark-mode .list-card {
  background: rgba(255, 255, 255, 0.05);
}

.create-card:hover, .list-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
  margin-bottom: 30px;
  text-align: center;
}

body.dark-mode .card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c3e50;
}

body.dark-mode .card-title {
  color: #ffffff;
}

.card-meta {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 10px;
}

body.dark-mode .card-meta {
  color: #cbd5e1;
}

/* 表单样式 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 25px;
}

.form-group {
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 500;
}

body.dark-mode .form-label {
  color: #cbd5e1;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

body.dark-mode .form-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #475569;
  color: #ffffff;
}

.form-input:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.create-button {
  grid-column: 1 / -1;
  padding: 12px 24px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.create-button:hover {
  background: #359e6b;
  transform: translateY(-2px);
}

/* 表格样式 */
.attribute-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.attribute-table th,
.attribute-table td {
  padding: 16px 12px;
  text-align: left;
  vertical-align: middle;
  transition: background-color 0.2s ease;
  border: none;
}

/* 表头样式 */
.attribute-table th {
  font-weight: 600;
  color: #2c3e50;
  background: #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #e2e8f0;
}

body.dark-mode .attribute-table th {
  color: #ffffff;
  background: #334155;
  border-bottom: 1px solid #475569;
}

/* 行背景色交替 */
.table-row:nth-child(even) {
  background-color: rgba(0,0,0,0.02);
}

body.dark-mode .table-row:nth-child(even) {
  background-color: rgba(255,255,255,0.05);
}

/* 表格单元格文字颜色 */
.attribute-table td {
  color: #1e293b;
}

body.dark-mode .attribute-table td {
  color: #ffffff;
}

/* 悬停效果 */
.hover-row {
  background-color: #eef2ff !important;
}

body.dark-mode .hover-row {
  background-color: #2d3748 !important;
}

.table-row:last-child td {
  border-bottom: none;
}

.data-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.type-string {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

body.dark-mode .type-string {
  background: #334155;
  color: #cbd5e1;
  border: 1px solid #475569;
}

.type-number {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bfdbfe;
}

body.dark-mode .type-number {
  background: #0f172a;
  color: #38bdf8;
  border: 1px solid #0ea5e9;
}

.type-boolean {
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

body.dark-mode .type-boolean {
  background: #065f46;
  color: #10b981;
  border: 1px solid #059669;
}

.type-date {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

body.dark-mode .type-date {
  background: #92400e;
  color: #fef3c7;
  border: 1px solid #eab308;
}

.desc-cell {
  max-width: 200px;
  word-break: break-word;
  color: #64748b;
}

body.dark-mode .desc-cell {
  color: #cbd5e1;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.action-button {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit {
  background: #e0f2fe;
  color: #0369a1;
}

.edit:hover {
  background: #bfdbfe;
  transform: translateY(-2px);
}

.delete {
  background: #fee2e2;
  color: #b91c1c;
}

.delete:hover {
  background: #fecaca;
  transform: translateY(-2px);
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
</style>