import clientPromise from "./src/lib/mongodb";
import { ObjectId } from "mongodb";

async function debugTokens() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    console.log("Checking accounts collection...");
    const accounts = await db.collection("accounts").find({}).toArray();
    
    console.log(`Total accounts found: ${accounts.length}`);
    
    accounts.forEach(acc => {
      console.log("--- Account Info ---");
      console.log(`Provider: ${acc.provider}`);
      console.log(`userId type: ${typeof acc.userId}`);
      console.log(`userId value: ${acc.userId.toString()}`);
      console.log(`Has Refresh Token: ${!!acc.refresh_token}`);
      console.log(`Scope: ${acc.scope}`);
      console.log("--------------------");
    });

  } catch (error) {
    console.error("Debug failed:", error);
  } finally {
    process.exit(0);
  }
}

debugTokens();
