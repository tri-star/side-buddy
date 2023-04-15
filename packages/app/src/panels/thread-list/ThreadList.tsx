import { listenExtensionMessage } from "@/api/vs-code/listen-extension-message";
import { sendPanelMessage } from "@/api/vs-code/send-panel-message";
import { type ExtensionMessage } from "@/domain/extension-message";
import { type Thread } from "@/domain/thread";
import { type ReactElement, useEffect, useState } from "react";

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

  return (
    <div>
    {(threads.map(thread => {
      return (
        <div key={thread.id}>{thread.title}</div>
      )
    }))}
    </div>
  )
}
