import { vsCodeApi } from "@/api/vs-code/vs-code-api"
import { type PanelMessage } from "@/domain/panel-message"
import { css } from "@emotion/react"
import { useState } from "react"

export function ApiKeyForm() {

  const [apiKey, setApiKey] = useState('')

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
    padding: '5px 20px'
  })

  const canSubmit = () => {
    return apiKey !== ''
  }

  const submit = () => {
    vsCodeApi.postMessage<PanelMessage>({
      type: 'set-api-key',
      apiKey
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
          onChange={(e) => { setApiKey(e.target.value); }}
        />
      </div>

      <div>
        <button
          css={buttonStyle}
          disabled={!canSubmit()}
          onClick={submit}>
            設定
        </button>
      </div>
    </div>
  )
}
