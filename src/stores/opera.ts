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

  /** 当前选中的剧种筛选标签，空字符串表示全部 */
  const selectedOperaType = ref('')

  /** 推荐曲目列表 */
  const recommendedTracks = ref<OperaTrack[]>([])

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
   * 所有剧种名称列表
   */
  const operaTypes = computed<string[]>(() => {
    return groupedTracks.value.map((group) => group.operaType)
  })

  /**
   * 根据剧种筛选和搜索关键词过滤后的分组曲目列表
   * 匹配规则：先按剧种筛选，再按搜索关键词过滤
   */
  const filteredGroupedTracks = computed<OperaGroup[]>(() => {
    let result = groupedTracks.value

    if (selectedOperaType.value) {
      result = result.filter((group) => group.operaType === selectedOperaType.value)
    }

    const keyword = searchKeyword.value.trim().toLowerCase()
    if (!keyword) return result

    return result
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
   * 设置选中的剧种筛选标签
   * @param operaType - 剧种名称，空字符串表示全部
   */
  function setSelectedOperaType(operaType: string): void {
    selectedOperaType.value = operaType
  }

  /**
   * 根据 ID 获取曲目
   * @param id - 曲目 ID
   */
  function getTrackById(id: string): OperaTrack | undefined {
    return tracks.find((track) => track.id === id)
  }

  /**
   * 根据剧种名称获取该剧种的分组信息
   * @param operaType - 剧种名称
   * @returns 剧种分组对象，包含剧种名称、简介和曲目列表
   */
  function getGroupByOperaType(operaType: string): OperaGroup | undefined {
    return groupedTracks.value.find((group) => group.operaType === operaType)
  }

  /**
   * 从数组中随机选取一个元素
   * @param arr - 源数组
   * @returns 随机选取的元素
   */
  function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  /**
   * 生成随机推荐曲目
   * 从全部曲目中随机抽取三条不同剧种的曲目
   */
  function generateRecommendations(): void {
    const groups = groupedTracks.value
    if (groups.length === 0) {
      recommendedTracks.value = []
      return
    }

    const shuffledGroups = [...groups].sort(() => Math.random() - 0.5)
    const selectedGroups = shuffledGroups.slice(0, Math.min(3, shuffledGroups.length))

    recommendedTracks.value = selectedGroups.map((group) => getRandomItem(group.tracks))
  }

  /**
   * 刷新推荐曲目列表
   */
  function refreshRecommendations(): void {
    generateRecommendations()
  }

  /**
   * 获取同剧种中的上一曲目
   * @param id - 当前曲目 ID
   * @returns 上一曲目，若为第一首则返回 undefined
   */
  function getPrevTrackInSameOperaType(id: string): OperaTrack | undefined {
    const currentTrack = getTrackById(id)
    if (!currentTrack) return undefined

    const group = getGroupByOperaType(currentTrack.operaType)
    if (!group) return undefined

    const index = group.tracks.findIndex((t) => t.id === id)
    if (index <= 0) return undefined

    return group.tracks[index - 1]
  }

  /**
   * 获取同剧种中的下一曲目
   * @param id - 当前曲目 ID
   * @returns 下一曲目，若为最后一首则返回 undefined
   */
  function getNextTrackInSameOperaType(id: string): OperaTrack | undefined {
    const currentTrack = getTrackById(id)
    if (!currentTrack) return undefined

    const group = getGroupByOperaType(currentTrack.operaType)
    if (!group) return undefined

    const index = group.tracks.findIndex((t) => t.id === id)
    if (index === -1 || index >= group.tracks.length - 1) return undefined

    return group.tracks[index + 1]
  }

  return {
    tracks,
    searchKeyword,
    selectedOperaType,
    recommendedTracks,
    groupedTracks,
    operaTypes,
    filteredGroupedTracks,
    hasSearchResult,
    isSearching,
    searchState,
    setSearchKeyword,
    setSelectedOperaType,
    getTrackById,
    getGroupByOperaType,
    generateRecommendations,
    refreshRecommendations,
    getPrevTrackInSameOperaType,
    getNextTrackInSameOperaType,
  }
})
