import { IconButton } from '@/components/IconButton'
import { ExtensionBridgeContext } from '@/providers/ExtensionBridgeStubProvider'
import { css } from '@emotion/react'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'

export function ThreadListHeader() {
  const { extensionBridge } = useContext(ExtensionBridgeContext)

  const handleExport = () => {
    extensionBridge?.sendPanelMessage({
      type: 'export-thread-list',
      source: 'side-buddy-panel',
    })
  }

  const headerStyle = css({
    display: 'flex',
    justifyContent: 'end',
  })

  return (
    <div css={headerStyle}>
      <IconButton
        title="export"
        icon={faFileArrowDown}
        onClick={handleExport}
      />
    </div>
  )
}
