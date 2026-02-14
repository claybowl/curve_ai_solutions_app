import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Know-Defeat Documentation | Donjon Systems",
  description: "Know-Defeat documentation and technical reference",
}

export default function KnowDefeatDocsPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="h-[calc(100vh-64px)] w-full">
        <iframe
          src="https://deepwiki.com/claybowl/Know-Defeat"
          className="w-full h-full border-0"
          title="Know-Defeat Documentation"
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; document-domain; encrypted-media; fullscreen; geolocation; gyroscope; layout-animations; legacy-image-formats; magnetometer; microphone; midi; monster; payment; picture-in-picture; publickey-credentials; sync-xhr; usb; vr; wake-lock; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  )
}
