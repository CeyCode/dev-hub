import React, {useState, useEffect, useRef} from 'react';
import TOC from '@theme-original/TOC';
import type TOCType from '@theme/TOC';
import type {WrapperProps} from '@docusaurus/types';
import styles from './styles.module.css';

type Props = WrapperProps<typeof TOCType>;

const STORAGE_KEY = 'ceycode-toc-collapsed';
const DESKTOP = 997;

function getInitialState(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export default function TOCWrapper(props: Props): React.ReactElement {
  const [collapsed, setCollapsed] = useState(getInitialState);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Wire smooth CSS transitions on the two columns once after mount.
  useEffect(() => {
    if (window.innerWidth < DESKTOP) return;
    const tocCol  = wrapperRef.current?.closest('.col') as HTMLElement | null;
    const mainCol = tocCol?.previousElementSibling as HTMLElement | null;
    if (!tocCol || !mainCol?.classList.contains('col')) return;
    const t = 'flex-basis 0.25s ease, max-width 0.25s ease, padding 0.25s ease, min-width 0.25s ease';
    tocCol.style.transition  = t;
    mainCol.style.transition = t;
  }, []);

  // Resize both columns on every toggle.
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < DESKTOP) return;
    const tocCol  = wrapperRef.current?.closest('.col') as HTMLElement | null;
    const mainCol = tocCol?.previousElementSibling as HTMLElement | null;
    if (!tocCol || !mainCol?.classList.contains('col')) return;

    if (collapsed) {
      // Collapse TOC column to zero so it takes no space in the flex row.
      tocCol.style.setProperty('flex-basis',    '0',      'important');
      tocCol.style.setProperty('max-width',     '0',      'important');
      tocCol.style.setProperty('min-width',     '0',      'important');
      tocCol.style.setProperty('padding-left',  '0',      'important');
      tocCol.style.setProperty('padding-right', '0',      'important');
      tocCol.style.setProperty('overflow',      'hidden', 'important');

      // Remove the 75% max-width cap so the main content fills the freed space.
      mainCol.style.setProperty('max-width', '100%', 'important');
    } else {
      tocCol.style.removeProperty('flex-basis');
      tocCol.style.removeProperty('max-width');
      tocCol.style.removeProperty('min-width');
      tocCol.style.removeProperty('padding-left');
      tocCol.style.removeProperty('padding-right');
      tocCol.style.removeProperty('overflow');
      mainCol.style.removeProperty('max-width');
    }
  }, [collapsed]);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      data-toc-collapsed={collapsed || undefined}
    >
      <button
        className={`${styles.toggle} ${collapsed ? styles.togglePill : ''}`}
        onClick={toggle}
        aria-label={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
        title={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
      >
        <span className={`${styles.chevron} ${collapsed ? styles.chevronCollapsed : ''}`}>
          ›
        </span>
        <span className={styles.label}>
          {collapsed ? '' : 'On this page'}
        </span>
      </button>

      {!collapsed && <TOC {...props} />}
    </div>
  );
}
