import { Shield, Lock, UserCheck, EyeOff, FileText, CheckCircle } from "lucide-react";

export const securityData = [
    {
        title: "Data Privacy",
        description: "Your personal information is encrypted and only shared with the other party once a match is confirmed and verified.",
        icon: Lock,
    },
    {
        title: "Verified Community",
        description: "All users must be verified members of the institution, ensuring a trustworthy environment for everyone.",
        icon: UserCheck,
    },
    {
        title: "Safe Handovers",
        description: "Our QR-based handover system logs every transaction, making the recovery process transparent and secure.",
        icon: Shield,
    },
    {
        title: "Identity Protection",
        description: "Keep your identity private. Only share contact details when you feel comfortable and a match is highly probable.",
        icon: EyeOff,
    },
    {
        title: "Admin Verification",
        description: "High-value items go through an extra layer of admin verification to prevent fraudulent claims.",
        icon: FileText,
    },
    {
        title: "Trust System",
        description: "Our reputation system tracks successful returns, building a community of trusted finders and owners.",
        icon: CheckCircle,
    },
];