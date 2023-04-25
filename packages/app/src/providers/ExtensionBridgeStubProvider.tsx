import {
  ExtensionBridge,
  type ExtensionBridgeInterface,
} from '@/api/vs-code/extension-bridge'
import { ExtensionBridgeStub } from '@/api/vs-code/extension-bridge-stub'
import { type ExtensionStubInterface } from '@/api/vs-code/extension-stub/extension-stub'
import { isVsCodeEnv } from '@/api/vs-code/vs-code-api'
import { type PropsWithChildren, createContext, useState } from 'react'

export const ExtensionBridgeContext = createContext<{
  extensionBridge?: ExtensionBridgeInterface
}>({})

export function createExtensionBridge(
  extensionStub: ExtensionStubInterface | undefined
): ExtensionBridgeInterface {
  if (isVsCodeEnv()) {
    return new ExtensionBridge()
  }
  if (extensionStub === undefined) {
    throw new Error('extensionStub is undefined')
  }
  return new ExtensionBridgeStub(extensionStub)
}

type Props = {
  extensionStubImpl?: ExtensionStubInterface
}

export function ExtensionBridgeProvider({
  extensionStubImpl,
  children,
}: Props & PropsWithChildren) {
  const [extensionStub] = useState<ExtensionStubInterface | undefined>(
    extensionStubImpl
  )
  const [extensionBridge] = useState<ExtensionBridgeInterface | undefined>(
    createExtensionBridge(extensionStub)
  )

  return (
    <ExtensionBridgeContext.Provider value={{ extensionBridge }}>
      {children}
    </ExtensionBridgeContext.Provider>
  )
}
