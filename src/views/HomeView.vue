<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useOperaStore } from '@/stores/opera'
import { useFavoriteStore } from '@/stores/favorite'
import type { OperaTrack } from '@/types/opera'

const router = useRouter()
const operaStore = useOperaStore()
const favoriteStore = useFavoriteStore()
const { filteredGroupedTracks, hasSearchResult, isSearching, searchKeyword } =
  storeToRefs(operaStore)
const { favoriteCount } = storeToRefs(favoriteStore)

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
        <div class="nav-favorite" role="button" aria-label="我的收藏" @click="goToFavorite">
          <van-icon name="star-o" class="nav-favorite-icon" />
          <span v-if="favoriteCount > 0" class="nav-favorite-badge">{{ favoriteCount }}</span>
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
        <div
          class="group-header"
          role="button"
          aria-label="查看剧种详情"
          @click="goToOperaType(group.operaType)"
        >
          <h2 class="group-title">
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

.nav-favorite {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.nav-favorite-icon {
  font-size: 20px;
  color: #646566;
}

.nav-favorite-badge {
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
  cursor: pointer;
  transition: background-color 0.2s;
}

.group-header:active {
  background-color: #f7f8fa;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
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
