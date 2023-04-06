export type VsCodeApi = {
  postMessage: <T>(message: T) => void

  getState: <T>() => T | undefined
}

declare const acquireVsCodeApi: () => VsCodeApi

export const isVsCodeEnv = (): boolean => {
  return typeof acquireVsCodeApi !== 'undefined'
}

export const vsCodeApi = isVsCodeEnv()
  ? acquireVsCodeApi()
  : acquireVsCodeApiStub()

function acquireVsCodeApiStub(): VsCodeApi {
  return {
    postMessage: () => {},
    getState: () => undefined,
  }
}
