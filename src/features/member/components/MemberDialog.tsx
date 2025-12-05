import { User as UserIcon } from "lucide-react";
import { ReactNode } from "react";
import type { User } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FaRegEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
} from "react-icons/fa6";

interface SocialMediaData {
  mail?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  telegram?: string | null;
}

interface SocialLinkConfig {
  id: string;
  value?: string | null;
  href: string;
  icon: ReactNode;
  label: string;
  color: string;
}

const SocialMediaList = ({ socialMedia }: { socialMedia: SocialMediaData }) => {
  const socialLinks: SocialLinkConfig[] = [
    {
      id: "mail",
      value: socialMedia.mail,
      href: `mailto:${socialMedia.mail}`,
      icon: <FaRegEnvelope className="text-xl" />,
      label: socialMedia.mail || "Email",
      color: "hover:text-red-500",
    },
    {
      id: "whatsapp",
      value: socialMedia.whatsapp,
      href: `https://wa.me/${socialMedia.whatsapp}`,
      icon: <FaWhatsapp className="text-xl" />,
      label: socialMedia.whatsapp || "WhatsApp",
      color: "hover:text-green-500",
    },
    {
      id: "instagram",
      value: socialMedia.instagram,
      href: `https://www.instagram.com/${socialMedia.instagram}`,
      icon: <FaInstagram className="text-xl" />,
      label: `${socialMedia.instagram}`,
      color: "hover:text-pink-600",
    },
    {
      id: "linkedin",
      value: socialMedia.linkedin,
      href: `https://www.linkedin.com/in/${socialMedia.linkedin}`,
      icon: <FaLinkedin className="text-xl" />,
      label: socialMedia.linkedin || "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      id: "telegram",
      value: socialMedia.telegram,
      href: `https://t.me/${socialMedia.telegram}`,
      icon: <FaTelegram className="text-xl" />,
      label: socialMedia.telegram || "Telegram",
      color: "hover:text-sky-500",
    },
  ];

  return (
    <div className="flex flex-row space-x-2">
      {socialLinks.map((item) => {
        if (!item.value) return null;

        return (
          <a
            key={item.id}
            href={item.href}
            target={item.id === "mail" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className={`
              group relative flex items-center justify-center 
              transition-all duration-300 ease-in-out
              hover:scale-110 
              text-gray-600 ${item.color}
            `}
          >
            {item.icon}

            <span
              className="
              absolute bottom-full mb-2 hidden w-max px-2 py-1
              bg-gray-800 text-white text-xs rounded-md shadow-lg
              group-hover:block z-50
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              left-1/2 -translate-x-1/2 whitespace-nowrap
            "
            >
              {item.label}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></span>
            </span>
          </a>
        );
      })}
    </div>
  );
};

interface MemberDetailDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberDetailDialog({
  user,
  isOpen,
  onClose,
}: MemberDetailDialogProps) {
  if (!user) return null;

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | ReactNode;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b last:border-b-0">
      <p className="font-medium text-gray-700 w-40 flex-shrink-0">{label}:</p>
      <div className="mt-1 sm:mt-0 text-gray-900 break-words">{value}</div>
    </div>
  );

  const statusActive = user.is_active ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
      Inactive
    </span>
  );

  const statusValidated = user.is_validate ? (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800">
      Validated
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
      Pending
    </span>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-primary" />
            Detail Anggota: {user.name}
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap mengenai anggota dengan Unique Number: **
            {user.unique_number}**
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <DetailRow label="Name" value={user.name || "-"} />
          <DetailRow label="Unique Number" value={user.unique_number || "-"} />
          <DetailRow label="Email" value={user.email || "-"} />
          <DetailRow
            label="Program Alumni"
            value={user.program_alumni?.name || "-"}
          />
          <DetailRow
            label="Student Campus"
            value={user.student_campus?.institute || "-"}
          />
          <DetailRow
            label="Major Campus"
            value={user.major_campus?.major || "-"}
          />
          <DetailRow label="Domisili" value={user.domisili?.domisili || "-"} />
          <DetailRow label="Domisili" value={user.domisili?.domisili || "-"} />
          <DetailRow
            label="Student Club"
            value={user.student_club?.name || "-"}
          />
          <DetailRow
            label="Student Chapter"
            value={user.student_chapter?.institute || "-"}
          />
          <DetailRow label="Role" value={user.role?.name || "-"} />
          <DetailRow label="Is Active" value={statusActive} />
          <DetailRow label="Is Validated" value={statusValidated} />
          <DetailRow
            label="Social Media"
            value={
              user.social_media ? (
                <SocialMediaList
                  socialMedia={user.social_media as SocialMediaData}
                />
              ) : (
                "-"
              )
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
