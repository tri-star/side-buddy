import { css } from "@emotion/react"
import { useAutoScroll } from "./use-auto-scroll"
import { useRef } from "react"
import { useSidebar } from "./use-sidebar"

type Props = {
  completion: string
}

export function MessageList(props: Props) {

  const {
    state,
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

  return (<div css={conversationAreaStyle} ref={conversationAreaRef}>
    {state.thread.messages.map(message => {
      return (
        <div key={message.id} css={threadMessageStyle[message.role]}>
          <p>{message.message}</p>
        </div>
      )
    })
    }
    <div css={threadMessageStyle.assistant} ref={completionAreaRef} hidden={(props.completion === '')}>
      {props.completion}
    </div>

  </div>
)
}
