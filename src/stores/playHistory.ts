import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useOperaStore } from '@/stores/opera'
import type { PlayHistoryRecord } from '@/types/opera'

const STORAGE_KEY = 'opera_play_history'
const MAX_HISTORY_COUNT = 10

function loadHistoryFromStorage(): PlayHistoryRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveHistoryToStorage(records: PlayHistoryRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const usePlayHistoryStore = defineStore('playHistory', () => {
  const historyRecords = ref<PlayHistoryRecord[]>(loadHistoryFromStorage())

  const operaStore = useOperaStore()

  const sortedHistoryRecords = computed<PlayHistoryRecord[]>(() => {
    return [...historyRecords.value].sort((a, b) => b.playedAt - a.playedAt)
  })

  const historyCount = computed(() => historyRecords.value.length)

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
