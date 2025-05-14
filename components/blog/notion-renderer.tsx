"use client"

import { ExtendedRecordMap } from "notion-types"
import { NotionRenderer as NotionReactRenderer } from "react-notion-x"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

// Dynamic imports for components that use browser APIs
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
)
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
)

interface NotionRendererProps {
  recordMap: ExtendedRecordMap
}

export function NotionRenderer({ recordMap }: NotionRendererProps) {
  if (!recordMap) {
    return <div>Loading...</div>
  }

  return (
    <NotionReactRenderer
      recordMap={recordMap}
      components={{
        nextImage: Image,
        nextLink: Link,
        Code,
        Collection,
        Equation,
        Modal,
      }}
      fullPage={false}
      darkMode={false}
    />
  )
} 