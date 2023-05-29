import { contextBridge, ipcRenderer } from 'electron'

import wifiPageApi from './wifi'
import createExpressServer from './webserver/index'

import type http from 'http'
// import { electronAPI } from '@electron-toolkit/preload'

let express: http.Server

// Custom APIs for renderer
const api = {
  showOpenDialogSync() {
    return ipcRenderer.invoke('showOpenDialogSync')
  },

  getWifiInfo() {
    return ipcRenderer.invoke('getWifiInfo')
  },

  previewPdf(pdfurl) {
    ipcRenderer.send('previewPdf', pdfurl)
  },

  getStore(key: string) {
    return ipcRenderer.invoke('getStore', key)
  },

  setStore(key: string, value: any) {
    return ipcRenderer.invoke('setStore', key, value)
  },

  deleteStore(key: string) {
    ipcRenderer.invoke('deleteStore', key)
  },

  path(src: string) {
    return ipcRenderer.invoke('path', src)
  },

  /**
   *
   * @param str path地址
   * @returns
   */

  glob(str: string) {
    return ipcRenderer.invoke('glob', str)
  },

  closeAllChildWindows() {
    ipcRenderer.send('closeAllChildWindows')
  },

  convertToVideo(src: string) {
    return ipcRenderer.invoke('convertToVideo', src)
  },

  showWifiName() {
    ipcRenderer.send('showWifiName')
  },

  pathParse: (src: string) => ipcRenderer.invoke('pathParse', src),

  createHttpServer: async (options: { static: string; port: number }) => {
    if (!express) {
      express = await createExpressServer(options.port, options.static)
    }

    return express
  },

  closeHttpServer() {
    // console.log('AT-[ closeHttpServer &&&&&********** ]', express.close)
    express.close()
  }
}

const apiList: [string, object][] = [
  ['api', api],
  ['wifi:api', wifiPageApi]
]

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

if (process.contextIsolated) {
  try {
    apiList.forEach(([key, value]) => contextBridge.exposeInMainWorld(key, value))
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  apiList.forEach(([key, value]) => (window[key] = value))
}
