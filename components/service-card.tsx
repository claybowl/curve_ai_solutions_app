import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface ServiceCardProps {
  title: string
  description: string
  imageSrc: string
  href: string
}

export default function ServiceCard({ title, description, imageSrc, href }: ServiceCardProps) {
  return (
    <Card className="bg-white border-none shadow-elegant overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-playfair mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center text-navy-dark hover:text-burgundy transition-colors font-medium text-sm"
        >
          Learn More <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </CardContent>
    </Card>
  )
}
