<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useOperaStore } from '@/stores/opera'
import { useFavoriteStore } from '@/stores/favorite'

const route = useRoute()
const router = useRouter()
const operaStore = useOperaStore()
const favoriteStore = useFavoriteStore()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

const trackId = computed(() => route.params.id as string)

const track = computed(() => operaStore.getTrackById(trackId.value))

const isTrackFavorite = computed(() => favoriteStore.isFavorite(trackId.value))

/**
 * 返回列表页
 */
function goBack(): void {
  router.push({ name: 'home' })
}

/**
 * 切换收藏状态并弹出提示
 */
function handleToggleFavorite(): void {
  favoriteStore.toggleFavorite(trackId.value)
  showToast(favoriteStore.isFavorite(trackId.value) ? '已收藏' : '已取消收藏')
}

/**
 * 同步播放状态
 */
function handlePlay(): void {
  isPlaying.value = true
}

/**
 * 同步暂停状态
 */
function handlePause(): void {
  isPlaying.value = false
}

/**
 * 音频结束时重置状态
 */
function handleEnded(): void {
  isPlaying.value = false
}

onMounted(() => {
  const audio = audioRef.value
  if (!audio) return

  audio.addEventListener('play', handlePlay)
  audio.addEventListener('pause', handlePause)
  audio.addEventListener('ended', handleEnded)
})

onBeforeUnmount(() => {
  const audio = audioRef.value
  if (!audio) return

  audio.removeEventListener('play', handlePlay)
  audio.removeEventListener('pause', handlePause)
  audio.removeEventListener('ended', handleEnded)
})
</script>

<template>
  <div class="play-view">
    <van-nav-bar
      :title="track?.title ?? '曲目播放'"
      left-arrow
      fixed
      placeholder
      @click-left="goBack"
    />

    <template v-if="track">
      <div class="track-info">
        <div class="track-meta">
          <van-tag type="danger" size="medium">{{ track.operaType }}</van-tag>
          <h1 class="track-title">{{ track.title }}</h1>
        </div>

        <div class="play-status">
          <van-icon
            :name="isPlaying ? 'pause-circle' : 'play-circle'"
            class="status-icon"
            :class="{ playing: isPlaying }"
          />
          <span class="status-text">{{ isPlaying ? '正在播放' : '已暂停' }}</span>
          <van-icon
            :name="isTrackFavorite ? 'star' : 'star-o'"
            class="favorite-icon"
            :class="{ favorited: isTrackFavorite }"
            role="button"
            :aria-label="isTrackFavorite ? '取消收藏' : '加入收藏'"
            @click="handleToggleFavorite"
          />
        </div>

        <div class="audio-wrapper">
          <audio
            ref="audioRef"
            class="audio-player"
            :src="track.audioUrl"
            controls
            preload="metadata"
          >
            您的浏览器不支持 HTML5 音频播放。
          </audio>
        </div>

        <van-cell-group inset class="detail-section">
          <van-cell title="剧种简介" :label="track.operaTypeDesc" />
          <van-cell title="唱腔特点" :label="track.vocalStyle" />
        </van-cell-group>
      </div>
    </template>

    <van-empty v-else description="未找到该曲目" />
  </div>
</template>

<style scoped>
.play-view {
  min-height: 100vh;
}

.track-info {
  padding: 16px 0;
}

.track-meta {
  padding: 0 16px 16px;
}

.track-title {
  font-size: 22px;
  font-weight: 600;
  color: #323233;
  margin-top: 12px;
}

.play-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  margin: 0 16px 16px;
  background: #fff;
  border-radius: 8px;
}

.status-icon {
  font-size: 28px;
  color: #969799;
  transition: color 0.2s;
}

.status-icon.playing {
  color: #1989fa;
}

.status-text {
  font-size: 14px;
  color: #646566;
}

.favorite-icon {
  margin-left: auto;
  font-size: 24px;
  color: #dcdee0;
  transition: color 0.2s;
}

.favorite-icon.favorited {
  color: #ff976a;
}

.audio-wrapper {
  padding: 0 16px 16px;
}

.audio-player {
  width: 100%;
  border-radius: 8px;
}

.detail-section {
  margin-top: 8px;
}
</style>
