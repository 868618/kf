import { ipcRenderer } from 'electron'

const wifiPageApi = {
  changeSize(width: number, height: number) {
    return ipcRenderer.invoke('wifi:changeSize', width, height)
  }
}

export default wifiPageApi
