import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({ checked, onChange, className }) {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);

  const toggle = () => {
    const newState = !internalChecked;
    setInternalChecked(newState);
    onChange?.(newState);
  };

  return (
    <div
      onClick={toggle}
      className={cn(
        "w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition",
        internalChecked
          ? "bg-primary border-primary text-primary-foreground"
          : "bg-white border-gray-400 hover:border-gray-600",
        className
      )}
      style={{ borderWidth: 1.5 }}
    >
      {internalChecked && <CheckIcon className="w-4 h-4" />}
    </div>
  );
}

export default Checkbox;
