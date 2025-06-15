<template>
  <div class="container">
    <h2>分类列表</h2>
    <button @click="goAdd">新增分类</button>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in categories" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>
            <button @click="goEdit(item.id)">编辑</button>
            <button @click="deleteCategory(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([
  { id: 1, name: 'LOL' },
  { id: 2, name: '天文' },
  { id: 3, name: '呼啦啦' }
])

const goAdd = () => router.push('/category/add')
const goEdit = (id) => router.push(`/category/edit/${id}`)

const deleteCategory = (id) => {
  if (confirm('确定删除？')) {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      alert('删除成功！')
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  background: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
}
h2 {
  color: #0077b6;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 12px;
  text-align: center;
}
button {
  margin: 0 5px;
  padding: 6px 12px;
  border-radius: 6px;
}
button:nth-child(1) {
  background: #48cae4;
  color: white;
  border: none;
}
button:nth-child(2) {
  background: #ef233c;
  color: white;
  border: none;
}
</style>
