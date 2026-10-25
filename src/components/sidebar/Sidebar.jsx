
import styles from './Sidebar.module.css'

function NavIcon({ type }) {
  if (type === 'library') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="16" rx="1.5" />
        <rect x="13" y="4" width="7" height="10" rx="1.5" />
        <rect x="13" y="17" width="7" height="3" rx="1.5" />
      </svg>
    )
  }

  if (type === 'reader') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5c3.1-1.2 5.8-.8 8 1.2v13c-2.2-2-4.9-2.4-8-1.2z" />
        <path d="M20 5.5c-3.1-1.2-5.8-.8-8 1.2v13c2.2-2 4.9-2.4 8-1.2z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19 13.5a1.6 1.6 0 0 0 .4 1.7l.1.1-1.7 2.9-.1-.1a1.6 1.6 0 0 0-1.7.4l-.1.1h-3.4l-.1-.1a1.6 1.6 0 0 0-1.7-.4l-.1.1-1.7-2.9.1-.1a1.6 1.6 0 0 0 .4-1.7l-.1-.1v-2.8l.1-.1a1.6 1.6 0 0 0-.4-1.7l-.1-.1 1.7-2.9.1.1a1.6 1.6 0 0 0 1.7.4l.1-.1h3.4l.1.1a1.6 1.6 0 0 0 1.7.4l.1-.1 1.7 2.9-.1.1a1.6 1.6 0 0 0-.4 1.7l.1.1v2.8z" />
    </svg>
  )
}

function Sidebar({ activePage, onNavigate }) {
  const navigationItems = [
    { id: 'library', label: 'Library', icon: 'library' },
    { id: 'reader', label: 'Reader', icon: 'reader' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 3.75h8l4 4v12.5H6z" />
            <path d="M14 3.75v4h4M9 12h6M9 15.5h6" />
          </svg>
        </div>

        <div className={styles.brandText}>
          <span className={styles.brandName}>DocNest</span>
          <span className={styles.brandCaption}>DESKTOP WORKSPACE</span>
        </div>
      </div>

      <div className={styles.sectionLabel}>WORKSPACE</div>

      <nav className={styles.navigation} aria-label="Main navigation">
        {navigationItems.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.navItem} ${
              activePage === id ? styles.active : ''
            }`}
            onClick={() => onNavigate(id)}
            aria-current={activePage === id ? 'page' : undefined}
          >
            <span className={styles.navIcon}>
              <NavIcon type={icon} />
            </span>

            <span>{label}</span>

            {activePage === id && (
              <span className={styles.activeMarker} />
            )}
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.statusCard}>
          <span className={styles.statusIcon}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 10a10 10 0 0 1 14 0" />
              <path d="M8 13a6 6 0 0 1 8 0" />
              <path d="M11 16a2 2 0 0 1 2 0" />
              <path d="M12 20h.01" />
            </svg>
          </span>

          <div className={styles.statusText}>
            <span className={styles.statusTitle}>Offline ready</span>
            <span className={styles.statusDescription}>
              Designed for local files
            </span>
          </div>

          <span className={styles.statusDot} />
        </div>

        <div className={styles.version}>DocNest · v1.0</div>
      </div>
    </aside>
  )
}

export default Sidebar
