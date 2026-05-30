<template>
  <div class="canvas-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Canvas, Rect, FabricImage } from 'fabric'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let canvas: Canvas | null = null

onMounted(() => {
  if (!canvasRef.value) return

  // 初始化画布
  canvas = new Canvas(canvasRef.value, {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#f5f5f5',
  })

  // 添加一个可拖拽的矩形（测试是否正常）
  const rect = new Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    fill: '#42b983',
  })
  canvas.add(rect)

  // 加载一张图片
  FabricImage.fromURL('https://picsum.photos/400/300').then((img) => {
    if (!canvas) return
    img.set({
      left: 300,
      top: 100,
      scaleX: 0.5,
      scaleY: 0.5,
    })
    canvas.add(img)
  })
})

// 销毁画布，防止内存泄漏
onUnmounted(() => {
  canvas?.dispose()
})
</script>

<style scoped>
.canvas-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
canvas {
  display: block;
}
</style>
