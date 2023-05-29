import express from 'express'
import http from 'http'

type ICreateService = (port: number, staticPath: string) => Promise<http.Server>

const createHttpServer: ICreateService = async (port = 6666, staticPath) => {
  let resolve, reject

  const promise = new Promise<http.Server>((x, y) => {
    resolve = x
    reject = y
  })

  const startServer = (resolve, reject, port) => {
    const app = express()

    app.use(express.static(staticPath))

    // 创建 HTTP 服务器实例
    const server = http.createServer(app)

    server.listen(port, () => {
      console.log('AT-[ server.listen ]', port)
      resolve(server)
    })

    // 处理服务器启动错误
    server.on('error', (err: any) => {
      console.log('AT-[ error ]', err)
      if (err.code === 'EADDRINUSE') {
        // 端口被占用，尝试使用下一个端口
        startServer(resolve, reject, port + 1)
      } else {
        console.error(err)
      }
    })

    server.on('close', () => {
      console.log('AT-[ server.close ]')
    })
  }

  startServer(resolve, reject, port)

  return promise
}

export default createHttpServer
