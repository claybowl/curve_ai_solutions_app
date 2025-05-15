"use client"

import { ExtendedRecordMap } from "notion-types"
import { NotionRenderer as NotionReactRenderer } from "react-notion-x"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"

// Import styles needed for proper rendering
import 'react-notion-x/src/styles.css'
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

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
  recordMap?: ExtendedRecordMap
}

export function NotionRenderer({ recordMap }: NotionRendererProps) {
  if (!recordMap || !Object.keys(recordMap).length) {
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Content could not be loaded. Please try again later.
        </p>
      </div>
    )
  }

  try {
    return (
      <div className="notion-renderer">
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
          previewImages={true}
          showCollectionViewDropdown={false}
          showTableOfContents={false}
          minTableOfContentsItems={3}
          disableHeader={true}
          className="notion-container"
        />
      </div>
    )
  } catch (error) {
    console.error("Error rendering Notion content:", error)
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-center text-gray-500 dark:text-gray-400">
          There was an error displaying this content.
        </p>
      </div>
    )
  }
} 