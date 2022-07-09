import { ProtocolWithReturn } from 'webext-bridge'
import { File as FileStoreElement } from './src/background/libs/fileCache'

interface ResourceResponse {
    isError: boolean
    error: Error | null
    data:
        | {
              id: number
              name: string
              url: string
              file: FileStoreElement
          }[]
        | null
}

declare module 'webext-bridge' {
    export interface ProtocolMap {
        // define message protocol types
        // see https://github.com/antfu/webext-bridge#type-safe-protocols
        'tab-prev': { title: string | undefined }
        'get-current-tab': ProtocolWithReturn<
            { tabId: number },
            { title?: string }
        >
        'remember-resources': ProtocolWithReturn<
            { items: { name: string; url: string; ex: number }[] },
            ResourceResponse
        >
        'update-resources': ProtocolWithReturn<
            { items: { id: number; name: string; url: string }[] },
            ResourceResponse
        >
    }
}
