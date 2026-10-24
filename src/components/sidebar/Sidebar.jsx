import styles from './Sidebar.module.css'

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="6" height="16" rx="1.5" />
      <rect x="13" y="4" width="7" height="10" rx="1.5" />
      <rect x="13" y="17" width="7" height="3" rx="1.5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.08-.02a1.7 1.7 0 0 0-1.77.55l-.05.07h-3.4l-.03-.08a1.7 1.7 0 0 0-1.43-1.12l-.09-.01-1.7-2.94.06-.07A1.7 1.7 0 0 0 9.9 14.5l-.02-.09v-3.4l.08-.03a1.7 1.7 0 0 0 1.12-1.43l.01-.09 2.94-1.7.07.06a1.7 1.7 0 0 0 1.88.34l.06-.03 2.94 1.7-.02.08a1.7 1.7 0 0 0 .55 1.77l.07.05v3.4z" />
    </svg>
  )
}

function Sidebar({ activePage, onNavigate }) {
  const navigationItems = [
    {
      id: 'library',
      label: 'Library',
      icon: LibraryIcon,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
    },
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
          <span className={styles.brandName}>Unified Reader</span>
          <span className={styles.brandCaption}>DESKTOP WORKSPACE</span>
        </div>
      </div>

      <div className={styles.sectionLabel}>WORKSPACE</div>

      <nav className={styles.navigation} aria-label="Main navigation">
        {navigationItems.map(({ id, label, icon: Icon }) => (
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
              <Icon />
            </span>

            <span>{label}</span>

            {activePage === id && <span className={styles.activeMarker} />}
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

        <div className={styles.version}>Unified Reader · v1.0</div>
      </div>
    </aside>
  )
}

export default Sidebar