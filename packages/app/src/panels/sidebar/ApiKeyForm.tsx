import { ExtensionBridgeContext } from '@/providers/ExtensionBridgeStubProvider'
import { css } from '@emotion/react'
import { useContext, useState } from 'react'

export function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('')
  const { extensionBridge } = useContext(ExtensionBridgeContext)

  const containerStyle = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
  })

  const inputStyle = css({
    padding: '5px',
    width: '200px',
  })

  const buttonStyle = css({
    padding: '5px 20px',
  })

  const canSubmit = () => apiKey !== ''

  const submit = () => {
    extensionBridge?.sendPanelMessage({
      type: 'set-api-key',
      source: 'side-buddy-panel',
      apiKey,
    })
  }

  return (
    <div css={containerStyle}>
      <p>APIキーを設定してください。</p>

      <div>
        <input
          type="password"
          css={inputStyle}
          placeholder="sk-***"
          onChange={(e) => {
            setApiKey(e.target.value)
          }}
        />
      </div>

      <div>
        <button css={buttonStyle} disabled={!canSubmit()} onClick={submit}>
          設定
        </button>
      </div>
    </div>
  )
}
