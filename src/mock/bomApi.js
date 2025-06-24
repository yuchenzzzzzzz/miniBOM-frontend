// mock/bomApi.js

// 模拟延时
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟BOM结构
const mockBomData = {
  root: {
    BOMLinkId: 1,
    sourceId: 0,
    targetId: 1,
    quantity: 1,
    sequenceNumber: 1,
    referenceDesignator: "P1",
    children: null
  },
  childrenMap: {
    1: [
      {
        BOMLinkId: 2,
        sourceId: 1,
        targetId: 2,
        quantity: 2,
        sequenceNumber: 1,
        referenceDesignator: "P2",
        children: null
      },
      {
        BOMLinkId: 3,
        sourceId: 1,
        targetId: 3,
        quantity: 3,
        sequenceNumber: 2,
        referenceDesignator: "P3",
        children: null
      }
    ],
    2: [
      {
        BOMLinkId: 4,
        sourceId: 2,
        targetId: 4,
        quantity: 1,
        sequenceNumber: 1,
        referenceDesignator: "G1",
        children: null
      }
    ]
  }
}

export const mockBomApi = {
  // 获取根节点
  async getRoot() {
    await delay(300)
    return {
      code: 200,
      data: mockBomData.root
    }
  },

  // 获取某节点的子节点
  async getChildren(sourceId) {
    await delay(300)
    return {
      code: 200,
      data: mockBomData.childrenMap[sourceId] || []
    }
  },

  // 新增一个 BOM 连接
  async createBomLink(newLink) {
    await delay(200)
    newLink.BOMLinkId = Date.now()
    if (!mockBomData.childrenMap[newLink.sourceId]) {
      mockBomData.childrenMap[newLink.sourceId] = []
    }
    mockBomData.childrenMap[newLink.sourceId].push(newLink)
    return { code: 200, data: newLink }
  },

  // 更新 BOM 连接
  async updateBomLink(link) {
    await delay(200)
    const children = mockBomData.childrenMap[link.sourceId] || []
    const index = children.findIndex(c => c.BOMLinkId === link.BOMLinkId)
    if (index !== -1) children[index] = link
    return { code: 200, data: link }
  },

  // 删除 BOM 连接
  async deleteBomLink(BOMLinkId) {
    await delay(200)
    for (const sourceId in mockBomData.childrenMap) {
      const arr = mockBomData.childrenMap[sourceId]
      const index = arr.findIndex(c => c.BOMLinkId === BOMLinkId)
      if (index !== -1) {
        arr.splice(index, 1)
        break
      }
    }
    return { code: 200 }
  },

  // ✅ 新增：获取所有 BOM 记录（用于表格展示）
  async getAll() {
    await delay(200)
    const all = []

    const traverse = (node) => {
      if (!node) return
      if (node.BOMLinkId) {
        all.push({
          BOMLinkId: node.BOMLinkId,
          sourceId: node.sourceId,
          targetId: node.targetId,
          quantity: node.quantity,
          sequenceNumber: node.sequenceNumber,
          referenceDesignator: node.referenceDesignator
        })
      }
      const children = mockBomData.childrenMap[node.targetId]
      if (children && children.length > 0) {
        for (const child of children) {
          traverse(child)
        }
      }
    }

    traverse(mockBomData.root)

    return {
      code: 200,
      data: all
    }
  }
}
