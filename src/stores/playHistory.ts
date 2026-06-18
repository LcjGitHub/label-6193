import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useOperaStore } from '@/stores/opera'
import type { PlayHistoryRecord } from '@/types/opera'

const STORAGE_KEY = 'opera_play_history'
const MAX_HISTORY_COUNT = 10

/**
 * 从 localStorage 读取播放记录列表
 * @returns 播放记录数组，读取失败时返回空数组
 */
function loadHistoryFromStorage(): PlayHistoryRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * 将播放记录列表持久化到 localStorage
 * @param records - 需要保存的播放记录数组
 */
function saveHistoryToStorage(records: PlayHistoryRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

/**
 * 播放记录状态管理 Store
 * 管理用户的最近播放记录，并通过 localStorage 持久化，最多保留 10 条
 */
export const usePlayHistoryStore = defineStore('playHistory', () => {
  /** 播放记录列表 */
  const historyRecords = ref<PlayHistoryRecord[]>(loadHistoryFromStorage())

  const operaStore = useOperaStore()

  /** 按播放时间倒序排列的播放记录列表 */
  const sortedHistoryRecords = computed<PlayHistoryRecord[]>(() => {
    return [...historyRecords.value].sort((a, b) => b.playedAt - a.playedAt)
  })

  /** 播放记录数量 */
  const historyCount = computed(() => historyRecords.value.length)

  /**
   * 将指定曲目加入播放记录，新记录排在列表最前
   * 若该曲目已存在，则更新其播放时间并移至最前
   * 超过最大保留数量时移除最早的记录
   * @param trackId - 曲目 ID
   */
  function addPlayRecord(trackId: string): void {
    const track = operaStore.getTrackById(trackId)
    if (!track) return

    const existingIndex = historyRecords.value.findIndex((r) => r.trackId === trackId)
    if (existingIndex !== -1) {
      historyRecords.value.splice(existingIndex, 1)
    }

    historyRecords.value.unshift({
      trackId: track.id,
      title: track.title,
      operaType: track.operaType,
      playedAt: Date.now(),
    })

    if (historyRecords.value.length > MAX_HISTORY_COUNT) {
      historyRecords.value = historyRecords.value.slice(0, MAX_HISTORY_COUNT)
    }
  }

  /**
   * 清空所有播放记录
   */
  function clearHistory(): void {
    historyRecords.value = []
  }

  watch(
    historyRecords,
    (newRecords) => {
      saveHistoryToStorage(newRecords)
    },
    { deep: true },
  )

  return {
    historyRecords,
    sortedHistoryRecords,
    historyCount,
    addPlayRecord,
    clearHistory,
  }
})
