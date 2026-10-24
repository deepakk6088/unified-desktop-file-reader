import Sidebar from '../components/sidebar/sidebar.jsx'
import TopBar from '../components/topbar/topbar.jsx'
import styles from './AppLayout.module.css'

const pageDetails = {
  library: {
    title: 'Your Library',
    description: 'All your documents, in one quiet place.',
  },
  reader: {
    title: 'Reader',
    description: 'A focused space for your next read.',
  },
  settings: {
    title: 'Settings',
    description: 'Customize your reading workspace.',
  },
}

function AppLayout({ activePage, onNavigate, children }) {
  const currentPage = pageDetails[activePage] ?? pageDetails.library

  return (
    <div className={styles.appShell}>
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
      />

      <div className={styles.mainColumn}>
        <TopBar
          title={currentPage.title}
          description={currentPage.description}
        />

        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout