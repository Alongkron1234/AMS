interface FormInputCalProps {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  inputMode?: "text" | "numeric" | "decimal" | "search" | "email" | "tel" | "url";
}

export default function FormInputCal({ 
  name, 
  label, 
  type = "text", 
  value, 
  onChange, 
  className,
  ...props 
}: FormInputCalProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
        {...props} 
      />
    </div>
  );
}