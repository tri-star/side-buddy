import {
  type VersionedDocument,
  type MigrationDefinition,
} from '@tri-star/json-migrate'

export const threadListMigrations: MigrationDefinition[] = [
  {
    version: 2,
    migrate: (document: VersionedDocument) => {
      const threadList = document as unknown as Array<{
        id: string
        title: string
        messages: Array<{
          id: string
          role: string
          message: string
        }>
      }>

      return {
        threadList: threadList.map((thread) => {
          return {
            id: thread.id,
            title: thread.title,
            messages: thread.messages.map((message) => {
              return {
                id: message.id,
                role: message.role,
                model: 'gpt-4',
                message: message.message,
              }
            }),
          }
        }),
      }
    },
  },
]
