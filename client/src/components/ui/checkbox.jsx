import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({ checked, onChange, onCheckedChange, className }) {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);

  // Sync with external checked prop
  useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  const toggle = () => {
    const newState = !internalChecked;
    setInternalChecked(newState);
    onChange?.(newState);
    onCheckedChange?.(newState);
  };

  return (
    <div
      onClick={toggle}
      className={cn(
        "w-4 h-4 rounded flex items-center justify-center cursor-pointer transition border",
        internalChecked
          ? "bg-primary border-primary text-primary-foreground"
          : "bg-white border-gray-300 hover:border-gray-400",
        className
      )}
    >
      {internalChecked && <CheckIcon className="w-3 h-3" strokeWidth={3} />}
    </div>
  );
}

export default Checkbox;
