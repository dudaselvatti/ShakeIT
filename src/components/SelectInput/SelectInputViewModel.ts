export interface Props {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    options: string[];
}

export function useSelectInputViewModel({ label, selectedValue, onValueChange, options }: Props) {
    return {
        label,
        selectedValue,
        onValueChange,
        options
    };
}