import { css } from "@emotion/react"
import { useEffect, useRef } from "react"
import { useSidebar } from "./use-sidebar"
import { type ChatRole } from "@/domain/chat"
import { useAutoScroll } from "./use-auto-scroll"
import { Spinner } from "@/components/Spinner"
import { ApiKeyForm } from "./ApiKeyForm"

function Sidebar () {

  const {
    init,
    handleTemperatureChange,
    handleRoleChange,
    handleMessageChange,
    completion,
    canSubmit,
    submit,
    handleKeyDown,
    state,
  } = useSidebar()

  const conversationAreaRef = useRef<HTMLDivElement>(null)
  const completionAreaRef = useRef<HTMLDivElement>(null)
  useAutoScroll(conversationAreaRef, completionAreaRef)

  useEffect(() => {
     init()
  }, [])

  const containerStyle = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  })

  const conversationAreaStyle = css({
    flex: 1,
    height: '100%',
    maxHeight: '100vh - 300px',
    overflow: 'auto',
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

  const buttonStyle = css({
    width: '100%',
    padding: '10px 5px',
    color: 'var(--app-button-foreground)',
    backgroundColor: 'var(--app-button-background)',
    border: '1px solid var(--app-button-border)',
    '&:hover': {
      backgroundColor: 'var(--app-button-hoverBackground)',
    },
    '&:disabled': {
      color: 'var(--app-button-disabledForeground)',
      backgroundColor: 'var(--app-button-disabledBackground)',
    },

  })

  const threadMessageStyle = {
    system: css({
      backgroundColor: '#ccc',
      padding: '10px',
      borderRadius: '5px',
      whiteSpace: 'pre-wrap',
    }),
    assistant: css({
      backgroundColor: 'var(--app-message-assistant-background)',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '20px',
      marginRight: '20px',
      marginLeft: '5px',
      whiteSpace: 'pre-wrap',
    }),
    user: css({
      backgroundColor: 'var(--app-message-user-background)',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '20px',
      marginLeft: '20px',
      marginRight: '5px',
      whiteSpace: 'pre-wrap',
    })
  }

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
      <div css={conversationAreaStyle} ref={conversationAreaRef}>

        {state.thread.messages.map(message => {
          return (
            <div key={message.id} css={threadMessageStyle[message.role]}>
              <p>{message.message}</p>
            </div>
          )
        })
        }

        <div css={threadMessageStyle.assistant} ref={completionAreaRef} hidden={(completion === '')}>
          {completion}
        </div>

      </div>
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
        <button css={buttonStyle} disabled={!canSubmit()} onClick={() => {void submit()}}>Submit</button>
      </div>
    </div>
  )
}

export default Sidebar
