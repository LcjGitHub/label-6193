<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useOperaStore } from '@/stores/opera'
import type { OperaTrack } from '@/types/opera'

const router = useRouter()
const operaStore = useOperaStore()
const { filteredGroupedTracks, hasSearchResult, isSearching, searchKeyword } =
  storeToRefs(operaStore)

function goToPlay(track: OperaTrack): void {
  router.push({ name: 'play', params: { id: track.id } })
}

function onSearchInput(keyword: string): void {
  operaStore.setSearchKeyword(keyword)
}

function onSearchClear(): void {
  operaStore.setSearchKeyword('')
}
</script>

<template>
  <div class="home-view">
    <van-nav-bar title="戏曲剧种与唱腔" fixed placeholder />

    <div class="search-bar">
      <van-search
        :model-value="searchKeyword"
        placeholder="搜索曲名或剧种"
        shape="round"
        @update:model-value="onSearchInput"
        @clear="onSearchClear"
      />
    </div>

    <div v-if="hasSearchResult" class="group-list">
      <section
        v-for="group in filteredGroupedTracks"
        :key="group.operaType"
        class="opera-group"
      >
        <div class="group-header">
          <h2 class="group-title">{{ group.operaType }}</h2>
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
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
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
