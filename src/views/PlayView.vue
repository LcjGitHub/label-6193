<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useOperaStore } from '@/stores/opera'
import { useFavoriteStore } from '@/stores/favorite'
import { usePlayHistoryStore } from '@/stores/playHistory'

const route = useRoute()
const router = useRouter()
const operaStore = useOperaStore()
const favoriteStore = useFavoriteStore()
const playHistoryStore = usePlayHistoryStore()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)

const trackId = computed(() => route.params.id as string)

const track = computed(() => operaStore.getTrackById(trackId.value))

const isTrackFavorite = computed(() => favoriteStore.isFavorite(trackId.value))

const prevTrack = computed(() => operaStore.getPrevTrackInSameOperaType(trackId.value))

const nextTrack = computed(() => operaStore.getNextTrackInSameOperaType(trackId.value))

const hasPrev = computed(() => prevTrack.value !== undefined)

const hasNext = computed(() => nextTrack.value !== undefined)

const prevAriaLabel = computed(() =>
  hasPrev.value && prevTrack.value
    ? `播放上一曲，${prevTrack.value.title}`
    : '已是第一首，无法上一曲',
)

const nextAriaLabel = computed(() =>
  hasNext.value && nextTrack.value
    ? `播放下一曲，${nextTrack.value.title}`
    : '已是最后一首，无法下一曲',
)

/**
 * 返回上一页
 */
function goBack(): void {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'home' })
  }
}

/**
 * 切换收藏状态并弹出提示
 */
function handleToggleFavorite(): void {
  favoriteStore.toggleFavorite(trackId.value)
  showToast(favoriteStore.isFavorite(trackId.value) ? '已收藏' : '已取消收藏')
}

/**
 * 切换到上一曲
 */
function handlePrev(): void {
  if (!hasPrev.value || !prevTrack.value) return
  router.push({ name: 'play', params: { id: prevTrack.value.id } })
}

/**
 * 切换到下一曲
 */
function handleNext(): void {
  if (!hasNext.value || !nextTrack.value) return
  router.push({ name: 'play', params: { id: nextTrack.value.id } })
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
  playHistoryStore.addPlayRecord(trackId.value)

  const audio = audioRef.value
  if (!audio) return

  audio.addEventListener('play', handlePlay)
  audio.addEventListener('pause', handlePause)
  audio.addEventListener('ended', handleEnded)
})

watch(
  trackId,
  (newTrackId) => {
    playHistoryStore.addPlayRecord(newTrackId)
    isPlaying.value = false
    if (audioRef.value) {
      audioRef.value.load()
    }
  },
)



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

        <div class="track-controls">
          <button
            class="control-btn prev-btn"
            :disabled="!hasPrev"
            :class="{ disabled: !hasPrev }"
            :aria-label="prevAriaLabel"
            @click="handlePrev"
          >
            <van-icon name="arrow-left" class="control-icon" />
            <span class="control-label">上一曲</span>
            <span v-if="prevTrack" class="control-track-name">{{ prevTrack.title }}</span>
          </button>
          <button
            class="control-btn next-btn"
            :disabled="!hasNext"
            :class="{ disabled: !hasNext }"
            :aria-label="nextAriaLabel"
            @click="handleNext"
          >
            <van-icon name="arrow" class="control-icon" />
            <span class="control-label">下一曲</span>
            <span v-if="nextTrack" class="control-track-name">{{ nextTrack.title }}</span>
          </button>
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

.track-controls {
  display: flex;
  gap: 12px;
  padding: 0 16px 16px;
}

.control-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: #fff;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:not(.disabled):hover {
  background: #f7f8fa;
  border-color: #1989fa;
}

.control-btn:not(.disabled):active {
  background: #e8f2ff;
}

.control-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.prev-btn {
  text-align: left;
  align-items: flex-start;
}

.next-btn {
  text-align: right;
  align-items: flex-end;
}

.control-icon {
  font-size: 20px;
  color: #1989fa;
}

.control-btn.disabled .control-icon {
  color: #969799;
}

.control-label {
  font-size: 14px;
  font-weight: 500;
  color: #323233;
}

.control-btn.disabled .control-label {
  color: #969799;
}

.control-track-name {
  font-size: 12px;
  color: #969799;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
