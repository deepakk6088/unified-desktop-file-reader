export async function selectDocuments() {
  if (!window.desktop?.selectDocuments) {
    throw new Error('The desktop file picker is unavailable.')
  }

  return window.desktop.selectDocuments()
}
