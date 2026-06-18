import { defineStore } from 'pinia'
import { computed } from 'vue'
import mockData from '@/mock/opera-tracks.json'
import type { OperaGroup, OperaTrack } from '@/types/opera'

/**
 * 戏曲曲目状态管理
 */
export const useOperaStore = defineStore('opera', () => {
  const tracks = mockData.tracks as OperaTrack[]

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
   * 根据 ID 获取曲目
   * @param id - 曲目 ID
   */
  function getTrackById(id: string): OperaTrack | undefined {
    return tracks.find((track) => track.id === id)
  }

  return {
    tracks,
    groupedTracks,
    getTrackById,
  }
})
