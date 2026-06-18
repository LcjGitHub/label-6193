import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useOperaStore } from '@/stores/opera'
import type { OperaTrack } from '@/types/opera'

const STORAGE_KEY = 'opera_favorites'

function loadFavoritesFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveFavoritesToStorage(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export const useFavoriteStore = defineStore('favorite', () => {
  const favoriteIds = ref<string[]>(loadFavoritesFromStorage())

  const operaStore = useOperaStore()

  const favoriteTracks = computed<OperaTrack[]>(() => {
    return favoriteIds.value
      .map((id) => operaStore.getTrackById(id))
      .filter((track): track is OperaTrack => track !== undefined)
  })

  const favoriteCount = computed(() => favoriteIds.value.length)

  function isFavorite(trackId: string): boolean {
    return favoriteIds.value.includes(trackId)
  }

  function addFavorite(trackId: string): void {
    if (!isFavorite(trackId)) {
      favoriteIds.value.unshift(trackId)
    }
  }

  function removeFavorite(trackId: string): void {
    const index = favoriteIds.value.indexOf(trackId)
    if (index !== -1) {
      favoriteIds.value.splice(index, 1)
    }
  }

  function toggleFavorite(trackId: string): void {
    if (isFavorite(trackId)) {
      removeFavorite(trackId)
    } else {
      addFavorite(trackId)
    }
  }

  watch(
    favoriteIds,
    (newIds) => {
      saveFavoritesToStorage(newIds)
    },
    { deep: true },
  )

  return {
    favoriteIds,
    favoriteTracks,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
})
