import {
  ShieldCheck,
  QrCode,
  Lock,
  IdCard,
  Clock,
  Users
} from "lucide-react"

export const securityData = [
  {
    title: "Admin Verification",
    description:
      "Every found item listing is manually reviewed and verified by our trained admin team before going live, ensuring authenticity and preventing fraud.",
    icon: ShieldCheck
  },
  {
    title: "QR Code Authentication",
    description:
      "Unique QR codes are generated for each item, allowing secure verification during handoff without sharing personal contact information prematurely.",
    icon: QrCode
  },
  {
    title: "Privacy Protection",
    description:
      "Your personal details remain private until you choose to connect. We use end-to-end encryption for all communications between finders and owners.",
    icon: Lock
  },
  {
    title: "Identity Verification",
    description:
      "Optional identity verification for high-value items adds an extra layer of security, with government ID checks and photo verification.",
    icon: IdCard
  },
  {
    title: "24/7 Monitoring",
    description:
      "Our AI-powered fraud detection system monitors all activities in real-time, flagging suspicious behavior and protecting community members.",
    icon: Clock
  },
  {
    title: "Community Trust Score",
    description:
      "Members earn trust scores based on successful reunions, verified identity, and community feedback, helping you identify reliable helpers.",
    icon: Users
  }
]