import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import mockData from '@/mock/opera-tracks.json'
import type { OperaGroup, OperaTrack } from '@/types/opera'

export const useOperaStore = defineStore('opera', () => {
  const tracks = mockData.tracks as OperaTrack[]

  const searchKeyword = ref('')

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

  const hasSearchResult = computed(() => filteredGroupedTracks.value.length > 0)

  const isSearching = computed(() => searchKeyword.value.trim().length > 0)

  function setSearchKeyword(keyword: string): void {
    searchKeyword.value = keyword
  }

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
    setSearchKeyword,
    getTrackById,
  }
})
