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
            @keyup.enter="fetchAttributes"
          >
          <button class="search-button" @click="fetchAttributes">
            <i class="fa fa-search mr-2"></i> 查询
          </button>
          <button class="create-button" @click="showCreateForm">
            <i class="fa fa-plus mr-2"></i> 新增
          </button>
        </div>
      </div>
      
      <!-- 创建属性卡片 -->
      <div class="create-card" v-if="isCreateFormVisible">
        <div class="card-header">
          <h2 class="card-title">创建新属性</h2>
          <button class="close-button" @click="hideCreateForm">
            <i class="fa fa-times"></i>
          </button>
        </div>
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
          <div class="form-group form-actions">
            <button type="button" class="cancel-button" @click="hideCreateForm">取消</button>
            <button type="submit" class="save-button">
              <i class="fa fa-check mr-2"></i> 保存
            </button>
          </div>
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
    
    <!-- 编辑弹窗 -->
    <div 
      class="dialog-container" 
      :class="{ 'dialog-visible': editDialogVisible }"
    >
      <div class="dialog-backdrop" @click="closeEditDialog"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3 class="dialog-title">编辑属性</h3>
          <button class="dialog-close" @click="closeEditDialog">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="dialog-body">
          <form class="form-grid">
            <div class="form-group">
              <label for="edit-enName" class="form-label">英文名称 <span class="required">*</span></label>
              <input 
                id="edit-enName" 
                v-model="editData.enName" 
                required 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="edit-cnName" class="form-label">中文名称 <span class="required">*</span></label>
              <input 
                id="edit-cnName" 
                v-model="editData.cnName" 
                required 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="edit-dataType" class="form-label">数据类型 <span class="required">*</span></label>
              <select 
                id="edit-dataType" 
                v-model="editData.dataType" 
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
              <label for="edit-desc" class="form-label">描述</label>
              <input 
                id="edit-desc" 
                v-model="editData.desc" 
                class="form-input"
                placeholder="简要说明属性用途"
              >
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button cancel" @click="closeEditDialog">取消</button>
          <button class="dialog-button save" @click="updateAttribute">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 消息提示 -->
    <div 
      class="message-container"
      v-if="message.visible"
      :class="['message-' + message.type]"
    >
      {{ message.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { createAttribute, getAttributeList, updateAttribute, deleteAttribute } from '@/api/attribute'; // 引入 API 方法

// 响应式数据
const attributes = ref([]);
const searchQuery = ref('');
const hoveredId = ref(null);
const isDarkMode = ref(false);
const isCreateFormVisible = ref(false);
const editDialogVisible = ref(false);
const formData = ref({ enName: '', cnName: '', dataType: 'string', desc: '' });
const editData = ref({ id: '', enName: '', cnName: '', dataType: 'string', desc: '' });
const message = ref({
  visible: false,
  text: '',
  type: 'info' // success, error, warning, info
});

// 计算过滤后的属性列表
const filteredAttributes = computed(() =>
  attributes.value.filter(attr =>
    attr.enName.includes(searchQuery.value) || 
    attr.cnName.includes(searchQuery.value)
  )
);

// 获取数据类型的显示文本
const getDataTypeText = (type) => {
  const types = {
    'string': '字符串',
    'number': '数值',
    'boolean': '布尔值',
    'date': '日期'
  };
  return types[type] || type;
};

// 获取属性列表
const fetchAttributes = async () => {
  try {
    const res = await getAttributeList({ 
      name: searchQuery.value,
      pageSize: 1000, // 获取所有数据，实际应用中应实现分页
      curPage: 1
    });
    
    if (res.code === 200) {
      attributes.value = res.data.list || [];
    } else {
      showMessage(res.message || '获取属性列表失败', 'error');
    }
  } catch (error) {
    console.error('获取属性列表失败:', error);
    showMessage('获取属性列表失败，请检查网络连接', 'error');
  }
};

// 创建新属性
const createAttributeHandler = async () => {
  if (!formData.value.enName || !formData.value.cnName) {
    showMessage('英文名称和中文名称为必填项', 'warning');
    return;
  }
  
  try {
    // 构建请求数据
    const requestData = {
      name: formData.value.cnName,
      nameEn: formData.value.enName,
      description: formData.value.desc,
      descriptionEn: formData.value.desc, // 简化处理，中英文描述相同
      type: formData.value.dataType.toUpperCase(),
      disableFlag: false
    };
    
    const res = await createAttribute(requestData);
    
    if (res.code === 200) {
      showMessage('创建属性成功', 'success');
      hideCreateForm();
      fetchAttributes(); // 刷新列表
    } else {
      showMessage(res.message || '创建属性失败', 'error');
    }
  } catch (error) {
    console.error('创建属性失败:', error);
    showMessage('创建属性失败，请检查网络连接', 'error');
  }
};

// 更新属性
const updateAttributeHandler = async () => {
  if (!editData.value.id || !editData.value.enName || !editData.value.cnName) {
    showMessage('属性ID、英文名称和中文名称为必填项', 'warning');
    return;
  }
  
  try {
    // 构建请求数据
    const requestData = {
      id: editData.value.id,
      name: editData.value.cnName,
      nameEn: editData.value.enName,
      description: editData.value.desc,
      descriptionEn: editData.value.desc, // 简化处理，中英文描述相同
      disableFlag: false
    };
    
    const res = await updateAttribute(requestData);
    
    if (res.code === 200) {
      showMessage('更新属性成功', 'success');
      closeEditDialog();
      fetchAttributes(); // 刷新列表
    } else {
      showMessage(res.message || '更新属性失败', 'error');
    }
  } catch (error) {
    console.error('更新属性失败:', error);
    showMessage('更新属性失败，请检查网络连接', 'error');
  }
};

// 删除属性
const deleteAttributeHandler = async (id) => {
  if (!confirm('确定要删除该属性吗？此操作不可恢复。')) {
    return;
  }
  
  try {
    const res = await deleteAttribute(id);
    
    if (res.code === 200) {
      showMessage('删除属性成功', 'success');
      fetchAttributes(); // 刷新列表
    } else {
      showMessage(res.message || '删除属性失败', 'error');
    }
  } catch (error) {
    console.error('删除属性失败:', error);
    showMessage('删除属性失败，请检查网络连接', 'error');
  }
};

// 显示创建表单
const showCreateForm = () => {
  formData.value = { enName: '', cnName: '', dataType: 'string', desc: '' };
  isCreateFormVisible = true;
};

// 隐藏创建表单
const hideCreateForm = () => {
  isCreateFormVisible = false;
};

// 编辑属性
const editAttribute = (attr) => {
  editData.value = {
    id: attr.id,
    enName: attr.enName,
    cnName: attr.cnName,
    dataType: attr.dataType.toLowerCase(),
    desc: attr.desc
  };
  editDialogVisible = true;
};

// 关闭编辑弹窗
const closeEditDialog = () => {
  editDialogVisible = false;
};

// 行悬停效果
const hoverRow = (id) => {
  hoveredId.value = id;
};

const leaveRow = () => {
  hoveredId.value = null;
};

// 显示消息提示
const showMessage = (text, type = 'info') => {
  message.value = {
    visible: true,
    text,
    type
  };
  
  // 3秒后自动关闭
  setTimeout(() => {
    message.value.visible = false;
  }, 3000);
};

// 切换深色模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark-mode', isDarkMode.value);
};

// 页面加载时初始化
onMounted(() => {
  fetchAttributes(); // 加载属性列表
  
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
  padding: 40px 40px;
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

.search-button, .create-button {
  padding: 14px 20px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button {
  background: #3b82f6;
  margin-left: 10px;
}

.search-button:hover {
  background: #359e6b;
}

.create-button:hover {
  background: #2563eb;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
  margin-bottom: 30px;
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

.close-button {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #1e293b;
}

body.dark-mode .close-button {
  color: #64748b;
}

body.dark-mode .close-button:hover {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  grid-column: span 2;
}

.cancel-button, .save-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.cancel-button {
  background: #f1f5f9;
  color: #475569;
}

.cancel-button:hover {
  background: #e2e8f0;
}

.save-button {
  background: #42b983;
  color: white;
}

.save-button:hover {
  background: #359e6b;
}

body.dark-mode .cancel-button {
  background: #334155;
  color: #cbd5e1;
}

body.dark-mode .cancel-button:hover {
  background: #475569;
}

/* 表格样式 */
.table-container {
  width: 100%;
  overflow-x: auto;
}

.attribute-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.attribute-table th,
.attribute-table td {
  padding: 12px 10px;
  text-align: left;
  vertical-align: middle;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

body.dark-mode .attribute-table th,
body.dark-mode .attribute-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 表头样式 */
.attribute-table th {
  font-weight: 600;
  color: #2c3e50;
  background: #f8fafc;
}

body.dark-mode .attribute-table th {
  color: #ffffff;
  background: #1e293b;
}

/* 行背景色交替 */
.table-row:nth-child(even) {
  background-color: rgba(0,0,0,0.02);
}

body.dark-mode .table-row:nth-child(even) {
  background-color: rgba(255,255,255,0.03);
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
  background-color: rgba(66, 185, 131, 0.1) !important;
}

body.dark-mode .hover-row {
  background-color: rgba(66, 185, 131, 0.2) !important;
}

.table-row:last-child td {
  border-bottom: none;
}

/* 数据类型标签样式 */
.data-type {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.type-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.type-string {
  background: #e0f2fe;
  color: #0369a1;
}

.type-number {
  background: #dcfce7;
  color: #16a34a;
}

.type-boolean {
  background: #ede9fe;
  color: #7c3aed;
}

.type-date {
  background: #ffedd5;
  color: #ea580c;
}

/* 操作按钮样式 */
.actions {
  display: flex;
  gap: 6px;
  justify-content: flex-start;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.edit {
  background: #dbeafe;
  color: #2563eb;
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

/* 编辑弹窗样式 */
.dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.dialog-visible {
  opacity: 1;
  pointer-events: auto;
}

.dialog-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.dialog-content {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 95%;
  max-width: 600px;
  overflow: hidden;
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

body.dark-mode .dialog-content {
  background: rgba(0, 0, 0, 0.85);
}

.dialog-visible .dialog-content {
  transform: scale(1);
}

.dialog-header {
  padding: 15px 25px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

body.dark-mode .dialog-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

body.dark-mode .dialog-title {
  color: #ffffff;
}

.dialog-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.dialog-close:hover {
  color: #1e293b;
}

body.dark-mode .dialog-close {
  color: #64748b;
}

body.dark-mode .dialog-close:hover {
  color: #ffffff;
}

.dialog-body {
  padding: 25px;
}

.dialog-footer {
  padding: 15px 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

body.dark-mode .dialog-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cancel {
  background: #f1f5f9;
  color: #475569;
}

.cancel:hover {
  background: #e2e8f0;
}

.save {
  background: #42b983;
  color: white;
}

.save:hover {
  background: #359e6b;
}

body.dark-mode .cancel {
  background: #334155;
  color: #cbd5e1;
}

body.dark-mode .cancel:hover {
  background: #475569;
}

/* 消息提示 */
.message-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease forwards;
  font-size: 0.9rem;
}

.message-success {
  background: #10b981;
}

.message-error {
  background: #ef4444;
}

.message-warning {
  background: #f59e0b;
}

.message-info {
  background: #3b82f6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

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
@media (max-width: 992px) {
  .content-wrapper {
    width: 100%;
    padding: 30px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 25px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .create-button {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
  
  .attribute-table th,
  .attribute-table td {
    padding: 10px 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .attribute-manager {
    padding: 20px 10px;
  }
  
  .content-wrapper {
    padding: 20px;
  }
  
  .attribute-table th,
  .attribute-table td {
    padding: 8px 6px;
    font-size: 0.8rem;
  }
  
  .type-tag {
    padding: 2px 6px;
    font-size: 0.7rem;
  }
  
  .actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-button {
    width: 28px;
    height: 28px;
  }
}
</style>