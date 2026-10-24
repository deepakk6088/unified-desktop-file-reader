
import AppLayout from './layout/AppLayout.jsx'
import Library from './pages/Library.jsx'
import styles from './App.module.css'

function App() {
  return (
    <AppLayout>
      {(activePage) =>
        activePage === 'Library' ? (
          <Library />
        ) : (
          <section className={styles.placeholder}>
            <span className={styles.eyebrow}>COMING LATER</span>
            <h2>Make it yours.</h2>
            <p>
              Reading preferences and appearance settings
              will be added in a later step.
            </p>
          </section>
        )
      }
    </AppLayout>
  )
}

export default App
