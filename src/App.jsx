import { useState } from 'react'
import AppLayout from './layout/AppLayout.jsx'
import Library from './pages/library/Library.jsx'
import Reader from './pages/reader/Reader.jsx'
import Settings from './pages/settings/Settings.jsx'

function App() {
  const [activePage, setActivePage] = useState('library')
  const [selectedDocument, setSelectedDocument] = useState(null)

  function handleOpenDocument(document) {
    setSelectedDocument(document)
    setActivePage('reader')
  }

  function handleNavigate(page) {
    setActivePage(page)
  }

  function handleBackToLibrary() {
    setActivePage('library')
  }

  return (
    <AppLayout
      activePage={activePage}
      onNavigate={handleNavigate}
    >
      {activePage === 'library' && (
        <Library onOpenDocument={handleOpenDocument} />
      )}

      {activePage === 'reader' && (
        <Reader
          document={selectedDocument}
          onBack={handleBackToLibrary}
        />
      )}

      {activePage === 'settings' && (
        <Settings onNavigate={handleNavigate} />
      )}
    </AppLayout>
  )
}

export default App