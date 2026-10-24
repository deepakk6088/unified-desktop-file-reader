import { useState } from 'react'
import Sidebar from '../components/sidebar/sidebar.jsx'
import TopBar from '../components/topbar/topbar.jsx'
import styles from './AppLayout.module.css'

const pageDetails = {
  library: {
    title: 'Your Library',
    description: 'All your documents, in one quiet place.',
  },
  settings: {
    title: 'Settings',
    description: 'Customize your reading workspace.',
  },
}

function AppLayout({ children }) {
  const [activePage, setActivePage] = useState('library')
  const currentPage = pageDetails[activePage]

  return (
    <div className={styles.appShell}>
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className={styles.mainColumn}>
        <TopBar
          title={currentPage.title}
          description={currentPage.description}
        />

        <main className={styles.content}>
          {typeof children === 'function'
            ? children(activePage)
            : children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout