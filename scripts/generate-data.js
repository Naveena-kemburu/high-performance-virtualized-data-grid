const fs = require('fs');
const path = require('path');

const TOTAL_ROWS = 1000000;
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'transactions.json');

const merchants = [
  'Amazon', 'Walmart', 'Target', 'Apple Store', 'Best Buy', 'Home Depot',
  'Costco', 'Starbucks', 'McDonald\'s', 'Whole Foods', 'TechCorp', 'DataMart',
  'ShopEasy', 'QuickBuy', 'MegaStore', 'FreshMarket', 'GadgetHub', 'FoodPlus'
];

const categories = [
  'Electronics', 'Groceries', 'Clothing', 'Home & Garden', 'Entertainment',
  'Dining', 'Transportation', 'Healthcare', 'Education', 'Utilities'
];

const statuses = ['Completed', 'Pending', 'Failed'];

const descriptions = [
  'Online purchase', 'In-store transaction', 'Subscription payment',
  'Refund processed', 'Monthly billing', 'One-time purchase',
  'Recurring payment', 'Gift card redemption', 'Promotional offer'
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTransaction(id) {
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date(2024, 11, 31);
  
  return {
    id,
    date: randomDate(startDate, endDate).toISOString(),
    merchant: randomItem(merchants),
    category: randomItem(categories),
    amount: parseFloat((Math.random() * 10000).toFixed(2)),
    status: randomItem(statuses),
    description: randomItem(descriptions)
  };
}

console.log('Generating 1,000,000 transaction records...');
console.time('Generation time');

const transactions = [];
for (let i = 0; i < TOTAL_ROWS; i++) {
  transactions.push(generateTransaction(i));
  
  if ((i + 1) % 100000 === 0) {
    console.log(`Generated ${i + 1} records...`);
  }
}

const dir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log('Writing to file...');
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(transactions));

console.timeEnd('Generation time');
console.log(`Successfully generated ${TOTAL_ROWS} records at ${OUTPUT_PATH}`);
console.log(`File size: ${(fs.statSync(OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB`);
