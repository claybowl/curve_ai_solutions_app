import ApiTest from "@/components/api-test"

export default function ApiTestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">API Testing Tool</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Use this tool to test the chat API directly and see the raw request and response.
      </p>
      <ApiTest />
    </div>
  )
}
