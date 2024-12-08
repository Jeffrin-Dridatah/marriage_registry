import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

type Contribution = { name: string; amount: number; itemName:string; contributionId:string; };
type Item = { id: string; price: number };

export async function POST(request: Request) {
  const { itemId, name, amount, itemName } = await request.json() as { itemId: string; name: string; amount: number; itemName:string; };

  if (!itemId || !amount || isNaN(amount)) {
    return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });
  }

  const itemsFile = path.join(process.cwd(), 'config', 'items.json');
  const contributionsFile = path.join(process.cwd(), 'data', 'contributions.json');

  const itemsData: Item[] = JSON.parse(fs.readFileSync(itemsFile, 'utf-8'));
  const item = itemsData.find(i => i.id === itemId);
  if (!item) {
    return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
  }

  let contributionsData: Record<string, Contribution[]> = {};
  if (fs.existsSync(contributionsFile)) {
    contributionsData = JSON.parse(fs.readFileSync(contributionsFile, 'utf-8'));
  }

  const itemContributions = contributionsData[itemId] || [];
  const totalContributed = itemContributions.reduce((sum, c) => sum + c.amount, 0);

  if (totalContributed >= item.price) {
    return NextResponse.json({ error: 'Item is fully funded.' }, { status: 400 });
  }

  const newTotal = totalContributed + amount;
  if (newTotal > item.price) {
    return NextResponse.json({ error: 'Contribution exceeds the required amount.' }, { status: 400 });
  }

  const contributionId = randomUUID();
  const newContribution: Contribution = { name, amount, itemName, contributionId };
  if (!contributionsData[itemId]) {
    contributionsData[itemId] = [];
  }
  contributionsData[itemId].push(newContribution);

  fs.writeFileSync(contributionsFile, JSON.stringify(contributionsData, null, 2));

  return NextResponse.json({ message: 'Contribution recorded successfully.', contributionId }, { status: 200 });
}
