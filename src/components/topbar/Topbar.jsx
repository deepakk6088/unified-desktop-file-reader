import styles from './TopBar.module.css'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function TopBar({ title, description }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.pageInfo}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className={styles.actions}>
        <label className={styles.searchBox}>
          <SearchIcon />
          <input
            type="search"
            placeholder="Search your library..."
            aria-label="Search your library"
            disabled
          />
          <span className={styles.shortcut}>⌘ K</span>
        </label>

        <div className={styles.offlineBadge}>
          <span />
          Offline
        </div>
      </div>
    </header>
  )
}

export default TopBar