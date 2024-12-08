// app/items/[id]/ContributionGuide.tsx

'use client';

import React from 'react';
import styles from '../../../styles/ItemDetails.module.css';
import { AiOutlineInfoCircle } from 'react-icons/ai';

export default function ContributionGuide() {
  return (
    <div className={styles.guide}>
      <AiOutlineInfoCircle className={styles.infoIcon} />
      <span>
        Use the QR code, UPI ID, or click the button below to make a payment. After completing the payment, please record your payment.
      </span>
    </div>
  );
}
