/**
 * Citation component
 * Displays individual citation with clickable link to textbook content
 */

import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {Citation as CitationType} from './types';
import styles from './styles.module.css';

interface CitationProps {
  citation: CitationType;
}

export default function Citation({citation}: CitationProps): ReactNode {
  return (
    <div className={styles.citation}>
      {citation.text && (
        <div className={styles.citationText}>{citation.text}</div>
      )}
      <Link
        to={citation.url}
        className={styles.citationLink}
        target="_self"
        rel="noopener noreferrer">
        {citation.url}
      </Link>
    </div>
  );
}

