import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import admin from "firebase-admin";

// 서비스 계정 키 (GitHub Secrets에서 불러오기)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function updateCsvData() {
  const url = "import fetch from "node-fetch";
import { parse } from "csv-parse/sync";
import admin from "firebase-admin";

// 서비스 계정 키 (GitHub Secrets에서 불러오기)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

async function updateCsvData() {
  const url = "https://example.com/data.csv";  // 원하는 CSV URL
  const response = await fetch(url);
  const text = await response.text();

  // CSV 파싱 (헤더 기준)
  const records = parse(text, { columns: true, skip_empty_lines: true });

  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of records) {
    const id = row.Date + "_" + row.Ticker; // 문서 ID (고유키)
    const ref = db.collection("csvData").doc(id);

    const snapshot = await ref.get();
    if (snapshot.exists) {
      const existing = snapshot.data();

      // 기존 값과 비교
      if (
        existing.date === row.Date &&
        existing.ticker === row.Ticker &&
        existing.weight === row.Weight
      ) {
        skippedCount++;
        continue; // 값이 같으면 저장하지 않음
      }
    }

    // 값이 다르거나 신규면 업데이트
    await ref.set({
      date: row.Date,
      ticker: row.Ticker,
      weight: row.Weight,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    updatedCount++;
  }

  console.log(`✅ 업데이트 ${updatedCount}건, 스킵 ${skippedCount}건`);
}

updateCsvData().catch(console.error);
";  // 원하는 CSV URL
  const response = await fetch(url);
  const text = await response.text();

  // CSV 파싱 (헤더 기준)
  const records = parse(text, { columns: true, skip_empty_lines: true });

  let updatedCount = 0;
  let skippedCount = 0;

  for (const row of records) {
    const id = row.Date + "_" + row.Ticker; // 문서 ID (고유키)
    const ref = db.collection("csvData").doc(id);

    const snapshot = await ref.get();
    if (snapshot.exists) {
      const existing = snapshot.data();

      // 기존 값과 비교
      if (
        existing.date === row.Date &&
        existing.ticker === row.Ticker &&
        existing.weight === row.Weight
      ) {
        skippedCount++;
        continue; // 값이 같으면 저장하지 않음
      }
    }

    // 값이 다르거나 신규면 업데이트
    await ref.set({
      date: row.Date,
      ticker: row.Ticker,
      weight: row.Weight,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    updatedCount++;
  }

  console.log(`✅ 업데이트 ${updatedCount}건, 스킵 ${skippedCount}건`);
}

updateCsvData().catch(console.error);
