import { type AppState } from '@/domain/app-state'
import { createNewThread } from '@/domain/thread'
import { ExtensionBridgeContext } from '@/providers/ExtensionBridgeStubProvider'
import {
  type SetStateAction,
  type Dispatch,
  type PropsWithChildren,
  createContext,
  useState,
  useCallback,
  useContext,
} from 'react'

type UpdateStateCallback = (prevState: AppState) => Partial<AppState>

type SidebarStateContextType = {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  completion: string
  setCompletion: Dispatch<SetStateAction<string>>
  updateState: (newState: Partial<AppState> | UpdateStateCallback) => void
}

export const SidebarStateContext = createContext<SidebarStateContextType>({
  state: {
    role: 'user',
    temperature: 0.0,
    message: '',
    thread: createNewThread(),
  },
  setState: () => {},
  completion: '',
  setCompletion: () => {},
  updateState: () => {},
})

export const SidebarStateProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<AppState>({
    role: 'user',
    temperature: 0.0,
    message: '',
    thread: createNewThread(),
  })
  const { extensionBridge } = useContext(ExtensionBridgeContext)

  const [completion, setCompletion] = useState('')

  /**
   * ReactのuseStateとVSCodeのstateの両方を更新する
   */
  const updateState = useCallback(
    (newState: Partial<AppState> | UpdateStateCallback) => {
      // newStateがコールバック関数の場合
      if (newState instanceof Function) {
        setState((prev) => {
          extensionBridge?.setState<AppState>({
            ...prev,
            ...newState,
          })

          const newPartialState = newState(prev)
          return {
            ...prev,
            ...newPartialState,
          }
        })
      }

      // newStateが更新する値を含んだオブジェクトの場合
      setState((prev) => {
        extensionBridge?.setState<AppState>({
          ...prev,
          ...newState,
        })

        return {
          ...prev,
          ...newState,
        }
      })
    },
    [extensionBridge]
  )

  return (
    <SidebarStateContext.Provider
      value={{
        state,
        setState,
        completion,
        setCompletion,
        updateState,
      }}
    >
      {children}
    </SidebarStateContext.Provider>
  )
}
