import { css } from "@emotion/react"
import { useAutoScroll } from "./use-auto-scroll"
import { useRef } from "react"
import { useSidebar } from "./use-sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

export function MessageList() {

  const {
    state,
    completion,
    handleRemoveMessage,
  } = useSidebar()

  const conversationAreaRef = useRef<HTMLDivElement>(null)
  const completionAreaRef = useRef<HTMLDivElement>(null)
  useAutoScroll(conversationAreaRef, completionAreaRef)

  const conversationAreaStyle = css({
    flex: 1,
    height: '100%',
    maxHeight: '100vh - 300px',
    overflow: 'auto',
  })

  const removeIconContainerStyle = {
    position: 'relative',
    display: 'block',
    '&:hover .remove': {
      opacity: 1,
    }
  } as const

  const threadMessageStyle = {
    system: css([{
      backgroundColor: '#ccc',
      padding: '10px',
      borderRadius: '5px',
      whiteSpace: 'pre-wrap',
    }, removeIconContainerStyle]),
    assistant: css([{
      backgroundColor: 'var(--app-message-assistant-background)',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '20px',
      marginRight: '20px',
      marginLeft: '5px',
      whiteSpace: 'pre-wrap',
    }, removeIconContainerStyle]),
    user: css([{
      backgroundColor: 'var(--app-message-user-background)',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '20px',
      marginLeft: '20px',
      marginRight: '5px',
      whiteSpace: 'pre-wrap',
    }, removeIconContainerStyle])
  }

  const removeIconStyle = css({
    opacity: 0,
    position: 'absolute',
    top: '-13px',
    right: '-3px',
    cursor: 'pointer',
    color: '#f55',
    transition: 'all 0.3s ease',
  })

  return (<div css={conversationAreaStyle} ref={conversationAreaRef}>
    {state.thread.messages.map(message => {
      return (
        <div key={message.id} css={threadMessageStyle[message.role]}>
          <div className="remove" css={removeIconStyle} onClick={() => {handleRemoveMessage(message.id)}}>
            <FontAwesomeIcon icon={faTimes} size="2x" />
          </div>
          <p>{message.message}</p>
        </div>
      )
    })
    }
    <div css={threadMessageStyle.assistant} ref={completionAreaRef} hidden={(completion === '')}>
      {completion}
    </div>

  </div>
  )
}
