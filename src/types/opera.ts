/**
 * 戏曲曲目数据结构
 */
export interface OperaTrack {
  /** 曲目唯一标识 */
  id: string
  /** 曲目标题 */
  title: string
  /** 剧种名称 */
  operaType: string
  /** 剧种简介 */
  operaTypeDesc: string
  /** 唱腔特点文案 */
  vocalStyle: string
  /** 音频地址（可为占位 mp3） */
  audioUrl: string
}

/**
 * 按剧种分组的曲目列表
 */
export interface OperaGroup {
  /** 剧种名称 */
  operaType: string
  /** 剧种简介 */
  operaTypeDesc: string
  /** 该剧种下的曲目 */
  tracks: OperaTrack[]
}
