import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type FormInputProps = {
    name: string
    type: string
    label?: string
    defaultValue?: string
    placeholder?: string
    required?: boolean
}

const FormInput = ({
    label,
    name,
    type = "text",
    defaultValue,
    placeholder,
    required = false
}: FormInputProps) => {
    return (
        <div className="mb-2 flex flex-col gap-2">
            <Label htmlFor={name} className="capitalize">
                {label || name}
                {!required && (
                    <span className="ml-1 text-gray-400 text-sm">(ไม่บังคับ)</span>
                )}
            </Label>

            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
            />
        </div>
    )
}

export default FormInput

