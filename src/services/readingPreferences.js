
const STORAGE_KEY = 'unified-desktop-file-reader:reading-preferences'

export const DEFAULT_READING_PREFERENCES = {
  fontSize: 'medium',
  lineSpacing: 'comfortable',
  readingWidth: 'comfortable',
  showProgress: true,
}

const allowedValues = {
  fontSize: ['small', 'medium', 'large'],
  lineSpacing: ['compact', 'comfortable', 'relaxed'],
  readingWidth: ['narrow', 'comfortable', 'wide'],
}

export function loadReadingPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return { ...DEFAULT_READING_PREFERENCES }
    }

    const parsed = JSON.parse(saved)
    const preferences = { ...DEFAULT_READING_PREFERENCES }

    for (const key of Object.keys(allowedValues)) {
      if (allowedValues[key].includes(parsed?.[key])) {
        preferences[key] = parsed[key]
      }
    }

    if (typeof parsed?.showProgress === 'boolean') {
      preferences.showProgress = parsed.showProgress
    }

    return preferences
  } catch (error) {
    console.warn('Could not load reading preferences:', error)
    return { ...DEFAULT_READING_PREFERENCES }
  }
}

export function saveReadingPreferences(nextPreferences) {
  const current = loadReadingPreferences()
  const next = { ...current }

  for (const key of Object.keys(allowedValues)) {
    if (allowedValues[key].includes(nextPreferences?.[key])) {
      next[key] = nextPreferences[key]
    }
  }

  if (typeof nextPreferences?.showProgress === 'boolean') {
    next.showProgress = nextPreferences.showProgress
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (error) {
    throw new Error(
      'Preferences could not be saved on this device. Check available storage and try again.',
      { cause: error },
    )
  }

  return next
}
