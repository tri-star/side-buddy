import { css } from "@emotion/react"
import { useEffect } from "react"
import { useSidebar } from "./use-sidebar"
import { type ChatRole } from "@/domain/chat"
import { Spinner } from "@/components/Spinner"
import { ApiKeyForm } from "./ApiKeyForm"
import { faSave, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconButton } from "@/components/IconButton"
import { MessageList } from "./MessageList"

function Sidebar () {

  const {
    init,
    handleThreadTitleChange,
    handleTemperatureChange,
    handleRoleChange,
    handleMessageChange,
    completion,
    canSubmit,
    submit,
    handleKeyDown,
    handleClearThread,
    handleSaveThread,
    state,
  } = useSidebar()

  useEffect(() => {
     init()
  }, [init])

  const containerStyle = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  })

  const headerStyle = css({
    display: 'flex',
  })

  const questionInputAreaStyle = css({
    display: "flex",
    flexDirection: "column",
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
    }
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
  const formLabelStyle = css({

  })
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

  if(state.config === undefined) {
    return (
      <div css={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Spinner />
      </div>
    )
  }
  if(state.config?.apiKey === '') {
    return (<ApiKeyForm />)
  }

  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <input
          css={{
            width: '100%',
            padding: '5px',
            background: 'var(--app-input-background)',
            border: '1px solid var(--app-editor-border)',
            color: 'var(--app-editor-foreground)',
            '&:focus': {
              outline: '1px solid var(--app-editor-focus-outline)',
            }
          }}
          placeholder="タイトル(省略した場合は自動入力されます)"
          value={state.thread.title}
          onChange={e => { handleThreadTitleChange(e.target.value); }}
        />
        <IconButton icon={faSave} onClick={handleSaveThread}/>
        <IconButton icon={faTrashCan} onClick={handleClearThread}/>
      </div>
      <MessageList completion={completion}/>
      <div css={questionInputAreaStyle}>
        <div css={formRowStyle}>
          <p css={formLabelStyle}>Role</p>
          <select value={state.role} onChange={ e => { handleRoleChange(e.target.value as ChatRole) } }>
            <option>system</option>
            <option>assistant</option>
            <option>user</option>
          </select>
          <p css={formLabelStyle}>Temperature</p>
          <input
            type="number"
            css={temperatureInputStyle}
            value={state.temperature}
            onChange={e => { handleTemperatureChange(parseFloat(e.target.value)); } }
            step={0.1}
            max={1}
          />
        </div>
        <textarea
          css={textAreaStyle}
          onChange={e => { handleMessageChange(e.target.value); }}
          value={state.message}
          onKeyDown={e => { handleKeyDown(e); }}
        />
        <button css={submitButtonStyle} disabled={!canSubmit()} onClick={() => {void submit()}}>Submit</button>
      </div>
    </div>
  )
}

export default Sidebar
