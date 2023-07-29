import path, { join, parse } from 'node:path'
import fs from 'fs'

import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'

import Store from 'electron-store'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import wifi from 'node-wifi'
import { globSync } from 'glob'
import pdf2video from '@fatpigs/pdf2video'
import icon from '../../resources/icon.png?asset'

import lodash from 'lodash'
import { XMLParser } from 'fast-xml-parser'

type ICreateWindow = (
  options?: Electron.BrowserWindowConstructorOptions,
  router?: string
) => Electron.BrowserWindow

const creatWindow: ICreateWindow = (options = {}, router = '/') => {
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    ...options,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      ...options.webPreferences
    }
  })

  win.on('ready-to-show', win.show)

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  const electronRendererUrl = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && electronRendererUrl) {
    win.loadURL(`${electronRendererUrl}${router}`)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html' + router))
  }

  return win
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const mainWindow = await creatWindow({ title: '', width: 1200, height: 800 })

  const store = new Store()

  mainWindow.webContents.openDevTools()

  ipcMain.on('showWifiName', async (channel) => {
    const childWindows = BrowserWindow.getAllWindows()
    if (childWindows.some((w) => w.getTitle() == 'wifiWindow')) return
    const wifiWindow = await creatWindow(
      {
        titleBarStyle: 'hiddenInset',
        transparent: true,
        frame: true,
        resizable: false,
        type: 'panel',
        vibrancy: 'appearance-based',
        title: 'wifiWindow',

        focusable: false
      },

      '/wifi'
    )

    wifiWindow.setPosition(20, 40)

    wifiWindow.setWindowButtonVisibility(false)

    ipcMain.handle('wifi:changeSize', (channel, width, height) => {
      wifiWindow.setSize(width, height)
    })
  })

  ipcMain.handle('showOpenDialogSync', (event, args) =>
    dialog.showOpenDialogSync(mainWindow, {
      title: '选择目录',
      properties: ['openDirectory'],
      ...args
    })
  )

  ipcMain.handle('parseFile', (event, file) => {
    const parser = new XMLParser()
    const XMLdata = fs.readFileSync(file, 'utf8')

    const items = XMLdata.split('\r\n\r\n')
      .map((item) => {
        try {
          return parser.parse(item)
        } catch (error) {
          return null
        }
      })
      .filter(Boolean)
      .map(({ question, name }) => {
        return {
          ...question,
          name: Array.isArray(name) ? lodash.union(name).toString() : name
        }
      })

    return items
  })

  ipcMain.handle('getWifiInfo', () => {
    wifi.init({ iface: null })
    let resolve, reject

    const promise = new Promise((x, y) => {
      resolve = x
      reject = y
    })

    wifi.getCurrentConnections((error, currentConnections) => {
      error ? reject(error) : resolve(currentConnections)
    })

    return promise
  })

  ipcMain.handle('pathParse', (channel, dir: string) => parse(dir))

  ipcMain.on('previewPdf', (event, pdfUrl) => {
    const win = new BrowserWindow({
      parent: mainWindow,
      width: 450,
      height: 800,
      title: 'pdf预览',
      x: 800,
      y: 50,
      focusable: false
    })

    win.loadURL(`file://${pdfUrl}`)
  })

  ipcMain.handle('getStore', (channel, key: string) => store.get(key))

  ipcMain.handle('deleteStore', (channel, key: string) => store.delete(key))

  ipcMain.handle('setStore', (channel, key: string, value: string) => {
    store.set(key, value)
  })

  ipcMain.handle('path', (channel, src: string) => path.parse(src))

  ipcMain.handle('glob', (channel, str: string) => globSync(str))

  ipcMain.on('closeAllChildWindows', () => {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win != mainWindow) win.close()
    })
  })

  ipcMain.handle('convertToVideo', async (channel, pdfSrc: string) => {
    console.log('AT-[ pdfSrc &&&&&********** ]', pdfSrc)
    const result = await pdf2video(pdfSrc, { output: path.dirname(pdfSrc) })
    console.log('AT-[ 视频转换结果 ]', result)
    return result
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    if (BrowserWindow.getAllWindows().length === 0) creatWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
