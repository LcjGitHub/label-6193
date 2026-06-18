<script setup lang="ts">
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useFavoriteStore } from '@/stores/favorite'
import type { OperaTrack } from '@/types/opera'

const router = useRouter()
const favoriteStore = useFavoriteStore()
const { favoriteTracks, favoriteCount } = storeToRefs(favoriteStore)

/**
 * 跳转至播放页
 * @param track - 目标曲目
 */
function goToPlay(track: OperaTrack): void {
  router.push({ name: 'play', params: { id: track.id } })
}

/**
 * 返回首页
 */
function goBack(): void {
  router.push({ name: 'home' })
}

/**
 * 取消收藏并弹出提示
 * @param trackId - 要取消收藏的曲目 ID
 * @param event - 点击事件对象，用于阻止冒泡
 */
function handleRemoveFavorite(trackId: string, event: Event): void {
  event.stopPropagation()
  favoriteStore.removeFavorite(trackId)
  showToast('已取消收藏')
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
        <span class="nav-count-label">{{ favoriteCount }} 首</span>
      </template>
    </van-nav-bar>

    <div v-if="favoriteTracks.length > 0" class="track-list">
      <van-cell-group inset>
        <van-cell
          v-for="track in favoriteTracks"
          :key="track.id"
          :title="track.title"
          :label="track.vocalStyle"
          @click="goToPlay(track)"
        >
          <template #icon>
            <van-icon name="star" class="track-icon" />
          </template>
          <template #right-icon>
            <van-icon
              name="delete-o"
              class="remove-icon"
              aria-label="取消收藏"
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

.nav-count-label {
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
  color: #969799;
  padding: 8px;
}
</style>
