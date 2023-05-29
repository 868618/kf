import { ElectronAPI } from '@electron-toolkit/preload'
// import { type Express } from 'express'
import type http from 'http'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      showOpenDialogSync: Electron.Dialog.showOpenDialogSync
      getWifiInfo: WiFiNetwork.getCurrentConnections
      mouseenter: () => void
      mouseleave: () => void
      changeSize: (width: number, height: number) => void
      previewPdf: (pdfUrl: string) => void

      getStore: (key: string) => unknown
      setStore: (key: string, value: any) => void
      deleteStore: (key: string) => void
      path: (src: string) => Promise<path.ParsedPath>

      /**
       *
       * @param path 目录地址
       */
      glob(path: string): Promise<string[]>

      closeAllChildWindows: () => void

      /**
       *
       * @param pdfSrc pdf文件目录
       * @returns
       */

      convertToVideo: (pdfSrc: string) => Promise<any>

      showWifiName: () => void

      pathParse(src: string): Promise<path.ParsedPath>

      createHttpServer: (options: { static: string; port: number }) => Promise<http.Server>

      closeHttpServer: () => void
    }

    'wifi:api': {
      changeSize: (width: number, height: number) => Promise<any>
    }
  }
}
