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

/**
 * 搜索状态数据结构
 */
export interface OperaSearchState {
  /** 搜索关键词 */
  keyword: string
  /** 是否处于搜索状态（关键词非空） */
  isSearching: boolean
  /** 是否有匹配的搜索结果 */
  hasResult: boolean
  /** 搜索过滤后的分组列表 */
  results: OperaGroup[]
}
