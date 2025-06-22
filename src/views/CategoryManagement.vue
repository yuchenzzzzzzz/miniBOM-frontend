<template>
  <div class="category-page-wrapper">
    <div class="category-container">
      <h2>分类管理</h2>

      <!-- 分类操作栏 -->
      <div class="action-bar">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索分类名称或编码"
        />
        <button @click="handleSearch">搜索</button>
        <button @click="openAddDialog">新增分类</button>
        <button @click="toggleTree">{{ showTree ? '隐藏分类树' : '查看分类树' }}</button>
      </div>

      <!-- 树状结构展示 -->
      <div class="category-tree" v-if="showTree">
        <h3>分类树结构</h3>
        <ul>
          <TreeNode
            v-for="node in rootCategories"
            :key="node.code"
            :category="node"
            :get-children="getChildren"
          />
        </ul>
      </div>

      <!-- 分类列表 -->
      <div v-if="filteredCategories.length">
        <table class="category-table">
          <thead>
            <tr>
              <th>编码</th>
              <th>名称</th>
              <th>描述</th>
              <th>状态</th>
              <th>是否实例化</th>
              <th>父分类</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in filteredCategories" :key="category.code">
              <td>{{ category.code }}</td>
              <td>{{ category.name }}</td>
              <td class="description-cell">{{ category.description }}</td>
              <td>{{ category.status }}</td>
              <td>{{ category.instantiated }}</td>
              <td>{{ getCategoryNameByCode(category.parent) }}</td>
              <td>
                <button @click="openEditDialog(category)">编辑</button>
                <button @click="deleteCategory(category.code)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-data">暂无数据</div>

      <!-- 新增/编辑弹窗 -->
      <div class="modal-overlay" v-if="showDialog">
        <div class="modal-container">
          <h3>{{ isEditing ? '编辑分类' : '新增分类' }}</h3>
          <form @submit.prevent="submitCategory">
            <input
              v-model="formData.code"
              type="text"
              placeholder="分类编码"
              :disabled="isEditing"
              required
            />
            <input
              v-model="formData.name"
              type="text"
              placeholder="分类名称"
              required
            />
            <textarea
              v-model="formData.description"
              placeholder="分类描述"
              rows="4"
            />
            <select v-model="formData.status">
              <option value="有效">有效</option>
              <option value="无效">无效</option>
            </select>
            <select v-model="formData.instantiated">
              <option value="是">是</option>
              <option value="否">否</option>
            </select>
            <select v-model="formData.parent">
              <option value="">无（根节点）</option>
              <option v-for="c in categories" :key="c.code" :value="c.code">
                {{ c.name }}
              </option>
            </select>
            <div class="button-group">
              <button type="submit">{{ isEditing ? '保存修改' : '添加' }}</button>
              <button type="button" @click="closeDialog">取消</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'

const searchKeyword = ref('')
const showDialog = ref(false)
const isEditing = ref(false)
const showTree = ref(false)
const categories = ref([
  { code: '001', name: '齿轮', description: '用于传动', status: '有效', parent: '', instantiated: '是' },
  { code: '002', name: '电机', description: '动力来源', status: '无效', parent: '', instantiated: '否' },
])

const formData = ref({
  code: '',
  name: '',
  description: '',
  status: '有效',
  parent: '',
  instantiated: '是'
})

const filteredCategories = ref([...categories.value])

const openAddDialog = () => {
  isEditing.value = false
  formData.value = { code: '', name: '', description: '', status: '有效', parent: '', instantiated: '是' }
  showDialog.value = true
}

const openEditDialog = (category) => {
  isEditing.value = true
  formData.value = { ...category }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const submitCategory = () => {
  if (!formData.value.code.trim() || !formData.value.name.trim()) {
    alert('编码和名称不能为空')
    return
  }
  if (isEditing.value) {
    const index = categories.value.findIndex(c => c.code === formData.value.code)
    if (index !== -1) {
      categories.value[index] = { ...formData.value }
    }
  } else {
    const exists = categories.value.some(c => c.code === formData.value.code)
    if (exists) {
      alert('编码重复')
      return
    }
    categories.value.push({ ...formData.value })
  }
  filteredCategories.value = [...categories.value]
  closeDialog()
}

const deleteCategory = (code) => {
  categories.value = categories.value.filter(c => c.code !== code)
  filteredCategories.value = filteredCategories.value.filter(c => c.code !== code)
}

const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (!keyword) {
    filteredCategories.value = [...categories.value]
  } else {
    filteredCategories.value = categories.value.filter(c =>
      c.name.includes(keyword) || c.code.includes(keyword)
    )
  }
}

const getCategoryNameByCode = (code) => {
  const match = categories.value.find(c => c.code === code)
  return match ? match.name : ''
}

const rootCategories = computed(() =>
  categories.value.filter(c => !c.parent)
)

const getChildren = (parentCode) =>
  categories.value.filter(c => c.parent === parentCode)

const toggleTree = () => {
  showTree.value = !showTree.value
}

const TreeNode = defineComponent({
  props: {
    category: Object,
    getChildren: Function
  },
  setup(props) {
    return () => h('li', [
      props.category.name,
      props.getChildren(props.category.code).length > 0 &&
        h('ul',
          props.getChildren(props.category.code).map(child =>
            h(TreeNode, {
              category: child,
              getChildren: props.getChildren,
              key: child.code
            })
          )
        )
    ])
  }
})
</script>


<style scoped>
.category-page-wrapper {
  min-height: 100vh;
  width: 200%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f0f8ff 0%, #c3d9ff 100%);
}

.category-container {
  width: 100%;
  max-width: 960px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.category-container h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.category-page-wrapper::before {
  content: '';                /* 确保伪元素存在 */
  position: fixed;            /* 固定定位，填满整个页面 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;                  /* 让背景填充整个视口 */
  background: linear-gradient(135deg, #f0f8ff 0%, #c3d9ff 100%);
  z-index: -1;                /* 确保背景位于最底层 */
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.action-bar input {
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.action-bar button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.action-bar button:hover {
  background-color: #2980b9;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.category-table th,
.category-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

.category-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  color: #333;
}

.category-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.modal-container h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.modal-container form {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中所有子元素 */
}

.modal-container form input,
.modal-container form select {
  width: 80%;          /* 宽度80%弹窗宽度 */
  max-width: 300px;    /* 最大宽度300px */
  padding: 10px 12px;
  margin-bottom: 15px; /* 输入框之间间距 */
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.modal-container form input:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.modal-container form textarea {
  width: 80%;
  max-width: 300px;
  padding: 10px 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  resize: vertical; /* 允许用户上下拉伸高度 */
  line-height: 1.5;
  overflow-wrap: break-word; /* 自动换行 */
  white-space: pre-wrap;     /* 保留空格和换行 */
}

.description-cell {
  max-width: 200px;          /* 控制列最大宽度 */
  word-break: break-word;    /* 单词内断行 */
  white-space: normal;       /* 允许换行 */
}


.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.button-group button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

.button-group button:first-child {
  background-color: #3498db;
  color: white;
}

.button-group button:first-child:hover {
  background-color: #2980b9;
}

.button-group button:last-child {
  background-color: #ccc;
  color: #333;
}

.button-group button:last-child:hover {
  background-color: #b3b3b3;
}

.category-tree {
  margin: 20px 0;
  padding: 10px;
  background: #eef4ff;
  border-radius: 8px;
}
.category-tree ul {
  list-style: none;
  padding-left: 20px;
}
.category-tree li {
  margin: 4px 0;
}

</style>