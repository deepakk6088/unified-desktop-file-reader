export async function selectDocuments() {
  if (!window.desktop?.selectDocuments) {
    throw new Error(
      'Electron preload API is unavailable. Check that preload.js loads correctly.',
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
