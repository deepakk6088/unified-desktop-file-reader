import { useState } from 'react'
import styles from './Settings.module.css'

function Settings({ onNavigate }) {
  const [fontSize, setFontSize] = useState('Medium')
  const [lineSpacing, setLineSpacing] = useState('Comfortable')
  const [rememberPosition, setRememberPosition] = useState(true)
  const [showProgress, setShowProgress] = useState(true)

  return (
    <div className={styles.settings}>
      <div className={styles.intro}>
        <h2>Your workspace, your way.</h2>
        <p>
          These preview settings are interactive, but are not saved
          between app restarts.
        </p>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon}>Aa</span>
          <div>
            <h3>Reading experience</h3>
            <p>Adjust how sample reading content is presented.</p>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Text size</h4>
            <p>Choose a comfortable reading size.</p>
          </div>

          <select
            value={fontSize}
            onChange={(event) => setFontSize(event.target.value)}
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Line spacing</h4>
            <p>Control the space between lines of text.</p>
          </div>

          <select
            value={lineSpacing}
            onChange={(event) => setLineSpacing(event.target.value)}
          >
            <option>Compact</option>
            <option>Comfortable</option>
            <option>Relaxed</option>
          </select>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon}>◷</span>
          <div>
            <h3>Reading habits</h3>
            <p>Preview the behavior of reading preferences.</p>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Remember reading position</h4>
            <p>Return to the same position when reopening a document.</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={rememberPosition}
            className={`${styles.toggle} ${
              rememberPosition ? styles.toggleOn : ''
            }`}
            onClick={() => setRememberPosition((value) => !value)}
          >
            <span />
          </button>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Show reading progress</h4>
            <p>Display a progress indicator in the reader.</p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={showProgress}
            className={`${styles.toggle} ${
              showProgress ? styles.toggleOn : ''
            }`}
            onClick={() => setShowProgress((value) => !value)}
          >
            <span />
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon}>▤</span>
          <div>
            <h3>Application</h3>
            <p>Basic information about your reader.</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span>Application version</span>
          <strong>1.0.0 · Preview</strong>
        </div>

        <div className={styles.infoRow}>
          <span>Appearance</span>
          <strong>Dark</strong>
        </div>

        <div className={styles.infoRow}>
          <span>Document storage</span>
          <strong>Not configured</strong>
        </div>
      </section>

      <div className={styles.settingsFooter}>
        <span>Preferences are currently temporary.</span>
        <button type="button" onClick={() => onNavigate('library')}>
          Return to Library
        </button>
      </div>
    </div>
  )
}

export default Settings