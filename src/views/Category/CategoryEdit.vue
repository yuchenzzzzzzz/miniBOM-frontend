<template>
  <div class="container">
    <h2>编辑分类</h2>
    <form @submit.prevent="submit">
      <label>分类名称：</label>
      <input v-model="name" />
      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const name = ref('')
const id = ref(route.params.id)

// 模拟获取当前分类信息
onMounted(() => {
  // 实际开发中这里应该是后端请求
  name.value = 'LOL' // 假设从后端拿到的旧值
})

const submit = () => {
  if (!name.value.trim()) {
    alert('分类名称不能为空')
    return
  }
  alert('修改成功')
  router.push('/category')
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #e3f2fd;
  border-radius: 10px;
}
input {
  width: 100%;
  padding: 8px;
  margin: 10px 0;
}
button {
  padding: 8px 16px;
  background: #0077b6;
  color: white;
  border: none;
  border-radius: 5px;
}
</style>
