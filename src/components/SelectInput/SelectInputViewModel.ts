type SelectOption = {
    key: string;
    label: string;
    value: string;
};

export interface Props {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
}

export function useSelectInputViewModel({ label, selectedValue, onValueChange, options }: Props) {
    return {
        label,
        selectedValue,
        onValueChange,
        options
    };
}