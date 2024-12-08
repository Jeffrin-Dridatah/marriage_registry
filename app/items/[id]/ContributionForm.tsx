// app/items/[id]/ContributionForm.tsx

'use client';

import { useState, FormEvent } from 'react';
import styles from '../../../styles/ItemDetails.module.css';
import { useRouter } from 'next/navigation';

export default function ContributionForm({ itemId, itemName }: { itemId: string; itemName: string }) {
  // Stages: 'initial' -> Show "Record Payment" button
  // 'form' -> Show name & amount input + "Complete" button
  // 'done' -> Show success message
  const [stage, setStage] = useState<'initial' | 'form' | 'done'>('initial');
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleStart = () => {
    setStage('form');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amt = parseInt(amount, 10);
    if (!amount || isNaN(amt) || amt <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    const res = await fetch('/api/contribute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId,
        itemName,
        name: name.trim() || 'Anonymous',
        amount: amt,
      }),
    });

    if (res.ok) {
      setMessage('Contribution recorded! Thank you.');
      setStage('done');
      setAmount('');
      setName('');
      // Refresh the page to update contributed amount
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || 'An error occurred. Please try again.');
    }
  };

  if (stage === 'initial') {
    return (
      <div>
        <button onClick={handleStart} className={styles.submitButton}>
          Record Payment
        </button>
      </div>
    );
  }

  if (stage === 'form') {
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Name (optional)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Amount (in ₹)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <button type="submit" className={styles.submitButton}>
          Complete
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    );
  }

  if (stage === 'done') {
    return <p className={styles.message}>{message}</p>;
  }

  return null;
}
