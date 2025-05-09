import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  variant?: "dark" | "light"
  size?: "small" | "medium" | "large"
  linkWrapper?: boolean
}

export default function Logo({ variant = "dark", size = "medium", linkWrapper = true }: LogoProps) {
  const isLight = variant === "light"

  // Size classes
  const sizeClasses = {
    small: "h-12 w-auto",
    medium: "h-16 w-auto",
    large: "h-32 w-auto",
  }

  const LogoContent = (
    <div className="flex flex-col items-center">
      <Image
        src="/images/clean-machine-logo.png"
        alt="Clean Machine Mobile Auto Detail Logo"
        width={size === "large" ? 300 : size === "medium" ? 180 : 120}
        height={size === "large" ? 200 : size === "medium" ? 120 : 80}
        className={`${sizeClasses[size]} ${isLight ? "brightness-0 invert" : ""}`}
        priority={size === "large"}
      />
    </div>
  )

  // Return with or without link wrapper based on prop
  return linkWrapper ? <Link href="/">{LogoContent}</Link> : LogoContent
}
