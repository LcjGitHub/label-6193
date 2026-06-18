<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOperaStore } from '@/stores/opera'
import type { OperaTrack } from '@/types/opera'

const route = useRoute()
const router = useRouter()
const operaStore = useOperaStore()

const operaType = computed(() => decodeURIComponent(route.params.operaType as string))

const operaGroup = computed(() => operaStore.getGroupByOperaType(operaType.value))

const trackCount = computed(() => operaGroup.value?.tracks.length ?? 0)

/**
 * 返回上一页
 */
function goBack(): void {
  router.push({ name: 'home' })
}

/**
 * 跳转至播放页
 * @param track - 目标曲目
 */
function goToPlay(track: OperaTrack): void {
  router.push({ name: 'play', params: { id: track.id } })
}
</script>

<template>
  <div class="opera-type-view">
    <van-nav-bar
      :title="operaGroup?.operaType ?? '剧种详情'"
      left-arrow
      fixed
      placeholder
      @click-left="goBack"
    />

    <template v-if="operaGroup">
      <div class="opera-header">
        <h1 class="opera-title">{{ operaGroup.operaType }}</h1>
        <p class="opera-desc">{{ operaGroup.operaTypeDesc }}</p>
        <div class="opera-stats">
          <van-tag type="primary" size="medium">
            代表剧目 {{ trackCount }} 部
          </van-tag>
        </div>
      </div>

      <div class="track-list">
        <h2 class="list-title">全部曲目</h2>
        <van-cell-group inset>
          <van-cell
            v-for="track in operaGroup.tracks"
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
      </div>
    </template>

    <van-empty v-else description="未找到该剧种信息" />
  </div>
</template>

<style scoped>
.opera-type-view {
  min-height: 100vh;
}

.opera-header {
  padding: 24px 16px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  margin-bottom: 16px;
}

.opera-title {
  font-size: 28px;
  font-weight: 700;
  color: #323233;
  margin-bottom: 12px;
}

.opera-desc {
  font-size: 15px;
  color: #646566;
  line-height: 1.7;
  margin-bottom: 16px;
}

.opera-stats {
  display: flex;
  align-items: center;
}

.track-list {
  padding-bottom: 24px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  padding: 0 16px 12px;
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
