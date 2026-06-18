import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import mockData from '@/mock/opera-tracks.json'
import type { OperaGroup, OperaSearchState, OperaTrack } from '@/types/opera'

/**
 * 戏曲曲目状态管理
 */
export const useOperaStore = defineStore('opera', () => {
  /** 原始曲目列表 */
  const tracks = mockData.tracks as OperaTrack[]

  /** 搜索关键词 */
  const searchKeyword = ref('')

  /** 按剧种分组的曲目列表 */
  const groupedTracks = computed<OperaGroup[]>(() => {
    const groupMap = new Map<string, OperaGroup>()

    for (const track of tracks) {
      const existing = groupMap.get(track.operaType)
      if (existing) {
        existing.tracks.push(track)
      } else {
        groupMap.set(track.operaType, {
          operaType: track.operaType,
          operaTypeDesc: track.operaTypeDesc,
          tracks: [track],
        })
      }
    }

    return Array.from(groupMap.values())
  })

  /**
   * 根据搜索关键词过滤后的分组曲目列表
   * 匹配规则：曲目标题包含关键词 或 剧种名称包含关键词
   */
  const filteredGroupedTracks = computed<OperaGroup[]>(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    if (!keyword) return groupedTracks.value

    return groupedTracks.value
      .map((group) => {
        const typeMatched = group.operaType.toLowerCase().includes(keyword)
        const matchedTracks = group.tracks.filter(
          (track) =>
            track.title.toLowerCase().includes(keyword) ||
            track.operaType.toLowerCase().includes(keyword),
        )
        if (typeMatched && matchedTracks.length === 0) return group
        if (matchedTracks.length === 0) return null
        return { ...group, tracks: matchedTracks }
      })
      .filter((g): g is OperaGroup => g !== null)
  })

  /** 搜索结果中是否有匹配项 */
  const hasSearchResult = computed(() => filteredGroupedTracks.value.length > 0)

  /** 是否处于搜索状态（关键词非空） */
  const isSearching = computed(() => searchKeyword.value.trim().length > 0)

  /** 完整的搜索状态对象 */
  const searchState = computed<OperaSearchState>(() => ({
    keyword: searchKeyword.value,
    isSearching: isSearching.value,
    hasResult: hasSearchResult.value,
    results: filteredGroupedTracks.value,
  }))

  /**
   * 设置搜索关键词
   * @param keyword - 搜索关键词
   */
  function setSearchKeyword(keyword: string): void {
    searchKeyword.value = keyword
  }

  /**
   * 根据 ID 获取曲目
   * @param id - 曲目 ID
   */
  function getTrackById(id: string): OperaTrack | undefined {
    return tracks.find((track) => track.id === id)
  }

  return {
    tracks,
    searchKeyword,
    groupedTracks,
    filteredGroupedTracks,
    hasSearchResult,
    isSearching,
    searchState,
    setSearchKeyword,
    getTrackById,
  }
})
