import { listenExtensionMessage } from "@/api/vs-code/listen-extension-message";
import { sendPanelMessage } from "@/api/vs-code/send-panel-message";
import { type ExtensionMessage } from "@/domain/extension-message";
import { type Thread } from "@/domain/thread";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactElement, useEffect, useState } from "react";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export function ThreadList(): ReactElement {

  const [threads, setThreads] = useState<Thread[]>([])

  useEffect(() => {
    listenExtensionMessage((message: ExtensionMessage) => {
      switch(message.type) {
        case "update-thread-list":
          setThreads(message.threads)
          break
      }
    })
    sendPanelMessage({
      type: "loaded",
      source: "side-buddy-panel"
    })
  }, [])

  const lineStyle = css({
    display: 'flex',
    cursor: 'pointer',
    justifyContent: 'start',
    alignItems: 'center',
    padding: '5px 2px',
    gap: '5px,',
    width: '100%',
    color: 'var(--app-editor-foreground)',
    '& > svg': {
      marginLeft: '5px',
    },
    '& > p': {
      flexGrow: 1,
      overflow: 'hidden',
      textOverflow: 'elipsis',
      whiteSpace: 'nowrap',
      marginLeft: '5px',
      width: '100%',
    },
    '&:hover': {
      color: 'var(--app-editor-foreground)',
      backgroundColor: 'var(--app-list-hoverBackground)',
      transition: '0.3s all ease',
    },
    '&:focus': {
      'outline': '1ps dashed var(--app-editor-focus-outline)'
    }
  })

  return (
    <div>
    {(threads.map(thread => {
      return (
        <a key={thread.id} css={lineStyle} href="void" tabIndex={0}>
          <FontAwesomeIcon icon={faBook} />
          <p title={thread.title}>{thread.title}</p>
        </a>
      )
    }))}
    </div>
  )
}
