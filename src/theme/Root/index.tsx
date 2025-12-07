/**
 * Root component for Docusaurus theme
 * Wraps all pages to inject global components like ChatWidget
 */

import type {ReactNode} from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}

