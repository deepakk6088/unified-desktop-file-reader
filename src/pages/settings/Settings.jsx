import styles from './Settings.module.css'

function Settings({
  preferences,
  onPreferencesChange,
  preferencesError,
  onNavigate,
}) {
  const current = preferences ?? {
    fontSize: 'medium',
    lineSpacing: 'comfortable',
    readingWidth: 'comfortable',
    showProgress: true,
  }

  function update(key, value) {
    onPreferencesChange?.({ [key]: value })
  }

  return (
    <div className={styles.settings}>
      <div className={styles.intro}>
        <h2>Your workspace, your way.</h2>
        <p>
          Customize how text-based documents appear. Your
          preferences are saved on this device.
        </p>
      </div>

      <section
        className={styles.section}
        aria-labelledby="reading-experience-heading"
      >
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden="true">
            Aa
          </span>
          <div>
            <h3 id="reading-experience-heading">
              Reading experience
            </h3>
            <p>
              Adjust typography and the width of the reading page.
            </p>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Text size</h4>
            <p>Choose a comfortable size for EPUB and DOCX.</p>
          </div>

          <select
            aria-label="Text size"
            value={current.fontSize}
            onChange={(event) =>
              update('fontSize', event.target.value)
            }
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Line spacing</h4>
            <p>Control the space between lines of text.</p>
          </div>

          <select
            aria-label="Line spacing"
            value={current.lineSpacing}
            onChange={(event) =>
              update('lineSpacing', event.target.value)
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Reading width</h4>
            <p>Choose a narrower or wider reading page.</p>
          </div>

          <select
            aria-label="Reading width"
            value={current.readingWidth}
            onChange={(event) =>
              update('readingWidth', event.target.value)
            }
          >
            <option value="narrow">Narrow</option>
            <option value="comfortable">Comfortable</option>
            <option value="wide">Wide</option>
          </select>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="reading-habits-heading"
      >
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden="true">
            ◷
          </span>
          <div>
            <h3 id="reading-habits-heading">Reading habits</h3>
            <p>Choose which reading helper remains visible.</p>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <h4>Show reading progress</h4>
            <p>
              Show the progress indicator on the sample reading
              page when available.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-label="Show reading progress"
            aria-checked={current.showProgress}
            className={`${styles.toggle} ${
              current.showProgress ? styles.toggleOn : ''
            }`}
            onClick={() =>
              update('showProgress', !current.showProgress)
            }
          >
            <span />
          </button>
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="application-heading"
      >
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIcon} aria-hidden="true">
            ▤
          </span>
          <div>
            <h3 id="application-heading">Application</h3>
            <p>Information about your local reader.</p>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span>Appearance</span>
          <strong>Dark</strong>
        </div>

        <div className={styles.infoRow}>
          <span>Supported readers</span>
          <strong>PDF · EPUB · DOCX</strong>
        </div>

        <div className={styles.infoRow}>
          <span>Preference storage</span>
          <strong>On this device</strong>
        </div>
      </section>

      {preferencesError && (
        <p className={styles.errorMessage} role="alert">
          {preferencesError}
        </p>
      )}

      <div className={styles.settingsFooter}>
        <span>Changes save automatically.</span>
        <button
          type="button"
          onClick={() => onNavigate('library')}
        >
          Return to Library
        </button>
      </div>
    </div>
  )
}

export default Settings