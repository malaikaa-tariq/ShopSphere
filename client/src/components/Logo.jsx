import { CircleDot } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark">
        <CircleDot size={22} strokeWidth={2.5} />
      </div>

      {!compact && (
        <span className="brand-word">
          Shop<span>Sphere</span>
        </span>
      )}
    </div>
  );
}