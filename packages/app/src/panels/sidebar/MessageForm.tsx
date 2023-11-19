import { css } from '@emotion/react'
import { useSidebar } from './use-sidebar'
import { type ChatModel, chatModels } from '@/domain/chat'

export function MessageForm() {
  const {
    state,
    handleModelChange,
    handleTemperatureChange,
    handleMessageChange,
    handleKeyDown,
    canSubmit,
    submit,
  } = useSidebar()

  const questionInputAreaStyle = css({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '30%',
  })

  const textAreaStyle = css({
    width: '100%',
    height: '100%',
    minHeight: '100px',
    resize: 'none',
    background: 'var(--app-input-background)',
    boxSizing: 'border-box',
    border: '1px solid var(--app-editor-border)',
    color: 'var(--app-editor-foreground)',
    '&:focus': {
      outline: '1px solid var(--app-editor-focus-outline)',
    },
  })

  const formRowStyle = css({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: '5px 0',
    justifyContent: 'start',
    alignItems: 'center',
    gap: '10px',
  })
  const formLabelStyle = css({})
  const temperatureInputStyle = css({
    width: '50px',
  })

  const submitButtonStyle = css({
    width: '100%',
    padding: '10px 5px',
    color: 'var(--app-button-foreground)',
    backgroundColor: 'var(--app-button-background)',
    border: '1px solid var(--app-button-border)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--app-button-hoverBackground)',
    },
    '&:disabled': {
      color: 'var(--app-button-disabledForeground)',
      backgroundColor: 'var(--app-button-disabledBackground)',
      cursor: 'initial',
    },
  })

  return (
    <div css={questionInputAreaStyle}>
      <div css={formRowStyle}>
        <p css={formLabelStyle}>Model</p>
        <select
          value={state.model}
          onChange={(e) => {
            handleModelChange(e.target.value as ChatModel)
          }}
        >
          {chatModels.map((model) => (
            <option value={model} key={model} selected={model === state.model}>
              {model}
            </option>
          ))}
        </select>
        <p css={formLabelStyle}>Temperature</p>
        <input
          type="number"
          css={temperatureInputStyle}
          value={state.temperature}
          onChange={(e) => {
            handleTemperatureChange(parseFloat(e.target.value))
          }}
          step={0.1}
          max={2}
        />
      </div>
      <textarea
        css={textAreaStyle}
        onChange={(e) => {
          handleMessageChange(e.target.value)
        }}
        value={state.message}
        onKeyDown={(e) => {
          handleKeyDown(e)
        }}
      />
      <button
        css={submitButtonStyle}
        disabled={!canSubmit()}
        onClick={() => {
          void submit()
        }}
      >
        Submit(Ctrl / Shift / Command + Enter)
      </button>
    </div>
  )
}
