import { css } from '@emotion/react'
import { useEffect } from 'react'
import { useSidebar } from './use-sidebar'
import { Spinner } from '@/components/Spinner'
import { ApiKeyForm } from './ApiKeyForm'
import { faSave, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { IconButton } from '@/components/IconButton'
import { MessageList } from './MessageList'
import { MessageForm } from './MessageForm'

function Sidebar() {
  const {
    init,
    handleThreadTitleChange,
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

  if (state.config === undefined) {
    return (
      <div
        css={{
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </div>
    )
  }
  if (state.config?.apiKey === '') {
    return <ApiKeyForm />
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
            },
          }}
          placeholder="タイトル(省略した場合は自動入力されます)"
          value={state.thread.title}
          onChange={(e) => {
            handleThreadTitleChange(e.target.value)
          }}
        />
        <IconButton icon={faSave} onClick={handleSaveThread} title="save" />
        <IconButton
          icon={faTrashCan}
          onClick={handleClearThread}
          title="clear"
        />
      </div>
      <MessageList />
      <MessageForm />
    </div>
  )
}

export default Sidebar
