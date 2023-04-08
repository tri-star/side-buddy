import { vsCodeApi } from '@/api/vs-code/vs-code-api'
import { type PanelMessage } from '@/domain/panel-message'

export const sendPanelMessage = (message: PanelMessage) => {
  vsCodeApi.postMessage(message)
}
