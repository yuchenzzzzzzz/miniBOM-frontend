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
                :key="index" 
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

// 模拟请求
const mockRequest = {
  // 获取 Part 列表
  getPartList: (params) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { code: '411910001', name: '华为Mate60', unit: '台', version: 'A1', status: 'V1', mode: '装配', source: '自研', category: '手机' },
          { code: '411910002', name: '小米14', unit: '台', version: 'B2', status: 'V2', mode: '组装', source: '自研', category: '手机' },
          { code: '411910003', name: '苹果iPhone15', unit: '台', version: 'C3', status: 'V3', mode: '组装', source: '进口', category: '手机' },
          { code: '411910004', name: '三星GalaxyS24', unit: '台', version: 'D4', status: 'V4', mode: '装配', source: '进口', category: '手机' },
          { code: '411910005', name: 'OPPOFindX7', unit: '台', version: 'E5', status: 'V5', mode: '组装', source: '自研', category: '手机' },
          { code: '411910006', name: 'VivoX100', unit: '台', version: 'F6', status: 'V6', mode: '装配', source: '自研', category: '手机' },
          { code: '411910007', name: '一加12', unit: '台', version: 'G7', status: 'V7', mode: '组装', source: '自研', category: '手机' },
          { code: '411910008', name: '荣耀Magic6', unit: '台', version: 'H8', status: 'V8', mode: '装配', source: '自研', category: '手机' },
        ]
      });
    }, 500); // 模拟网络延迟
  }),
  
  // 保存/编辑 Part
  savePart: (data) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '操作成功' });
    }, 500);
  }),
  
  // 删除 Part
  deletePart: (code) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 200, msg: '删除成功' });
    }, 500);
  }),
  
  // 查询历史版本
  getPartHistory: (partCode) => new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          { version: 'A1', createTime: '2025-06-01', operator: 'admin' },
          { version: 'A2', createTime: '2025-06-15', operator: 'user01' },
          { version: 'A3', createTime: '2025-06-30', operator: 'admin' }
        ]
      });
    }, 500);
  })
}

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
    const res = await mockRequest.getPartList({ keyword: searchKey.value });
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
const handleEdit = (part) => {
  dialogVisible.value = true;
  form.value = { 
    ...part, 
    attrs: { 
      length: part.length || '', 
      width: part.width || '' 
    } 
  };
};

// 保存：新增/编辑逻辑
const handleSave = async () => {
  if (!form.value.code || !form.value.name) {
    showMessage('编码和名称为必填项', 'warning');
    return;
  }
  
  try {
    const res = await mockRequest.savePart(form.value);
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
    const res = await mockRequest.deletePart(part.code);
    if (res.code === 200) {
      showMessage('删除成功', 'success');
      fetchPartList(); // 刷新列表
    }
  } catch (err) {
    showMessage('删除失败，请重试', 'error');
  }
};

// 查询历史版本
const handleViewHistory = async (part) => {
  historyDialogVisible.value = true;
  try {
    const res = await mockRequest.getPartHistory(part.code);
    if (res.code === 200) {
      historyList.value = res.data;
    }
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

.part-container {
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
  width: 90%;
  max-width: 1400px;
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
  color: #1e3a8a;
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
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

/* 搜索栏 */
.search-section {
  margin-bottom: 40px;
  text-align: center;
}

.search-container {
  display: inline-flex;
  align-items: center;
  max-width: 1000px;
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
  padding: 14px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.create-button {
  background: #10b981;
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
  padding: 30px;
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
  color: #1e3a8a;
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
  width: 90%;
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
  padding: 20px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

body.dark-mode .dialog-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-title {
  font-size: 1.5rem;
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
  font-size: 1.2rem;
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
  padding: 30px;
  max-height: 70vh;
  overflow-y: auto;
}

.dialog-footer {
  padding: 20px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

body.dark-mode .dialog-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
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
  padding: 12px 10px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease forwards;
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
</style>
