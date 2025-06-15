<template>
  <div class="container">
    <h2>新增分类</h2>
    <form @submit.prevent="submit">
      <label>分类名称：</label>
      <input v-model="name" placeholder="请输入分类名称" />
      <button type="submit">提交</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const categories = ref([
  'LOL', '天文', '呼啦啦' // 模拟已有的分类名
])

const submit = () => {
  if (!name.value.trim()) {
    alert('分类名称不能为空')
    return
  }
  if (categories.value.includes(name.value.trim())) {
    alert('分类名称重复')
    return
  }
  alert('新增成功！')
  router.push('/category')
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #e0f7fa;
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
