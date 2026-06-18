<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favorite'
import type { OperaTrack } from '@/types/opera'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const { favoriteTracks, favoriteCount } = storeToRefs(favoriteStore)

function goToPlay(track: OperaTrack): void {
  router.push({ name: 'play', params: { id: track.id } })
}

function goBack(): void {
  router.push({ name: 'home' })
}

function handleRemoveFavorite(trackId: string, event: Event): void {
  event.stopPropagation()
  favoriteStore.removeFavorite(trackId)
}
</script>

<template>
  <div class="favorite-view">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      fixed
      placeholder
      @click-left="goBack"
    >
      <template #right>
        <span class="nav-count">{{ favoriteCount }}</span>
      </template>
    </van-nav-bar>

    <div v-if="favoriteTracks.length > 0" class="track-list">
      <van-cell-group inset>
        <van-cell
          v-for="track in favoriteTracks"
          :key="track.id"
          :title="track.title"
          :label="track.vocalStyle"
          is-link
          @click="goToPlay(track)"
        >
          <template #icon>
            <van-icon name="star" class="track-icon" />
          </template>
          <template #right-icon>
            <van-icon
              name="star"
              class="remove-icon"
              @click="handleRemoveFavorite(track.id, $event)"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-empty
      v-else
      description="暂无收藏曲目"
      image="default"
    />
  </div>
</template>

<style scoped>
.favorite-view {
  min-height: 100vh;
}

.nav-count {
  font-size: 14px;
  color: #969799;
}

.track-list {
  padding-top: 12px;
}

.track-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #ff976a;
}

.remove-icon {
  font-size: 20px;
  color: #ee0a24;
  padding: 8px;
}
</style>
