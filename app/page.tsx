import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

type Item = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  externalLink?: string | null;
  qrCode?: string;
  totalContributed?: number;
};

async function getData(): Promise<Item[]> {
  const itemsFile = path.join(process.cwd(), 'config', 'items.json');
  const contributionsFile = path.join(process.cwd(), 'data', 'contributions.json');

  const itemsData: Item[] = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'));
  let contributionsData: Record<string, {name: string; amount: number; itemName:string; contributionId:string;}[]> = {};
  if (fs.existsSync(contributionsFile)) {
    contributionsData = JSON.parse(fs.readFileSync(contributionsFile, 'utf-8'));
  }

  return itemsData.map(item => {
    const itemContributions = contributionsData[item.id] || [];
    const totalContributed = itemContributions.reduce((sum, c) => sum + c.amount, 0);
    return { ...item, totalContributed };
  });
}

export default async function HomePage() {
  const items = await getData();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Jeff & Rikta</h1>
        <p style={{fontSize:'1rem', margin:'5px 0'}}>December 27th</p>
        <p className={styles.subheader}>Celebrate love by contributing to these cherished gifts</p>
        <p className={styles.verse}>“The Lord has done great things for us; we are glad.”<br/>- Psalms 126:3 (ESV)</p>
      </header>

      <div className={styles.grid}>
        {items.map(item => (
          <Link key={item.id} href={`/items/${item.id}`}>
            <div className={styles.card}>
              <img src={`/images/${item.id}/${item.images[0]}`} alt={item.name}/>
              <h2>{item.name}</h2>
              <div className={styles.priceInfo}>
                <p><strong>Total:</strong> ₹{item.price}</p>
                <p><strong>Contributed:</strong> ₹{item.totalContributed}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
