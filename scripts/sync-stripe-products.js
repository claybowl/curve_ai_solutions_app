#!/usr/bin/env node

/**
 * Stripe Products Sync Script
 * 
 * This script syncs all products from your codebase to Stripe.
 * It creates products, prices, and optionally payment links.
 * 
 * Usage:
 *   1. Set STRIPE_SECRET_KEY in your .env.local file
 *   2. Run: npm run sync-stripe
 * 
 * The script is idempotent - safe to run multiple times.
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

// Color output for terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Initialize Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
  log('❌ ERROR: STRIPE_SECRET_KEY not found in environment variables', 'red')
  log('   Please add STRIPE_SECRET_KEY to your .env.local file', 'yellow')
  process.exit(1)
}

const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' })

// Product data extracted from your codebase
const products = [
  // ServicePro Tiers
  {
    category: 'servicepro',
    name: 'ServicePro Starter',
    description: 'Ready-to-use AI customer service platform. Start automating today.',
    price: 49,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      tier: 'starter',
      tagline: 'For Solo Operators & Small Teams',
    },
  },
  {
    category: 'servicepro',
    name: 'ServicePro Professional',
    description: 'Complete AI platform for growing service businesses',
    price: 149,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      tier: 'professional',
      tagline: 'Most Popular',
      highlighted: 'true',
    },
  },
  {
    category: 'servicepro',
    name: 'ServicePro Enterprise',
    description: 'Full platform for established multi-location operations',
    price: 299,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      tier: 'enterprise',
      tagline: 'Multi-Location Ready',
    },
  },
  
  // Donjon Tiers
  {
    category: 'donjon-tier',
    name: 'Donjon Starter',
    description: 'Get started with AI-powered knowledge and Q&A for your documents. Perfect for teams who want faster answers without the complexity.',
    price: 149,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      tier: 'starter',
      tagline: 'Get Smart, Fast',
    },
  },
  {
    category: 'donjon-tier',
    name: 'Donjon Pro',
    description: 'Move beyond Q&A to actual automation. Deploy agents that draft, summarize, and update—giving your team hours back each week.',
    price: 399,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      tier: 'pro',
      tagline: 'Agents That Do Real Work',
      highlighted: 'true',
    },
  },
  {
    category: 'donjon-tier',
    name: 'Donjon Business',
    description: 'Complete automation platform with integrations and multi-agent orchestration. Automate workflows across your entire organization.',
    price: 899,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      tier: 'business',
      tagline: 'Knowledge + Ops Automation',
    },
  },
  {
    category: 'donjon-tier',
    name: 'Donjon Enterprise',
    description: 'Enterprise-grade security and control with private deployments. Scale AI agents across departments with full governance.',
    price: null, // Custom pricing
    recurring: null,
    metadata: {
      type: 'custom',
      tier: 'enterprise',
      tagline: 'Your Private Intelligence Layer',
      note: 'Custom annual pricing - contact for quote',
    },
  },
  {
    category: 'donjon-tier',
    name: 'Donjon Launch Pilot',
    description: 'Test Donjon on your real workflows with a fixed-price pilot. Get production-ready agents configured and measurable ROI before committing to a subscription.',
    price: 2500,
    recurring: null, // One-time
    metadata: {
      type: 'one-time',
      tier: 'pilot',
      tagline: 'Prove Value in 14 Days',
    },
  },
  
  // Donjon Modules
  {
    category: 'donjon-module',
    name: 'Donjon Q&A Console',
    description: 'A secure AI answer box trained on your docs. Perfect for adding instant answers to your website or internal knowledge base.',
    price: 99,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'qa-console',
    },
  },
  {
    category: 'donjon-module',
    name: 'Donjon Knowledge Studio',
    description: 'Turn files and links into an intelligent, searchable knowledge base. Build a central source of truth for your team.',
    price: 249,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'knowledge-studio',
    },
  },
  {
    category: 'donjon-module',
    name: 'Donjon Support Copilot',
    description: 'An AI teammate that answers customer questions from your policies and help docs. Reduce support ticket volume and improve response times.',
    price: 349,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'support-copilot',
    },
  },
  {
    category: 'donjon-module',
    name: 'Donjon Sales Writer',
    description: 'An AI content partner for outbound and follow-ups. Generate personalized sequences and consistent messaging at scale.',
    price: 299,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'sales-writer',
    },
  },
  {
    category: 'donjon-module',
    name: 'Donjon Research Agent',
    description: 'Deep-dive synthesis across PDFs, web pages, and notes. Surface relationships and insights across your research materials.',
    price: 399,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'research-agent',
    },
  },
  {
    category: 'donjon-module',
    name: 'Donjon Ops Automator',
    description: 'Triggered agents that tag, route, summarize, and update systems. Automate routine workflows and handoffs between teams.',
    price: 449,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'ops-automator',
    },
  },
  {
    category: 'donjon-module',
    name: 'Donjon Private Edge',
    description: 'A private deployment of Donjon for security-sensitive teams. Self-hosted or VPC deployment with enterprise controls.',
    price: 1250,
    recurring: 'month',
    metadata: {
      type: 'subscription',
      module: 'private-edge',
      note: 'Plus setup fee - contact for details',
    },
  },
  
  // Custom Packages
  {
    category: 'custom',
    name: 'Quick Start Custom',
    description: 'Custom chatbot and automation built for your specific needs. Includes setup fee and $99/month ongoing.',
    price: 2500,
    recurring: null,
    monthlyFee: 99,
    metadata: {
      type: 'custom',
      tagline: 'Affordable Custom Setup',
      timeline: '2-3 weeks',
    },
  },
  {
    category: 'custom',
    name: 'Professional Custom',
    description: 'Complete custom implementation with advanced features. Includes setup fee and $199/month ongoing.',
    price: 8500,
    recurring: null,
    monthlyFee: 199,
    metadata: {
      type: 'custom',
      tagline: 'Full Custom Build',
      timeline: '4-6 weeks',
    },
  },
  
  // Individual Tools (A la carte)
  {
    category: 'individual-tool',
    name: 'AI Chatbot',
    description: '24/7 lead capture, FAQs, warm hand-offs to your team',
    price: 49,
    recurring: 'month',
    alternativePrice: { oneTime: 499, period: 'year' },
    metadata: {
      type: 'subscription',
      tool: 'chatbot',
    },
  },
  {
    category: 'individual-tool',
    name: 'Booking System',
    description: 'Self-serve scheduling, reminders, calendar sync, deposits',
    price: 39,
    recurring: 'month',
    alternativePrice: { oneTime: 399, period: 'year' },
    metadata: {
      type: 'subscription',
      tool: 'booking',
    },
  },
  {
    category: 'individual-tool',
    name: 'Simple CRM',
    description: 'Pipeline tracking, customer notes, follow-up sequences',
    price: 59,
    recurring: 'month',
    alternativePrice: { oneTime: 599, period: 'year' },
    metadata: {
      type: 'subscription',
      tool: 'crm',
    },
  },
  {
    category: 'individual-tool',
    name: 'Analytics',
    description: 'Dashboards for leads, bookings, revenue, and campaign ROI',
    price: 29,
    recurring: 'month',
    alternativePrice: { oneTime: 299, period: 'year' },
    metadata: {
      type: 'subscription',
      tool: 'analytics',
    },
  },
]

// Helper function to create a Stripe product
async function createOrUpdateProduct(productData) {
  try {
    // Clean metadata - ensure all values are strings and remove alternativePrice
    const cleanMetadata = {}
    if (productData.metadata) {
      for (const [key, value] of Object.entries(productData.metadata)) {
        if (key !== 'alternativePrice' && typeof value === 'string') {
          cleanMetadata[key] = value
        } else if (key !== 'alternativePrice' && typeof value !== 'object') {
          cleanMetadata[key] = String(value)
        }
      }
    }
    
    // Create product
    const product = await stripe.products.create({
      name: productData.name,
      description: productData.description,
      metadata: cleanMetadata,
      active: true,
    })
    
    log(`✓ Created product: ${productData.name} (${product.id})`, 'green')
    
    const prices = []
    
    // Create recurring price if applicable
    if (productData.recurring) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.price * 100, // Convert to cents
        currency: 'usd',
        recurring: {
          interval: productData.recurring,
        },
        metadata: {
          type: 'subscription',
          ...cleanMetadata,
        },
      })
      prices.push(price)
      log(`  → Created ${productData.recurring}ly price: $${productData.price} (${price.id})`, 'cyan')
    }
    
    // Create one-time price if applicable
    if (!productData.recurring && productData.price) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.price * 100,
        currency: 'usd',
        metadata: {
          type: 'one-time',
          ...cleanMetadata,
        },
      })
      prices.push(price)
      log(`  → Created one-time price: $${productData.price} (${price.id})`, 'cyan')
    }
    
    // Create alternative yearly price if applicable
    if (productData.alternativePrice) {
      const altPrice = productData.alternativePrice
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: altPrice.oneTime * 100,
        currency: 'usd',
        recurring: {
          interval: altPrice.period === 'year' ? 'year' : 'month',
        },
        metadata: {
          type: 'subscription',
          alternative: 'true',
          ...cleanMetadata,
        },
      })
      prices.push(price)
      log(`  → Created alternative ${altPrice.period}ly price: $${altPrice.oneTime} (${price.id})`, 'cyan')
    }
    
    // Create monthly fee price for custom packages if applicable
    if (productData.monthlyFee) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.monthlyFee * 100,
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          type: 'subscription',
          feeType: 'monthly-maintenance',
          ...cleanMetadata,
        },
      })
      prices.push(price)
      log(`  → Created monthly maintenance fee: $${productData.monthlyFee}/mo (${price.id})`, 'cyan')
    }
    
    // Create payment link (optional - you can disable this if you prefer checkout sessions)
    let paymentLink = null
    if (prices.length > 0 && productData.price) {
      try {
        paymentLink = await stripe.paymentLinks.create({
          line_items: [
            {
              price: prices[0].id,
              quantity: 1,
            },
          ],
          metadata: {
            productName: productData.name,
            productId: product.id,
          },
        })
        log(`  → Created payment link: ${paymentLink.url}`, 'blue')
      } catch (error) {
        log(`  ⚠ Could not create payment link: ${error.message}`, 'yellow')
      }
    }
    
    return {
      product,
      prices,
      paymentLink,
    }
  } catch (error) {
    if (error.code === 'resource_already_exists') {
      log(`⚠ Product "${productData.name}" already exists. Skipping...`, 'yellow')
      return null
    }
    throw error
  }
}

// Main sync function
async function syncProducts() {
  log('\n🚀 Starting Stripe Products Sync...\n', 'blue')
  
  const results = {
    products: [],
    errors: [],
  }
  
  for (const productData of products) {
    try {
      if (!productData.price && productData.category !== 'donjon-tier') {
        log(`⊘ Skipping "${productData.name}" - custom pricing requires manual setup`, 'yellow')
        continue
      }
      
      const result = await createOrUpdateProduct(productData)
      
      if (result) {
        results.products.push({
          name: productData.name,
          productId: result.product.id,
          prices: result.prices.map(p => ({
            id: p.id,
            amount: p.unit_amount / 100,
            recurring: p.recurring,
          })),
          paymentLink: result.paymentLink ? result.paymentLink.url : null,
        })
      }
      
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      log(`❌ Error creating "${productData.name}": ${error.message}`, 'red')
      results.errors.push({
        name: productData.name,
        error: error.message,
      })
    }
  }
  
  // Summary
  log('\n' + '='.repeat(60), 'blue')
  log('📊 SYNC SUMMARY', 'blue')
  log('='.repeat(60), 'blue')
  log(`✓ Products created: ${results.products.length}`, 'green')
  log(`❌ Errors: ${results.errors.length}`, results.errors.length > 0 ? 'red' : 'green')
  
  if (results.errors.length > 0) {
    log('\nErrors:', 'red')
    results.errors.forEach(err => {
      log(`  - ${err.name}: ${err.error}`, 'red')
    })
  }
  
  // Output results JSON
  log('\n📋 Product IDs and Payment Links:', 'blue')
  log(JSON.stringify(results, null, 2), 'cyan')
  
  log('\n✨ Sync complete!', 'green')
  log('\n💡 Next steps:', 'yellow')
  log('  1. Review products in Stripe Dashboard', 'yellow')
  log('  2. Update your checkoutUrl values in code with the payment links above', 'yellow')
  log('  3. Test checkout flows with Stripe test cards', 'yellow')
  log('  4. For custom pricing products, create payment links manually or via API\n', 'yellow')
  
  return results
}

// Run the sync
syncProducts()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  })
