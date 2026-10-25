import { useState } from 'react'
import AppLayout from './layout/AppLayout.jsx'
import Library from './pages/library/Library.jsx'
import Reader from './pages/reader/Reader.jsx'
import Settings from './pages/settings/Settings.jsx'
import {
  loadReadingPreferences,
  saveReadingPreferences,
} from './services/readingPreferences.js'

function App() {
  const [activePage, setActivePage] = useState('library')
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [preferences, setPreferences] = useState(loadReadingPreferences)
  const [preferencesError, setPreferencesError] = useState('')

  function handleOpenDocument(document) {
    setSelectedDocument(document)
    setActivePage('reader')
  }

  function handlePreferencesChange(changes) {
    try {
      const updated = saveReadingPreferences({
        ...preferences,
        ...changes,
      })

      setPreferences(updated)
      setPreferencesError('')
    } catch (error) {
      setPreferencesError(
        error instanceof Error
          ? error.message
          : 'Preferences could not be saved.',
      )
    }
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={setActivePage}
    >
      {activePage === 'library' && (
        <Library onOpenDocument={handleOpenDocument} />
      )}

      {activePage === 'reader' && (
        <Reader
          document={selectedDocument}
          onBack={() => setActivePage('library')}
          preferences={preferences}
        />
      )}

      {activePage === 'settings' && (
        <Settings
          preferences={preferences}
          onPreferencesChange={handlePreferencesChange}
          preferencesError={preferencesError}
          onNavigate={setActivePage}
        />
      )}
    </AppLayout>
  )
}

export default App