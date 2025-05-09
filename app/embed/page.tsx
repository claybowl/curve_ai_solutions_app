import Link from "next/link"

export default function EmbedPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-playfair mb-4">Embed Our Chat Widget</h1>
          <div className="w-24 h-px bg-gold mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            Add the Clean Machine Virtual Concierge to your website with a simple embed code.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-elegant mb-8">
          <h2 className="text-2xl font-playfair mb-4">How to Embed Our Chat Widget</h2>
          <p className="mb-6">
            To add the Clean Machine Virtual Concierge chat widget to your website, simply add the following script tag
            to your HTML, right before the closing <code className="bg-muted px-2 py-1 rounded">&lt;/body&gt;</code>{" "}
            tag:
          </p>

          <div className="bg-muted p-4 rounded-md mb-6 overflow-x-auto">
            <code>{`<script src="https://cleanmachinemobile.com/embed/chat-embed.js"></script>`}</code>
          </div>

          <p>
            That's it! The chat widget will automatically appear in the bottom-right corner of your website, allowing
            your visitors to interact with our Virtual Concierge.
          </p>
        </div>

        <div className="bg-ivory/50 border-l-4 border-gold p-6 rounded-r-lg mb-8">
          <h3 className="text-xl font-playfair mb-2">Important Notes</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>The chat widget is designed to be responsive and will work on both desktop and mobile devices.</li>
            <li>All chat conversations are processed through our secure API.</li>
            <li>The widget is styled to match Clean Machine's branding but can be customized upon request.</li>
            <li>For any technical issues or customization requests, please contact our support team.</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="mb-4">Want to see it in action? Check out our example page:</p>
          <Link
            href="/embed/example"
            className="inline-block bg-navy-dark text-ivory px-6 py-3 rounded-md hover:bg-navy-dark/90 transition-colors"
          >
            View Live Demo
          </Link>
        </div>
      </div>
    </div>
  )
}
