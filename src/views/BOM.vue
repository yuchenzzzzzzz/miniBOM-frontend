<template>
  <div class="bom-page-wrapper">
    <div class="bom-container">
      <h2>BOM管理</h2>

      <!-- 操作栏 -->
      <div class="action-bar">
        <input v-model="searchKeyword" type="text" placeholder="搜索零件名称 / 位号" />
        <button @click="handleSearch">搜索</button>
        <button @click="openAddDialog">新增BOM</button>
        <button @click="toggleTree">{{ showTree ? '隐藏BOM树' : '查看BOM树' }}</button>
      </div>

      <!-- 树 + 表格内容 -->
      <div class="bom-content">
        <!-- 树状结构展示 -->
        <div class="bom-tree" v-if="showTree">
          <h3>BOM树结构</h3>
          <ul>
            <TreeNode v-for="node in treeRoots" :key="node.BOMLinkId" :node="node" />
          </ul>
        </div>

        <!-- 表格展示区域 -->
        <div class="bom-table">
          <h3>BOM列表</h3>
          <table>
            <thead>
              <tr>
                <th>父零件</th>
                <th>子零件</th>
                <th>数量</th>
                <!-- <th>序号</th> -->
                <th>位号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredBoms" :key="item.BOMLinkId">
                <!-- <td>{{ item.BOMLinkId }}</td> -->
                <td>{{ getPartName(item.sourceId) }}</td>
                <td>{{ getPartName(item.targetId) }}</td>
                <td>{{ item.quantity }}</td>
                <!-- <td>{{ item.sequenceNumber }}</td> -->
                <td>{{ item.referenceDesignator }}</td>
                <td>
                  <button @click="openEditDialog(item)">编辑</button>
                  <button @click="deleteBom(item.BOMLinkId)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 弹窗对话框 -->
      <div class="modal-overlay" v-if="showDialog">
        <div class="modal-container">
          <h3>{{ isEditing ? '编辑BOM' : '新增BOM' }}</h3>
          <form @submit.prevent="submitBom">
            <form @submit.prevent="submitBom" class="bom-form">
              <div class="form-group">
                <label for="sourceId">父零件（来源零件）</label>
                <select id="sourceId" v-model="formData.sourceId" required>
                  <option value="">请选择父零件</option>
                  <option v-for="part in parts" :key="part.id" :value="part.id">
                    {{ part.name }} ({{ part.code }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="targetId">子零件（目标零件）</label>
                <select id="targetId" v-model="formData.targetId" required>
                  <option value="">请选择子零件</option>
                  <option v-for="part in parts" :key="part.id" :value="part.id">
                    {{ part.name }} ({{ part.code }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="quantity">数量</label>
                <input id="quantity" v-model.number="formData.quantity" type="number" min="1" required
                  placeholder="请输入数量，必须大于等于1" />
              </div>

              <!-- <div class="form-group">
                <label for="sequenceNumber">序号</label>
                <input id="sequenceNumber" v-model.number="formData.sequenceNumber" type="number" min="1" required
                  placeholder="请输入序号，决定显示顺序" />
              </div> -->

              <div class="form-group">
                <label for="referenceDesignator">位号</label>
                <input id="referenceDesignator" v-model="formData.referenceDesignator" type="text" required
                  placeholder="例如：P1, P2, J3" />
              </div>

              <div class="button-group">
                <button type="submit">{{ isEditing ? '保存修改' : '添加' }}</button>
                <button type="button" @click="closeDialog">取消</button>
              </div>
            </form>


          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import * as bomApi from '@/api/bom.js'

// 树节点数据
const treeData = ref([])

// 当前选中节点
const selectedNode = ref(null)

// BOM列表数据
const bomList = ref([])

// 新增/编辑弹窗控制
const dialogVisible = ref(false)
const isEditing = ref(false)

// 表单数据
const form = reactive({
  bomLinkId: null,
  sourceId: null,
  targetId: null,
  sequenceNumber: 1,
  quantity: 1,
  referenceDesignator: ''
})

// 错误提示
const errorMsg = ref('')

// 加载根节点
async function loadRoot() {
  try {
    const root = await bomApi.fetchRootBOM(0)
    // 初始化根节点children为null，点击展开时再加载
    treeData.value = [{ ...root, children: null }]
  } catch (err) {
    errorMsg.value = err.message
  }
}

// 懒加载子节点
async function loadChildren(node) {
  if (node.children !== null) {
    return // 已加载
  }
  try {
    const children = await bomApi.fetchChildren(node.sourceId || node.id)
    node.children = children.map(child => ({
      ...child,
      children: null
    }))
  } catch (err) {
    errorMsg.value = err.message
  }
}

// 选择树节点，加载对应BOM列表
async function onSelectNode(node) {
  selectedNode.value = node
  await loadBomList(node.sourceId || node.id)
}

// 加载BOM列表（加载选中节点的子部件）
async function loadBomList(sourceId) {
  try {
    const data = await bomApi.fetchChildren(sourceId)
    bomList.value = data
  } catch (err) {
    errorMsg.value = err.message
  }
}

// 打开新增弹窗
function openAddDialog() {
  if (!selectedNode.value) {
    errorMsg.value = '请先选择父部件'
    return
  }
  isEditing.value = false
  form.bomLinkId = null
  form.sourceId = selectedNode.value.sourceId || selectedNode.value.id
  form.targetId = null
  form.sequenceNumber = 1
  form.quantity = 1
  form.referenceDesignator = ''
  dialogVisible.value = true
}

// 打开编辑弹窗
function openEditDialog(bomItem) {
  isEditing.value = true
  form.bomLinkId = bomItem.BOMLinkId
  form.sourceId = selectedNode.value.sourceId || selectedNode.value.id
  form.targetId = bomItem.targetId
  form.sequenceNumber = bomItem.sequenceNumber
  form.quantity = bomItem.quantity
  form.referenceDesignator = bomItem.referenceDesignator
  dialogVisible.value = true
}

// 提交表单（新增/编辑）
async function submitForm() {
  try {
    if (isEditing.value) {
      await bomApi.updateBomLink({
        bomLinkId: form.bomLinkId,
        sequenceNumber: form.sequenceNumber,
        quantity: form.quantity,
        referenceDesignator: form.referenceDesignator
      })
    } else {
      await bomApi.createBomLink({
        sourceId: form.sourceId,
        targetId: form.targetId,
        sequenceNumber: form.sequenceNumber,
        quantity: form.quantity,
        referenceDesignator: form.referenceDesignator
      })
    }
    dialogVisible.value = false
    errorMsg.value = ''
    // 刷新树和列表
    await loadRoot()
    if (selectedNode.value) {
      await loadBomList(selectedNode.value.sourceId || selectedNode.value.id)
    }
  } catch (err) {
    errorMsg.value = err.message
  }
}

// 删除BOMLink
async function deleteBom(bomLinkId) {
  try {
    if (!confirm('确认删除该BOM链接吗？')) return
    await bomApi.deleteBomLink(bomLinkId)
    errorMsg.value = ''
    // 删除后刷新
    await loadRoot()
    if (selectedNode.value) {
      await loadBomList(selectedNode.value.sourceId || selectedNode.value.id)
    }
  } catch (err) {
    errorMsg.value = err.message
  }
}

onMounted(() => {
  loadRoot()
})
</script>


<style scoped>
.bom-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #c3d9ff 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 20px;
  box-sizing: border-box;
}

.bom-container {
  width: 200%;
  max-width: 1200px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.bom-container h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.action-bar input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
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

.bom-tree ul {
  padding-left: 20px;
}

.tree-node {
  padding: 10px;
  margin: 5px;
  background: #eef6ff;
  border-left: 4px solid #3498db;
  border-radius: 4px;
  cursor: pointer;
}

.tree-node:hover {
  background: #d8ecff;
}

.bom-table {
  margin-top: 30px;
  background: #fdfdfd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.bom-table table {
  width: 100%;
  border-collapse: collapse;
}

.bom-table th,
.bom-table td {
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.bom-table th {
  background-color: #eaf2ff;
  color: #2c3e50;
}

.bom-table button {
  margin: 0 5px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  font-size: 12px;
}

.bom-table button:hover {
  background-color: #2980b9;
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
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.modal-container form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-container select,
.modal-container input {
  width: 80%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 80%;
}
</style>
