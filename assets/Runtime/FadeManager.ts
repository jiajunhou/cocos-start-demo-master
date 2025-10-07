import { UIRenderer, director, game } from "cc";
import Single from "../Base/Single";
import { DEFAULT_DURATION, DrawManager } from "../Scripts/UI/DrawManager";
import { createUINode } from "../Scripts/Untils";

export default class FadeManager extends Single {
  static get Instance() {
    return super.GetInstance<FadeManager>();
  }

  private _fader: DrawManager = null;

  get fader() {
    if (this._fader !== null) {
      return this._fader;
    }

    // 创建根节点
    const root = createUINode();
    // 添加 UIRenderer 组件而不是 RenderRoot2D
    const uiRenderer = root.addComponent(UIRenderer);

    // 创建渐变节点
    const fader = createUINode();
    fader.setParent(root);
    this._fader = fader.addComponent(DrawManager);
    this._fader.init();

    // 设置为持久根节点
    director.addPersistRootNode(root);

    return this._fader;
  }

  fadeIn(duration = DEFAULT_DURATION) {
    return this.fader.fadeIn(duration);
  }

  fadeOut(duration = DEFAULT_DURATION) {
    return this.fader.fadeOut(duration);
  }
}
