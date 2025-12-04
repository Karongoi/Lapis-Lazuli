import crypto from "crypto"

export interface MpesaConfig {
    consumerKey: string
    consumerSecret: string
    shortCode: string
    passkey: string
    callbackUrl: string
    environment: "sandbox" | "production"
}

export interface STKPushRequest {
    phoneNumber: string
    amount: number
    accountReference: string
    description: string
}

export interface STKPushResponse {
    ResponseCode: string
    ResponseDescription: string
    MerchantRequestID: string
    CheckoutRequestID: string
}

function generateTimestamp(): string {
    return new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -3)
}

function generatePassword(
    shortCode: string,
    passkey: string,
    timestamp: string,
): string {
    const str = shortCode + passkey + timestamp
    return Buffer.from(str).toString("base64")
}

async function getAccessToken(
    consumerKey: string,
    consumerSecret: string,
    environment: "sandbox" | "production",
): Promise<string> {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")

    const url =
        environment === "sandbox"
            ? "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
            : "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to get M-Pesa access token")
    }

    const data = (await response.json()) as { access_token: string }
    return data.access_token
}

export async function initiateSTKPush(
    config: MpesaConfig,
    request: STKPushRequest,
): Promise<STKPushResponse> {
    try {
        const accessToken = await getAccessToken(
            config.consumerKey,
            config.consumerSecret,
            config.environment,
        )

        const timestamp = generateTimestamp()
        const password = generatePassword(config.shortCode, config.passkey, timestamp)

        const phone = request.phoneNumber.replace(/^0/, "254")
        const amount = Math.ceil(request.amount)

        const url =
            config.environment === "sandbox"
                ? "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
                : "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                BusinessShortCode: config.shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline", //CustomerBuyGoodsOnline - for till
                Amount: amount,
                PartyA: phone,
                PartyB: config.shortCode, //till number for tills
                PhoneNumber: phone,
                CallBackURL: config.callbackUrl,
                AccountReference: request.accountReference,
                TransactionDesc: request.description,
            }),
        })

        if (!response.ok) {
            throw new Error("Failed to initiate STK push")
        }

        const data = (await response.json()) as STKPushResponse
        return data
    } catch (error) {
        console.error("STK Push error:", error)
        throw error
    }
}

export function verifyMpesaCallback(signature: string, data: string, consumerSecret: string): boolean {
    const hash = crypto
        .createHmac("sha256", consumerSecret)
        .update(data)
        .digest("base64")
    return hash === signature
}
