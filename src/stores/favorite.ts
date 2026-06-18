import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useOperaStore } from '@/stores/opera'
import type { OperaTrack } from '@/types/opera'

const STORAGE_KEY = 'opera_favorites'

/**
 * 从 localStorage 读取已收藏的曲目 ID 列表
 * @returns 收藏 ID 数组，读取失败时返回空数组
 */
function loadFavoritesFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * 将收藏 ID 列表持久化到 localStorage
 * @param ids - 需要保存的曲目 ID 数组
 */
function saveFavoritesToStorage(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

/**
 * 收藏状态管理 Store
 * 管理用户收藏的曲目列表，并通过 localStorage 持久化
 */
export const useFavoriteStore = defineStore('favorite', () => {
  /** 已收藏的曲目 ID 列表，按收藏时间倒序排列 */
  const favoriteIds = ref<string[]>(loadFavoritesFromStorage())

  const operaStore = useOperaStore()

  /** 已收藏的完整曲目对象列表（按收藏时间倒序） */
  const favoriteTracks = computed<OperaTrack[]>(() => {
    return favoriteIds.value
      .map((id) => operaStore.getTrackById(id))
      .filter((track): track is OperaTrack => track !== undefined)
  })

  /** 已收藏曲目数量 */
  const favoriteCount = computed(() => favoriteIds.value.length)

  /**
   * 判断指定曲目是否已收藏
   * @param trackId - 曲目 ID
   * @returns 是否已收藏
   */
  function isFavorite(trackId: string): boolean {
    return favoriteIds.value.includes(trackId)
  }

  /**
   * 将指定曲目加入收藏，新收藏的曲目排在列表最前
   * @param trackId - 曲目 ID
   */
  function addFavorite(trackId: string): void {
    if (!isFavorite(trackId)) {
      favoriteIds.value.unshift(trackId)
    }
  }

  /**
   * 将指定曲目从收藏中移除
   * @param trackId - 曲目 ID
   */
  function removeFavorite(trackId: string): void {
    const index = favoriteIds.value.indexOf(trackId)
    if (index !== -1) {
      favoriteIds.value.splice(index, 1)
    }
  }

  /**
   * 切换指定曲目的收藏状态：已收藏则取消，未收藏则添加
   * @param trackId - 曲目 ID
   */
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
