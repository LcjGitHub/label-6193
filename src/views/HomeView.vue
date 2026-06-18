<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useOperaStore } from '@/stores/opera'
import { useFavoriteStore } from '@/stores/favorite'
import { usePlayHistoryStore } from '@/stores/playHistory'
import type { OperaTrack } from '@/types/opera'

const router = useRouter()
const operaStore = useOperaStore()
const favoriteStore = useFavoriteStore()
const playHistoryStore = usePlayHistoryStore()
const { filteredGroupedTracks, hasSearchResult, isSearching, searchKeyword } =
  storeToRefs(operaStore)
const { favoriteCount } = storeToRefs(favoriteStore)
const { historyCount } = storeToRefs(playHistoryStore)

/**
 * 跳转至播放页
 * @param track - 目标曲目
 */
function goToPlay(track: OperaTrack): void {
  router.push({ name: 'play', params: { id: track.id } })
}

/**
 * 跳转至收藏页
 */
function goToFavorite(): void {
  router.push({ name: 'favorite' })
}

/**
 * 跳转至最近播放页
 */
function goToPlayHistory(): void {
  router.push({ name: 'play-history' })
}

/**
 * 跳转至剧种详情页
 * @param operaType - 剧种名称
 */
function goToOperaType(operaType: string): void {
  router.push({ name: 'opera-type', params: { operaType } })
}
</script>

<template>
  <div class="home-view">
    <van-nav-bar title="戏曲剧种与唱腔" fixed placeholder>
      <template #right>
        <div class="nav-actions">
          <div class="nav-action" role="button" aria-label="最近播放" @click="goToPlayHistory">
            <van-icon name="clock-o" class="nav-action-icon" />
            <span v-if="historyCount > 0" class="nav-action-badge">{{ historyCount }}</span>
          </div>
          <div class="nav-action" role="button" aria-label="我的收藏" @click="goToFavorite">
            <van-icon name="star-o" class="nav-action-icon" />
            <span v-if="favoriteCount > 0" class="nav-action-badge">{{ favoriteCount }}</span>
          </div>
        </div>
      </template>
    </van-nav-bar>

    <div class="search-bar">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索曲名或剧种"
        shape="round"
        clearable
        clear-trigger="always"
      />
    </div>

    <div v-if="hasSearchResult" class="group-list">
      <section
        v-for="group in filteredGroupedTracks"
        :key="group.operaType"
        class="opera-group"
      >
        <div class="group-header">
          <h2
            class="group-title"
            role="button"
            :aria-label="`查看${group.operaType}详情`"
            @click="goToOperaType(group.operaType)"
          >
            {{ group.operaType }}
            <van-icon name="arrow" class="title-arrow" />
          </h2>
          <p class="group-desc">{{ group.operaTypeDesc }}</p>
        </div>

        <van-cell-group inset>
          <van-cell
            v-for="track in group.tracks"
            :key="track.id"
            :title="track.title"
            :label="track.vocalStyle"
            is-link
            @click="goToPlay(track)"
          >
            <template #icon>
              <van-icon name="music-o" class="track-icon" />
            </template>
            <template #right-icon>
              <van-icon name="play-circle-o" class="play-icon" />
            </template>
          </van-cell>
        </van-cell-group>
      </section>
    </div>

    <div v-else-if="isSearching" class="empty-state">
      <van-icon name="search" class="empty-icon" />
      <p class="empty-text">未找到匹配的曲目或剧种</p>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  padding-bottom: 24px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-action {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.nav-action-icon {
  font-size: 20px;
  color: #646566;
}

.nav-action-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  background-color: #ee0a24;
  border-radius: 8px;
}

.search-bar {
  padding: 0 0 4px;
}

.group-list {
  padding-top: 4px;
}

.opera-group {
  margin-bottom: 16px;
}

.group-header {
  padding: 16px 16px 8px;
}

.group-title {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
  cursor: pointer;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.group-title:active {
  background-color: #f7f8fa;
}

.title-arrow {
  font-size: 14px;
  color: #969799;
}

.group-desc {
  font-size: 13px;
  color: #969799;
  line-height: 1.5;
}

.track-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #ee0a24;
}

.play-icon {
  font-size: 22px;
  color: #1989fa;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 16px 0;
}

.empty-icon {
  font-size: 64px;
  color: #dcdee0;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #969799;
}
</style>
