function getDesktopAPI() {
  if (!window.desktop?.loadAppState || !window.desktop?.updateAppState) {
    throw new Error(
      'Persistent storage is unavailable. Check electron/preload.cjs.',
    )
  }

  return window.desktop
}

export async function loadAppState() {
  const api = getDesktopAPI()
  const state = await api.loadAppState()

  return {
    library: Array.isArray(state.library) ? state.library : [],
    progress: state.progress ?? {},
    bookmarks: Array.isArray(state.bookmarks) ? state.bookmarks : [],
  }
}

export async function updateAppState(changes) {
  const api = getDesktopAPI()
  return api.updateAppState(changes)
}