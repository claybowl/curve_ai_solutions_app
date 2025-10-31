# Stripe Products Sync Script

This script automatically syncs all your products from the codebase to Stripe, creating products, prices, and payment links.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Get your Stripe API key:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Secret Key** (starts with `sk_`)
   - For testing, use the **Test** key (starts with `sk_test_`)

3. **Add to environment variables:**
   Create or update `.env.local` in the project root:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```

## Usage

Run the sync script:
```bash
npm run sync-stripe
# or
pnpm sync-stripe
```

## What It Does

The script will:
1. ✅ Create products in Stripe for all your offerings
2. ✅ Create prices (one-time or recurring subscriptions)
3. ✅ Generate payment links automatically
4. ✅ Output all product IDs and checkout URLs

## Products Synced

### ServicePro Tiers
- ServicePro Starter ($49/mo)
- ServicePro Professional ($149/mo)
- ServicePro Enterprise ($299/mo)

### Donjon Tiers
- Donjon Starter ($149/mo)
- Donjon Pro ($399/mo)
- Donjon Business ($899/mo)
- Donjon Enterprise (Custom - contact for quote)
- Donjon Launch Pilot ($2,500 one-time)

### Donjon Modules
- Q&A Console ($99/mo)
- Knowledge Studio ($249/mo)
- Support Copilot ($349/mo)
- Sales Writer ($299/mo)
- Research Agent ($399/mo)
- Ops Automator ($449/mo)
- Private Edge ($1,250/mo + setup)

### Custom Packages
- Quick Start Custom ($2,500 + $99/mo)
- Professional Custom ($8,500 + $199/mo)

### Individual Tools
- AI Chatbot ($49/mo or $499/yr)
- Booking System ($39/mo or $399/yr)
- Simple CRM ($59/mo or $599/yr)
- Analytics ($29/mo or $299/yr)

## After Running

1. **Review in Stripe Dashboard:** Check that all products were created correctly
2. **Update checkout URLs:** Copy the payment link URLs from the script output and update your code
3. **Test:** Use Stripe test cards to verify checkout flows
4. **Production:** When ready, switch to live mode by using your live Stripe key

## Custom Pricing Products

Products with custom pricing (like Donjon Enterprise) won't be created automatically. You'll need to:
1. Create them manually in Stripe Dashboard, OR
2. Update the script to handle custom pricing logic

## Safety

- The script is **idempotent** - safe to run multiple times
- It checks for existing products before creating
- Uses rate limiting to avoid Stripe API limits
- All operations are logged for visibility

## Troubleshooting

**"STRIPE_SECRET_KEY not found"**
- Make sure `.env.local` exists in the project root
- Verify the key starts with `sk_` (or `sk_test_` for test mode)

**"Resource already exists"**
- This is normal - the script skips existing products
- Check Stripe Dashboard to verify the product exists

**Rate limiting errors**
- The script includes delays, but if you get rate limited:
  - Wait a few minutes and try again
  - Or reduce the number of products in the script

## Updating Products

To update product information:
1. Edit the product data in `scripts/sync-stripe-products.js`
2. Update products manually in Stripe Dashboard, OR
3. Use Stripe API to update existing products (script can be extended)

## Payment Links vs Checkout Sessions

The script creates Payment Links by default. If you prefer Checkout Sessions (more control), you can:
- Modify the script to create Checkout Sessions instead
- Or use Checkout Sessions dynamically in your API routes

