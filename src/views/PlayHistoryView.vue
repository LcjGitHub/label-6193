<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { usePlayHistoryStore } from '@/stores/playHistory'
import type { PlayHistoryRecord } from '@/types/opera'

const router = useRouter()
const playHistoryStore = usePlayHistoryStore()
const { sortedHistoryRecords, historyCount } = storeToRefs(playHistoryStore)

function formatPlayedAtText(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins} 分钟前`
  if (diffHours < 24) return `${diffHours} 小时前`
  if (diffDays < 7) return `${diffDays} 天前`

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const mins = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${mins}`
}

function goToPlay(record: PlayHistoryRecord): void {
  router.push({ name: 'play', params: { id: record.trackId } })
}

function goBack(): void {
  router.push({ name: 'home' })
}

async function handleClearHistory(): Promise<void> {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '确定要清空所有播放记录吗？',
    })
    playHistoryStore.clearHistory()
    showToast('已清空播放记录')
  } catch {
  }
}
</script>

<template>
  <div class="play-history-view">
    <van-nav-bar
      title="最近播放"
      left-arrow
      fixed
      placeholder
      @click-left="goBack"
    >
      <template #right>
        <span class="nav-count-label">{{ historyCount }} 首</span>
      </template>
    </van-nav-bar>

    <div v-if="sortedHistoryRecords.length > 0" class="record-list">
      <van-cell-group inset>
        <van-cell
          v-for="record in sortedHistoryRecords"
          :key="`${record.trackId}-${record.playedAt}`"
          :title="record.title"
          :label="`${record.operaType} · ${formatPlayedAtText(record.playedAt)}`"
          @click="goToPlay(record)"
        >
          <template #icon>
            <van-icon name="clock-o" class="record-icon" />
          </template>
          <template #right-icon>
            <van-icon name="play-circle-o" class="play-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <div class="clear-btn-wrapper">
        <van-button
          block
          type="danger"
          size="small"
          hairline
          @click="handleClearHistory"
        >
          清空播放记录
        </van-button>
      </div>
    </div>

    <van-empty
      v-else
      description="暂无播放记录"
      image="default"
    />
  </div>
</template>

<style scoped>
.play-history-view {
  min-height: 100vh;
}

.nav-count-label {
  font-size: 14px;
  color: #969799;
}

.record-list {
  padding-top: 12px;
}

.record-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #1989fa;
}

.play-icon {
  font-size: 22px;
  color: #1989fa;
}

.clear-btn-wrapper {
  padding: 24px 16px 0;
}
</style>
