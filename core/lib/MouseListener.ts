import IMouseResult from '@unblocked-web/specifications/agent/interact/IMouseResult';
import { INodeVisibility } from '@unblocked-web/js-path';
import IWindowOffset from '@unblocked-web/specifications/agent/browser/IWindowOffset';
import Frame from './Frame';
import InjectedScripts from './InjectedScripts';

export default class MouseListener {
  private readonly frame: Frame;
  private readonly nodeId: number;

  constructor(frame: Frame, nodeId: number) {
    this.frame = frame;
    this.nodeId = nodeId;
  }

  public async register(): Promise<INodeVisibility> {
    const containerOffset = await this.frame.getContainerOffset();
    return this.frame.evaluate(
      `${InjectedScripts.MouseEvents}.listenFor(${this.nodeId}, ${JSON.stringify(
        containerOffset,
      )})`,
      this.frame.page.installJsPathIntoIsolatedContext,
    );
  }

  public async didTriggerMouseEvent(): Promise<IMouseResult> {
    return await this.frame.evaluate<IMouseResult>(
      `${InjectedScripts.MouseEvents}.didTrigger(${this.nodeId})`,
      this.frame.page.installJsPathIntoIsolatedContext,
    );
  }

  public static async waitForScrollStop(
    frame: Frame,
    timeoutMs?: number,
  ): Promise<[scrollX: number, scrollY: number]> {
    return await frame.evaluate(
      `${InjectedScripts.MouseEvents}.waitForScrollStop(${timeoutMs ?? 2e3})`,
      frame.page.installJsPathIntoIsolatedContext,
    );
  }

  public static async getWindowOffset(frame: Frame): Promise<IWindowOffset> {
    return await frame.evaluate(
      `${InjectedScripts.MouseEvents}.getWindowOffset()`,
      frame.page.installJsPathIntoIsolatedContext,
    );
  }
}
