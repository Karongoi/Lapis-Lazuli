# M-Pesa Daraja Integration Setup

## Required Environment Variables

Add the following environment variables:

### M-Pesa Configuration
- `MPESA_CONSUMER_KEY` - Your M-Pesa application consumer key from Safaricom Daraja portal
- `MPESA_CONSUMER_SECRET` - Your M-Pesa application consumer secret
- `MPESA_SHORT_CODE` - Your M-Pesa merchant short code (default: 174379 for sandbox)
- `MPESA_PASSKEY` - Your M-Pesa passkey for STK Push
- `MPESA_ENVIRONMENT` - Either `sandbox` or `production`
- `NEXT_PUBLIC_URL` - Your application base URL (e.g., https://yourdomain.com)

## Getting M-Pesa Daraja Credentials

1. Visit [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Sign up for a free developer account
3. Create a new app and select "Lipa Na M-Pesa Online" API
4. You'll receive:
   - Consumer Key
   - Consumer Secret
   - Business Shortcode
   - Passkey

## Testing in Sandbox

Use test phone number: `0712345678`

The sandbox will simulate the payment flow without charging actual M-Pesa accounts.

## Callback URL

The callback URL for M-Pesa payment notifications is automatically set to:
\`\`\`
{NEXT_PUBLIC_URL}/api/payments/mpesa/callback
\`\`\`

Make sure this URL is added to your M-Pesa app settings in the Daraja portal.

## Flow

1. User fills billing form → enters phone number
2. Clicks "Complete Payment" with M-Pesa selected
3. STK Push prompt appears on their phone
4. They enter M-Pesa PIN
5. Payment status is updated via callback
6. Order status changes to "paid" on success
