// app/items/[id]/OpenUpiAppButton.tsx

'use client';

import React from 'react';
import styles from '../../../styles/ItemDetails.module.css';

interface OpenUpiAppButtonProps {
  openUpiAppUrl: string;
}

export default function OpenUpiAppButton({ openUpiAppUrl }: OpenUpiAppButtonProps) {
  const handleClick = () => {
    window.location.href = openUpiAppUrl;
  };

  return (
    <button onClick={handleClick} className={styles.openUpiButton}>
      Open UPI App
    </button>
  );
}
