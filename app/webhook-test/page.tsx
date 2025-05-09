import DirectWebhookTest from "@/components/direct-webhook-test"

export default function WebhookTestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Direct Webhook Testing Tool</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Use this tool to test the webhook directly and determine the correct format.
      </p>
      <DirectWebhookTest />
    </div>
  )
}
