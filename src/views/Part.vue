<template>
  <div class="part-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>
    
    <!-- 主内容区 -->
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1 class="page-title">Part 管理</h1>
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
            v-model="searchKey" 
            placeholder="按 Part 名称/编码查询" 
            class="search-input"
            @keyup.enter="fetchPartList"
          >
          <button class="search-button" @click="fetchPartList">
            <i class="fa fa-search mr-2"></i> 查询
          </button>
          <button class="create-button" @click="handleCreate">
            <i class="fa fa-plus mr-2"></i> 新增
          </button>
        </div>
      </div>
      
      <!-- Part 列表卡片 -->
      <div class="list-card">
        <div class="card-header">
          <h2 class="card-title">Part 列表</h2>
          <div class="card-meta">
            <span>共 {{ partList.length }} 条 Part</span>
          </div>
        </div>
        <div class="table-container">
          <table class="attribute-table">
            <thead>
              <tr>
                <th>编码</th>
                <th>名称</th>
                <th>默认单位</th>
                <th>修订版本</th>
                <th>迭代版本</th>
                <th>装配模式</th>
                <th>来源</th>
                <th>分类</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(part, index) in partList" 
                :key="part.code" 
                class="table-row"
                :class="{ 'hover-row': hoveredIndex === index }"
                @mouseenter="hoverRow(index)"
                @mouseleave="leaveRow()"
              >
                <td class="table-cell">{{ part.code }}</td>
                <td class="table-cell">{{ part.name }}</td>
                <td class="table-cell">{{ part.unit }}</td>
                <td class="table-cell">{{ part.version }}</td>
                <td class="table-cell">{{ part.status }}</td>
                <td class="table-cell">{{ part.mode }}</td>
                <td class="table-cell">{{ part.source }}</td>
                <td class="table-cell">{{ part.category }}</td>
                <td class="table-cell actions">
                  <button 
                    class="action-button edit"
                    @click="handleEdit(part)"
                    title="编辑"
                  >
                    <i class="fa fa-pencil"></i>
                  </button>
                  <button 
                    class="action-button delete"
                    @click="handleDelete(part)"
                    title="删除"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <button 
                    class="action-button history"
                    @click="handleViewHistory(part)"
                    title="查看历史版本"
                  >
                    <i class="fa fa-history"></i>
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
      :class="{ 'dialog-visible': dialogVisible }"
    >
      <div class="dialog-backdrop" @click="closeDialog"></div>
      <div class="dialog-content">
        <div class="dialog-header">
          <h3 class="dialog-title">Part 信息编辑</h3>
          <button class="dialog-close" @click="closeDialog">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="dialog-body">
          <form class="form-grid">
            <div class="form-group">
              <label for="part-code" class="form-label">编码 <span class="required">*</span></label>
              <input 
                id="part-code" 
                v-model="form.code" 
                required 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-name" class="form-label">名称 <span class="required">*</span></label>
              <input 
                id="part-name" 
                v-model="form.name" 
                required 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-unit" class="form-label">默认单位</label>
              <input 
                id="part-unit" 
                v-model="form.unit" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-version" class="form-label">修订版本</label>
              <input 
                id="part-version" 
                v-model="form.version" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-status" class="form-label">迭代版本</label>
              <input 
                id="part-status" 
                v-model="form.status" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-mode" class="form-label">装配模式</label>
              <input 
                id="part-mode" 
                v-model="form.mode" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-source" class="form-label">来源</label>
              <input 
                id="part-source" 
                v-model="form.source" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="part-category" class="form-label">分类</label>
              <input 
                id="part-category" 
                v-model="form.category" 
                class="form-input"
              >
            </div>
            <!-- 扩展属性示例（长、宽） -->
            <div class="form-group">
              <label for="part-length" class="form-label">长度</label>
              <input 
                id="part-length" 
                v-model="form.attrs.length" 
                class="form-input"
                placeholder="选填扩展属性"
              >
            </div>
            <div class="form-group">
              <label for="part-width" class="form-label">宽度</label>
              <input 
                id="part-width" 
                v-model="form.attrs.width" 
                class="form-input"
                placeholder="选填扩展属性"
              >
            </div>
          </form>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button cancel" @click="closeDialog">取消</button>
          <button class="dialog-button save" @click="handleSave">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 历史版本弹窗 -->
    <div 
      class="dialog-container" 
      :class="{ 'dialog-visible': historyDialogVisible }"
    >
      <div class="dialog-backdrop" @click="closeHistoryDialog"></div>
      <div class="dialog-content history-dialog">
        <div class="dialog-header">
          <h3 class="dialog-title">Part 历史版本</h3>
          <button class="dialog-close" @click="closeHistoryDialog">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="dialog-body">
          <table class="history-table">
            <thead>
              <tr>
                <th>版本</th>
                <th>创建时间</th>
                <th>操作人</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(history, index) in historyList" 
                :key="index" 
                class="table-row"
              >
                <td class="table-cell">{{ history.version }}</td>
                <td class="table-cell">{{ history.createTime }}</td>
                <td class="table-cell">{{ history.operator }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="dialog-footer">
          <button class="dialog-button cancel" @click="closeHistoryDialog">关闭</button>
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
import { ref, onMounted, watch } from 'vue';
import { createPart, getPartList, getPartDetail, updatePart, deletePart } from '@/api/part'; // 导入 API 方法

// 响应式数据
const partList = ref([]);
const searchKey = ref('');
const dialogVisible = ref(false);
const historyDialogVisible = ref(false);
const form = ref({
  code: '',
  name: '',
  unit: '',
  version: '',
  status: '',
  mode: '',
  source: '',
  category: '',
  attrs: { length: '', width: '' } // 扩展属性
});
const historyList = ref([]);
const hoveredIndex = ref(null);
const isDarkMode = ref(false);
const message = ref({
  visible: false,
  text: '',
  type: 'info' // success, error, warning, info
});

// 获取 Part 列表
const fetchPartList = async () => {
  try {
    const res = await getPartList({ keyword: searchKey.value });
    if (res.code === 200) {
      partList.value = res.data;
    }
  } catch (err) {
    showMessage('获取列表失败，请重试', 'error');
  }
};

// 新增
const handleCreate = () => {
  form.value = {
    code: '',
    name: '',
    unit: '',
    version: '',
    status: '',
    mode: '',
    source: '',
    category: '',
    attrs: { length: '', width: '' }
  };
  dialogVisible.value = true;
};

// 编辑：回显数据到弹窗
const handleEdit = async (part) => {
  dialogVisible.value = true;
  try {
    const res = await getPartDetail(part.id); // 假设使用 id 获取详情
    if (res.code === 200) {
      form.value = { 
        ...res.data, 
        attrs: { 
          length: res.data.length || '', 
          width: res.data.width || '' 
        } 
      };
    }
  } catch (err) {
    showMessage('获取详情失败，请重试', 'error');
  }
};

// 保存：新增/编辑逻辑
const handleSave = async () => {
  if (!form.value.code || !form.value.name) {
    showMessage('编码和名称为必填项', 'warning');
    return;
  }
  
  try {
    let res;
    if (form.value.id) { // 如果有 id 则为更新操作
      res = await updatePart(form.value);
    } else { // 没有 id 则为新增操作
      res = await createPart(form.value);
    }
    if (res.code === 200) {
      showMessage('保存成功', 'success');
      dialogVisible.value = false;
      fetchPartList(); // 刷新列表
    }
  } catch (err) {
    showMessage('保存失败，请重试', 'error');
  }
};

// 删除
const handleDelete = async (part) => {
  if (!confirm('确定要删除该 Part 吗？此操作不可恢复。')) {
    return;
  }
  
  try {
    const res = await deletePart(part.id); // 假设使用 id 删除
    if (res.code === 200) {
      showMessage('删除成功', 'success');
      fetchPartList(); // 刷新列表
    }
  } catch (err) {
    showMessage('删除失败，请重试', 'error');
  }
};

// 查询历史版本（这里没有对应的 API 方法，暂时保留模拟逻辑）
const handleViewHistory = async (part) => {
  historyDialogVisible.value = true;
  try {
    // 这里需要添加查询历史版本的 API 方法
    // const res = await getPartHistory(part.code);
    // if (res.code === 200) {
    //   historyList.value = res.data;
    // }
  } catch (err) {
    showMessage('获取历史版本失败，请重试', 'error');
  }
};

// 行悬停效果
const hoverRow = (index) => {
  hoveredIndex.value = index;
};

const leaveRow = () => {
  hoveredIndex.value = null;
};

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false;
};

const closeHistoryDialog = () => {
  historyDialogVisible.value = false;
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

// 监听深色模式变化，更新 body 类
watch(isDarkMode, (newValue) => {
  document.body.classList.toggle('dark-mode', newValue);
});

onMounted(() => {
  fetchPartList(); // 初始化加载列表
  
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

/* 确保页面可以滚动 */
html, body {
  height: 100%;
  overflow-y: auto;
}

.part-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px;
  transition: background-color 0.3s ease;
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
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
  width: 100%;
  max-width: 1920px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: fadeInUp 0.6s ease-out forwards;
  margin: 20px 0; /* 添加上下边距 */
}

body.dark-mode .content-wrapper {
  background: rgba(0, 0, 0, 0.8);
}

/* 页面标题区 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 15px;
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
  gap: 15px;
  margin-top: 5px;
}

.action-button {
  width: 40px;
  height: 40px;
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
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

/* 搜索栏 */
.search-section {
  margin-bottom: 30px;
  text-align: center;
}

.search-container {
  display: flex;
  align-items: center;
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
  padding: 12px 15px;
  border: none;
  font-size: 0.9rem;
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
  padding: 12px 18px;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.create-button {
  background: #10b981;
  margin-left: 10px;
}

.search-button:hover {
  background: #2563eb;
}

.create-button:hover {
  background: #059669;
}

/* 列表卡片 */
.list-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 25px;
}

body.dark-mode .list-card {
  background: rgba(255, 255, 255, 0.05);
}

.list-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 15px;
  margin-bottom: 25px;
  text-align: center;
}

body.dark-mode .card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a8a;
}

body.dark-mode .card-title {
  color: #ffffff;
}

.card-meta {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 8px;
}

body.dark-mode .card-meta {
  color: #cbd5e1;
}

/* 表格样式 */
.table-container {
  width: 100%;
  overflow-x: auto; /* 水平滚动 */
}

.attribute-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: auto;
  min-width: 800px; /* 设置最小宽度，确保在小屏幕上能正常显示 */
}

.attribute-table th,
.attribute-table td {
  padding: 12px 10px;
  text-align: left;
  vertical-align: middle;
  transition: background-color 0.2s ease;
  border: none;
  font-size: 0.9rem;
  white-space: nowrap; /* 防止文本换行 */
}

/* 表头样式 */
.attribute-table th {
  font-weight: 600;
  color: #1e3a8a;
  background: #eff6ff;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #dbeafe;
}

body.dark-mode .attribute-table th {
  color: #ffffff;
  background: #1e3a8a;
  border-bottom: 1px solid #3b82f6;
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
  background-color: #dbeafe !important;
}

body.dark-mode .hover-row {
  background-color: #1e40af !important;
}

.table-row:last-child td {
  border-bottom: none;
}

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

.history {
  background: #d1fae5;
  color: #059669;
}

.history:hover {
  background: #a7f3d0;
  transform: translateY(-2px);
}

/* 弹窗样式 */
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
  max-width: 800px;
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

.history-dialog {
  max-width: 600px;
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
  color: #1e3a8a;
}

body.dark-mode .dialog-title {
  color: #ffffff;
}

.dialog-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.dialog-close:hover {
  color: #1e293b;
}

body.dark-mode .dialog-close {
  color: #cbd5e1;
}

body.dark-mode .dialog-close:hover {
  color: #ffffff;
}

.dialog-body {
  padding: 25px;
  max-height: 70vh;
  overflow-y: auto;
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
  background: #3b82f6;
  color: white;
}

.save:hover {
  background: #2563eb;
}

body.dark-mode .cancel {
  background: #334155;
  color: #cbd5e1;
}

body.dark-mode .cancel:hover {
  background: #475569;
}

/* 表单样式 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  color: #475569;
  font-size: 0.9rem;
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
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  outline: none;
}

body.dark-mode .form-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #475569;
  color: #ffffff;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* 历史版本表格 */
.history-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.history-table th,
.history-table td {
  padding: 10px 8px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
}

body.dark-mode .history-table th,
body.dark-mode .history-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.history-table th {
  font-weight: 600;
  color: #1e3a8a;
  background: #eff6ff;
}

body.dark-mode .history-table th {
  color: #ffffff;
  background: #1e3a8a;
}

.history-table td {
  color: #1e293b;
}

body.dark-mode .history-table td {
  color: #ffffff;
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
@media (max-width: 1200px) {
  .content-wrapper {
    padding: 30px;
  }
  
  .attribute-table th,
  .attribute-table td {
    padding: 10px 8px;
    font-size: 0.85rem;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    padding: 25px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .create-button {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .part-container {
    padding: 15px;
  }
  
  .content-wrapper {
    padding: 20px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .attribute-table th,
  .attribute-table td {
    padding: 8px 6px;
    font-size: 0.8rem;
  }
  
  .action-button {
    width: 28px;
    height: 28px;
  }
}
</style>