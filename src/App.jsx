import AppLayout from './layout/AppLayout.jsx'
import styles from './App.module.css'

function App() {
  return (
    <AppLayout>
      {(activePage) => (
        <section className={styles.page}>
          {activePage === 'library' ? (
            <div className={styles.welcome}>
              <div className={styles.eyebrow}>
                YOUR PERSONAL READING SPACE
              </div>

              <h2>Everything you read, together.</h2>

              <p>
                A focused workspace for your documents.
                Your library experience will live here.
              </p>

              <div className={styles.placeholder}>
                <div className={styles.documentIcon}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 3.75h8l4 4v12.5H6z" />
                    <path d="M14 3.75v4h4M9 12h6M9 15.5h6" />
                  </svg>
                </div>

                <span className={styles.placeholderTitle}>
                  Your library starts here
                </span>

                <span className={styles.placeholderDescription}>
                  Document cards and library controls will be added next.
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.settingsPlaceholder}>
              <h2>Workspace preferences</h2>
              <p>
                Settings will be added in a later step.
              </p>
            </div>
          )}
        </section>
      )}
    </AppLayout>
  )
}

export default App