import styles from './TopBar.module.css'

function TopBar({ title, description }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchPlaceholder}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.3" />
            <path d="m15.5 15.5 4.2 4.2" />
          </svg>

          <span>Search your library</span>

          <span className={styles.shortcut}>⌘ K</span>
        </div>

        <div className={styles.offlineBadge}>
          <span />
          <span>Offline</span>
        </div>
      </div>
    </header>
  )
}

export default TopBar
