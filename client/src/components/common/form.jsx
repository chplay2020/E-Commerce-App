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

    // function handleSubmit(e) {
    //     e.preventDefault();
    //     if (typeof onSubmit === 'function') {
    //         onSubmit(formData);
    //     }
    // }

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            {
                formControls.map((controlItem) => (
                    <div className="space-y-1" key={controlItem.name}>
                        <Label htmlFor={controlItem.name}>
                            {controlItem.label}
                        </Label>
                        {renderInputByComponentType(controlItem)}
                    </div>
                ))
            }
            <Button type="submit" className="w-full">{buttonText || "Submit"}</Button>
        </form>
    )
}

export default CommonForm