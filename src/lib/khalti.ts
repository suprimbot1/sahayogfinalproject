/**
 * Khalti Payment Gateway Utility
 * Handles Rs -> Paisa conversion and API communication with Khalti V2.
 */

const KHALTI_API_URL = "https://a.khalti.com/api/v2";
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "test_secret_key_6ed1976092494ec28205632128a39aab";

interface KhaltiInitiateParams {
  amount: number; // in Rupees
  purchase_order_id: string;
  purchase_order_name: string;
  return_url: string;
  website_url: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function initiateKhaltiPayment(params: KhaltiInitiateParams) {
  const payload = {
    return_url: params.return_url,
    website_url: params.website_url,
    amount: Math.round(params.amount * 100), // Convert Rs to Paisa
    purchase_order_id: params.purchase_order_id,
    purchase_order_name: params.purchase_order_name,
    customer_info: params.customer_info,
  };

  const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[Khalti Initiate Error]", data);
    throw new Error(data.detail || "Failed to initiate Khalti payment");
  }

  return data; // { pidx, payment_url, expires_at, expires_in }
}

export async function verifyKhaltiPayment(pidx: string) {
  const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
    method: "POST",
    headers: {
      Authorization: `Key ${KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[Khalti Verify Error]", data);
    throw new Error(data.detail || "Failed to verify Khalti payment");
  }

  return data; // { pidx, total_amount, status, transaction_id, fee, refund_id }
}
