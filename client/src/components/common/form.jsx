import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select } from "../ui/select"
import { Textarea } from "../ui/textarea"



function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText }) {

    function renderInputByComponentType(getControlItem) {
        let element = null;
        const value = formData[getControlItem.name] || '';


        switch (getControlItem.componentType) {

            case 'input':
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        required={getControlItem.required}
                        value={value}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }
                    />
                )

                break;

            case 'select':
                element = (
                    <Select
                        id={getControlItem.name}
                        name={getControlItem.name}
                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        value={value}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }
                        required={getControlItem.required}
                    >
                        <option value="" disabled>
                            {getControlItem.placeholder || "Select an option"}
                        </option>
                        {Array.isArray(getControlItem.options) &&
                            getControlItem.options.map((optionItem) => (
                                <option key={optionItem.id ?? optionItem.value} value={optionItem.id ?? optionItem.value}>
                                    {optionItem.label ?? optionItem.text}
                                </option>
                            ))}
                    </Select>
                )

                break;

            case 'textarea':
                element = (
                    <Textarea
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        required={getControlItem.required}
                        value={value}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }
                        className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    />
                )

                break;


            default:
                element = (
                    <Input
                        name={getControlItem.name}
                        placeholder={getControlItem.placeholder}
                        id={getControlItem.name}
                        type={getControlItem.type}
                        required={getControlItem.required}
                        value={value}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: e.target.value,
                            })
                        }
                    />
                )

                break;
        }
        return element;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (typeof onSubmit === 'function') {
            onSubmit(formData);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
                {
                    formControls.map((controlItem) => (
                        <div className="grid w-full gap-1.5" key={controlItem.name}>
                            <Label className="mb-1">
                                {controlItem.label}
                            </Label>
                            {
                                renderInputByComponentType(controlItem)
                            }
                        </div>
                    ))
                }
            </div>
            <Button type="submit" className="mt-2 w-full">{buttonText || "Submit"}</Button>
        </form>
    )
}

export default CommonForm