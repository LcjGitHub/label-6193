<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useOperaStore } from '@/stores/opera'
import type { OperaTrack } from '@/types/opera'

const router = useRouter()
const operaStore = useOperaStore()
const { groupedTracks } = storeToRefs(operaStore)

/**
 * 跳转至播放页
 * @param track - 目标曲目
 */
function goToPlay(track: OperaTrack): void {
  router.push({ name: 'play', params: { id: track.id } })
}
</script>

<template>
  <div class="home-view">
    <van-nav-bar title="戏曲剧种与唱腔" fixed placeholder />

    <div class="group-list">
      <section v-for="group in groupedTracks" :key="group.operaType" class="opera-group">
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
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  padding-bottom: 24px;
}

.group-list {
  padding-top: 8px;
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
</style>
