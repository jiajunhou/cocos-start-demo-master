
import Single from '../Base/Single'
import { ITile } from '../levels'
import { PlayerManager } from '../Player/PlayerManager'
import { TileManager } from '../Scripts/Tile/TileManager'
import levels from '../levels'
import { WoodenSkeletonManager } from '../WoodenSkeleton/WoodenSkeletonManager'



/**
 * 全局数据管理类
 */
export default class DataManager extends Single {
  static get Instance() {
    return super.GetInstance<DataManager>()
  }

  player: PlayerManager
  mapRowCount: number
  mapColumnCount: number
  levelIndex: number = 1
  mapInfo: Array<Array<ITile>> = []
  tileInfo: Array<Array<TileManager>> = []
  enemies:WoodenSkeletonManager[]


  private constructor() {
    super()
    this.reset()
  }

  reset() {
    //地图信息
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.enemies = []
    // //活动元素信息
    this.player = null
  }

  // 初始化关卡数据
  initLevel(levelIndex: number = 1) {
    const levelKey = `level${levelIndex}`
    const level = levels[levelKey]

    if (level) {
      this.mapInfo = level.mapInfo
      this.mapRowCount = level.mapInfo.length
      this.mapColumnCount = level.mapInfo[0]?.length || 0
      this.levelIndex = levelIndex

    } else {
      console.error(`Level ${levelIndex} not found!`)
    }
  }
}
