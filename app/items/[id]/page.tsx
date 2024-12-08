// app/items/[id]/page.tsx

import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import styles from '../../../styles/ItemDetails.module.css';
import ContributionForm from './ContributionForm';
import OpenUpiAppButton from './OpenUpiAppButton';
import ContributionGuide from './ContributionGuide'; // Import the guide component

type Item = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  externalLink?: string | null;
  qrCode?: string;
  upiId?: string;
};

type Contribution = {
  name: string;
  amount: number;
  itemName: string;
  contributionId: string;
};

async function getGlobalUpiId(): Promise<string> {
  const globalConfigPath = path.join(process.cwd(), 'config', 'global.json');
  if (fs.existsSync(globalConfigPath)) {
    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));
    return globalConfig.globalUpiId;
  }
  return '';
}

async function getItemsData(): Promise<Item[]> {
  const itemsFile = path.join(process.cwd(), 'config', 'items.json');
  const itemsData: Item[] = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'));
  return itemsData;
}

async function getItemData(id: string): Promise<{ item: Item; totalContributed: number } | null> {
  const items = await getItemsData();
  const item = items.find((i) => i.id === id);
  if (!item) return null;

  const contributionsFile = path.join(process.cwd(), 'data', 'contributions.json');
  let contributionsData: Record<string, Contribution[]> = {};
  if (fs.existsSync(contributionsFile)) {
    contributionsData = JSON.parse(fs.readFileSync(contributionsFile, 'utf-8'));
  }

  const itemContributions = contributionsData[item.id] || [];
  const totalContributed = itemContributions.reduce((sum, c) => sum + c.amount, 0);
  return { item, totalContributed };
}

export async function generateStaticParams() {
  const items = await getItemsData();
  return items.map((item) => ({ id: item.id }));
}

export default async function ItemDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getItemData(id);
  if (!data) {
    return (
      <div className={styles.container}>
        <h2>Item not found</h2>
      </div>
    );
  }

  const { item, totalContributed } = data;
  const remaining = item.price - totalContributed;
  const isGifted = remaining <= 0;
  const qrCode = item.qrCode || '/qrcodes/global.png';

  // Get the UPI ID: item's upiId or globalUpiId
  const globalUpiId = await getGlobalUpiId();
  const upiId = item.upiId || globalUpiId;

  // Construct UPI Payment URL
  const openUpiAppUrl = `upi://pay?pa=${upiId}&pn=JeffRikta&cu=INR`;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back
      </Link>
      <h1>{item.name}</h1>
      <p className={styles.description}>{item.description}</p>
      {item.externalLink && (
        <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
          More Info
        </a>
      )}

      <div className={styles.imagesWrapper}>
        {item.images.map((img, idx) => (
          <img
            key={idx}
            src={`/images/${item.id}/${img}`}
            alt={`${item.name}-${idx}`}
            className={styles.itemImage}
          />
        ))}
      </div>

      <div className={styles.pricing}>
        <h2>Price: ₹{item.price}</h2>
        <p>Already Contributed: ₹{totalContributed}</p>
        {isGifted && (
          <h3 className={styles.soldOut}>
            This gift has already been graciously gifted. Thank you for your love and support!
          </h3>
        )}
      </div>

      {!isGifted && (
        <div className={styles.contributionSection}>
            <h4>
                Contribute (Remaining: <span className={styles.remainingAmount}>₹{remaining}</span>)
            </h4>
          {/* Guide with Information Icon */}
          <ContributionGuide />

          <p className={styles.upiPaymentText}>UPI Payment:</p>
          <img src={qrCode} alt="QR Code" className={styles.qrCode} />

          {/* Display UPI ID */}
          <p className={styles.upiId}>UPI ID: {upiId}</p>

          {/* Open UPI App Button */}
          <OpenUpiAppButton openUpiAppUrl={openUpiAppUrl} />

          <ContributionForm itemId={item.id} itemName={item.name} />
          <p className={styles.note}>
            Your contribution amount will not be disclosed to anyone else.
          </p>
        </div>
      )}
    </div>
  );
}
