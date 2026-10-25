
export async function selectDocuments() {
  if (!window.desktop?.selectDocuments) {
    throw new Error(
      'Electron preload API is unavailable. Check that preload.cjs loads correctly.',
    )
  }

  const result = await window.desktop.selectDocuments()

  if (
    !result ||
    typeof result.canceled !== 'boolean' ||
    !Array.isArray(result.files)
  ) {
    throw new Error('Electron returned an invalid file-picker response.')
  }

  return result
}

export async function readPdf(filePath) {
  if (!window.desktop?.readPdf) {
    throw new Error(
      'PDF access is unavailable. Check that preload.cjs exposes readPdf.',
    )
  }

  if (typeof filePath !== 'string' || !filePath) {
    throw new Error('This document has no local file reference.')
  }

  const data = await window.desktop.readPdf(filePath)

  if (!(data instanceof Uint8Array)) {
    throw new Error('Electron returned invalid PDF data.')
  }

  return data
}

export async function readDocument(filePath) {
  if (!window.desktop?.readDocument) {
    throw new Error(
      'Document access is unavailable. Check that preload.cjs exposes readDocument.',
    )
  }

  if (typeof filePath !== 'string' || !filePath) {
    throw new Error('This document has no local file reference.')
  }

  const data = await window.desktop.readDocument(filePath)

  if (!(data instanceof Uint8Array)) {
    throw new Error('Electron returned invalid document data.')
  }

  return data
}
