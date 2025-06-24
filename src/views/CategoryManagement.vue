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
              <th>关联属性</th> <!-- 新增列 -->
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
                {{ getAttributeNamesByCodes(category.attributes) }}
              </td>
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

            <!-- 关联属性多选框 -->
            <div class="attributes-checkbox-group">
              <label>关联属性：</label>
              <div v-for="attr in attributes" :key="attr.code" class="checkbox-item">
                <input
                  type="checkbox"
                  :value="attr.code"
                  v-model="formData.attributes"
                  :id="'attr-' + attr.code"
                />
                <label :for="'attr-' + attr.code">{{ attr.name }}</label>
              </div>
            </div>

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
import { ref, computed, defineComponent, h, onMounted } from 'vue'
import { getCategoryList, createCategory, updateCategory, deleteCategory } from '@/api/category'
// import { getAttributeList } from '@/api/attribute' // 也需要封装属性接口

const searchKeyword = ref('')
const showDialog = ref(false)
const isEditing = ref(false)
const showTree = ref(false)

const categories = ref([])
const attributes = ref([])
const filteredCategories = ref([])

const formData = ref({
  code: '',
  name: '',
  description: '',
  status: '有效',
  parent: '',
  instantiated: '是',
  attributes: []
})

const fetchCategories = async () => {
  try {
    const res = await getCategoryList()
    if (res.data.code === 0) {
      categories.value = res.data.data || []
      filteredCategories.value = [...categories.value]
    } else {
      alert('加载分类失败：' + res.data.result)
    }
  } catch (error) {
    alert('加载分类失败，请检查网络')
    console.error(error)
  }
}

const fetchAttributes = async () => {
  try {
    const res = await getAttributeList()
    if (res.data.code === 0) {
      attributes.value = res.data.data || []
    } else {
      alert('加载属性失败：' + res.data.result)
    }
  } catch (error) {
    alert('加载属性失败，请检查网络')
    console.error(error)
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchAttributes()
})

const openAddDialog = () => {
  isEditing.value = false
  formData.value = {
    code: '',
    name: '',
    description: '',
    status: '有效',
    parent: '',
    instantiated: '是',
    attributes: []
  }
  showDialog.value = true
}

const openEditDialog = (category) => {
  isEditing.value = true
  formData.value = { ...category, attributes: [...(category.attributes || [])] }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const submitCategory = async () => {
  if (!formData.value.code.trim() || !formData.value.name.trim()) {
    alert('编码和名称不能为空')
    return
  }

  try {
    if (isEditing.value) {
      const res = await updateCategory(formData.value)
      if (res.data.code === 0) {
        await fetchCategories()
        closeDialog()
      } else {
        alert('修改失败：' + res.data.result)
      }
    } else {
      if (categories.value.some(c => c.code === formData.value.code)) {
        alert('编码重复')
        return
      }
      const res = await createCategory(formData.value)
      if (res.data.code === 0) {
        await fetchCategories()
        closeDialog()
      } else {
        alert('新增失败：' + res.data.result)
      }
    }
  } catch (error) {
    alert('操作失败，请检查网络')
    console.error(error)
  }
}

const handleDelete = async (code) => {
  if (!confirm('确认删除该分类吗？')) return

  try {
    const res = await deleteCategory(code)
    if (res.data.code === 0) {
      await fetchCategories()
      if (formData.value.code === code) {
        closeDialog()
      }
    } else {
      alert('删除失败：' + res.data.result)
    }
  } catch (error) {
    alert('删除失败，请检查网络')
    console.error(error)
  }
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

const getAttributeNamesByCodes = (codes) => {
  if (!codes || codes.length === 0) return ''
  return attributes.value
    .filter(attr => codes.includes(attr.code))
    .map(attr => attr.name)
    .join(', ')
}

const rootCategories = computed(() => categories.value.filter(c => !c.parent))

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
    return () =>
      h('li', [
        props.category.name,
        props.getChildren(props.category.code).length > 0 &&
          h(
            'ul',
            props.getChildren(props.category.code).map((child) =>
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

.attributes-checkbox-group {
  margin: 15px 0;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px; /* 行间距、列间距 */
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;   /* 不压缩 */
  white-space: nowrap;  /* 防止文字换行 */
  font-size: 14px;
}



.checkbox-item input[type="checkbox"] {
  cursor: pointer;
}
</style>