
import styles from './Sidebar.module.css'

function LibraryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6" height="16" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="14" width="7" height="6" rx="1.5" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2.9Z" />
    </svg>
  )
}

function AppMark() {
  return (
    <div className={styles.appMark} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path
          d="M8 6.5h10l6 6V25H8V6.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M18 6.5v6h6M12 17h8M12 21h8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

function Sidebar({ activePage, onNavigate }) {
  const navigationItems = [
    { label: 'Library', Icon: LibraryIcon },
    { label: 'Settings', Icon: SettingsIcon },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <AppMark />

        <div className={styles.brandText}>
          <span className={styles.brandName}>folio</span>
          <span className={styles.brandCaption}>DESKTOP READER</span>
        </div>
      </div>

      <div className={styles.sectionLabel}>WORKSPACE</div>

      <nav className={styles.navigation} aria-label="Main navigation">
        {navigationItems.map(({ label, Icon }) => {
          const isActive = activePage === label

          return (
            <button
              key={label}
              type="button"
              className={`${styles.navItem} ${
                isActive ? styles.navItemActive : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onNavigate(label)}
            >
              <Icon />
              <span>{label}</span>

              {isActive && <span className={styles.activeIndicator} />}
            </button>
          )
        })}
      </nav>

      <div className={styles.sidebarBottom}>
        <div className={styles.storageCard}>
          <div className={styles.storageIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="4" y="5" width="16" height="14" rx="3" />
              <path d="M8 9h8M8 13h5" />
            </svg>
          </div>

          <div className={styles.storageText}>
            <span className={styles.storageTitle}>Your space</span>
            <span className={styles.storageDescription}>
              Private by design
            </span>
          </div>

          <span className={styles.statusDot} />
        </div>

        <div className={styles.footer}>
          <span className={styles.footerDot} />
          <span>Designed for offline reading</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
