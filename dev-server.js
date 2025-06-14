// Quick dev server script to bypass potential issues
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

console.log('🚀 Starting optimized dev server...')

// Create Next.js app with minimal config
const app = next({ 
  dev, 
  hostname, 
  port,
  // Minimal config for faster startup
  turbo: false,
  quiet: false
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  console.log('✅ Next.js app prepared')
  
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error('❌ Server error:', err)
    process.exit(1)
  })
  .listen(port, (err) => {
    if (err) throw err
    console.log(`🎉 Ready on http://${hostname}:${port}`)
  })
}).catch((ex) => {
  console.error('❌ Failed to start server:', ex)
  process.exit(1)
})