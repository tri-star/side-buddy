import { css } from "@emotion/react"

function Sidebar () {

  const containerStyle = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  })

  const conversationAreaStyle = css({
    flex: 1,
    height: '100%',
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

  return (
    <div css={containerStyle}>
      <p>質問：</p>
      <div css={conversationAreaStyle}></div>
      <div css={questionInputAreaStyle}>
        <div css={formRowStyle}>
          <p css={formLabelStyle}>Role</p>
          <select>
            <option>system</option>
            <option>assistant</option>
            <option>user</option>
          </select>
          <p css={formLabelStyle}>Temperature</p>
          <input type="number" css={temperatureInputStyle}></input>
        </div>
        <textarea css={textAreaStyle}></textarea>
        <button css={buttonStyle}>Submit</button>
      </div>
    </div>
  )
}

export default Sidebar
