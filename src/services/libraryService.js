
export async function loadLibrary() {
  if (!window.desktop?.loadLibrary) {
    throw new Error(
      'Library storage is unavailable. Check electron/preload.cjs.',
    )
  }

  const library = await window.desktop.loadLibrary()

  if (!Array.isArray(library)) {
    throw new Error('Electron returned an invalid library.')
  }

  return library
}

export async function saveLibrary(library) {
  if (!window.desktop?.saveLibrary) {
    throw new Error(
      'Library storage is unavailable. Check electron/preload.cjs.',
    )
  }

  if (!Array.isArray(library)) {
    throw new Error('The library must be an array.')
  }

  const result = await window.desktop.saveLibrary(library)

  if (!result?.success) {
    throw new Error('The library could not be saved.')
  }
}
