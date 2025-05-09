import Image from "next/image"

interface QRCodeDisplayProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function QRCodeDisplay({ className = "", size = "md" }: QRCodeDisplayProps) {
  const sizeClasses = {
    sm: "max-w-[150px]",
    md: "max-w-xs",
    lg: "max-w-sm",
  }

  return (
    <div className={`bg-[#6366F1] p-6 rounded-xl shadow-lg ${sizeClasses[size]} ${className}`}>
      <Image
        src="/images/supporter-qr-code.png"
        alt="Donation QR Code"
        width={300}
        height={300}
        className="w-full h-auto"
      />
      <p className="text-white text-center text-xl mt-4 font-medium">Scan to donate</p>
      <p className="text-white/80 text-center text-sm mt-1">
        Or visit:{" "}
        <a
          href="https://buy.stripe.com/00gcN2ctT5Xw4cE004"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          buy.stripe.com
        </a>
      </p>
    </div>
  )
}
