export default function EmbedExamplePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-playfair mb-4">Chat Widget Demo</h1>
          <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            This page demonstrates the Clean Machine Virtual Concierge chat widget in action.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-elegant mb-8">
          <h2 className="text-2xl font-playfair mb-4">Try It Out</h2>
          <p className="mb-6">
            Click the chat icon in the bottom-right corner of this page to open the chat widget and interact with our
            Virtual Concierge.
          </p>

          <p className="mb-4">You can ask questions about:</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Our detailing services and pricing</li>
            <li>Scheduling an appointment</li>
            <li>Our service area</li>
            <li>Payment options</li>
            <li>And more!</li>
          </ul>

          <p>
            The chat widget is powered by the same AI system that runs our main website chat, providing consistent
            responses across all platforms.
          </p>
        </div>

        <div className="text-center">
          <p className="mb-4">Ready to add this to your own website?</p>
          <a
            href="/embed"
            className="inline-block bg-navy-dark text-ivory px-6 py-3 rounded-md hover:bg-navy-dark/90 transition-colors"
          >
            Get the Embed Code
          </a>
        </div>
      </div>

      {/* Include the chat widget script */}
      <script src="/embed/chat-embed.js" async></script>
    </div>
  )
}
