import { css } from "@emotion/react"
import { useEffect } from "react"
import { useSidebar } from "./use-sidebar"
import { type ChatRole } from "@/domain/chat"

function Sidebar () {

  const {
    init,
    temperature, setTemperature,
    role, setRole,
    message, setMessage,
    completion,
    thread,
    canSubmit,
    submit,
  } = useSidebar()

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
    resize: 'vertical'
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
  })

  const threadMessageStyle = {
    system: css({
      backgroundColor: '#ccc',
      padding: '10px',
      borderRadius: '5px',
      whiteSpace: 'pre-wrap',
    }),
    assistant: css({
      backgroundColor: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '20px',
      marginRight: '20px',
      marginLeft: '5px',
      whiteSpace: 'pre-wrap',
    }),
    user: css({
      backgroundColor: '#e0e0e0',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '20px',
      marginLeft: '20px',
      marginRight: '5px',
      whiteSpace: 'pre-wrap',
    })
  }


  return (
    <div css={containerStyle}>
      <p>質問：</p>
      <div css={conversationAreaStyle}>

        {thread.messages.map(message => {
          return (
            <div key={message.id} css={threadMessageStyle[message.role]}>
              <p>{message.message}</p>
            </div>
          )
        })
        }

        {completion}
      </div>
      <div css={questionInputAreaStyle}>
        <div css={formRowStyle}>
          <p css={formLabelStyle}>Role</p>
          <select value={role} onChange={ e => { setRole(e.target.value as ChatRole) } }>
            <option>system</option>
            <option>assistant</option>
            <option>user</option>
          </select>
          <p css={formLabelStyle}>Temperature</p>
          <input
            type="number"
            css={temperatureInputStyle}
            value={temperature}
            onChange={e => { setTemperature(parseFloat(e.target.value)); } }
            step={0.1}
            max={1}
          />
        </div>
        <textarea css={textAreaStyle} onChange={e => { setMessage(e.target.value); }} value={message}></textarea>
        <button css={buttonStyle} disabled={!canSubmit()} onClick={() => {void submit()}}>Submit</button>
      </div>
    </div>
  )
}

export default Sidebar
