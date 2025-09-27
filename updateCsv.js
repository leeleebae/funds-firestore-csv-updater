import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function updateCsvData() {
  const url = "https://example.com/data.csv"; 
  const response = await fetch(url);
  const text = await response.text();
  const records = parse(text, { columns: true, skip_empty_lines: true });

  for (const row of records) {
    const id = row.Date + "_" + row.Ticker;
    const ref = db.collection("csvData").doc(id);

    const snapshot = await ref.get();
    if (snapshot.exists) {
      const existing = snapshot.data();
      if (
        existing.date === row.Date &&
        existing.ticker === row.Ticker &&
        existing.weight === row.Weight
      ) continue;
    }

    await ref.set({
      date: row.Date,
      ticker: row.Ticker,
      weight: row.Weight,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  console.log(`CSV 데이터 업데이트 완료`);
}

updateCsvData().catch(console.error);
