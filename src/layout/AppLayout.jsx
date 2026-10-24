import { useState } from 'react'
import Sidebar from '../components/sidebar/sidebar.jsx'
import TopBar from  '../components/topbar/topbar.jsx'
import styles from './AppLayout.module.css'

const pageDetails = {
  Library: {
    title: 'Your library',
    description: 'Your personal space for reading and discovery.',
  },
  Settings: {
    title: 'Settings',
    description: 'Make your reading space feel like yours.',
  },
}

function AppLayout({ children }) {
  const [activePage, setActivePage] = useState('Library')
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
