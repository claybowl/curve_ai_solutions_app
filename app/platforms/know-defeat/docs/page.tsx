import { Metadata } from "next"
import { KnowDefeatDocs } from "./know-defeat-docs"

export const metadata: Metadata = {
  title: "Know-Defeat Documentation | Donjon Systems",
  description: "Know-Defeat algorithmic trading system documentation",
}

export default function KnowDefeatDocsPage() {
  return <KnowDefeatDocs />
}
