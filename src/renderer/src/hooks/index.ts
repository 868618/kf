import { ref } from 'vue'

const useWifiInfo = async () => {
  const info = ref({})
  const res = await window.api.getWifiInfo()

  info.value = res

  return res
}

const useSubDirs = async (dir) => {
  const paths = await window.api.glob(`${dir}/*`)

  const result: any[] = []

  for (const p of paths) {
    const parsed = await window.api.pathParse(p)

    const pdfs = await window.api.glob(`${p}/*.pdf`)

    const docs = await window.api.glob(`${p}/*.doc*`)

    const all = await window.api.glob(`${p}/*`)

    const mp4s = await window.api.glob(`${p}/*.mp4`)

    const item = {
      ...parsed,
      p,
      pdfs,
      pdfCount: pdfs.length,
      docs,
      docCount: docs.length,
      mp4s,
      mp4Count: mp4s.length,
      all
    }

    result.push(item)
  }

  return result
}

const useDir = async (path: string) => {
  const parsed = await window.api.pathParse(path)

  const pdfs = await window.api.glob(`${path}/*.pdf`)

  const docs = await window.api.glob(`${path}/*.doc*`)

  const all = await window.api.glob(`${path}/*`)

  const mp4s = await window.api.glob(`${path}/*.mp4`)

  return {
    ...parsed,
    p: path,
    pdfs,
    pdfCount: pdfs.length,
    docs,
    docCount: docs.length,
    mp4s,
    mp4Count: mp4s.length,
    all
  }
}

export { useWifiInfo, useSubDirs, useDir }
