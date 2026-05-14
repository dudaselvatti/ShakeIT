export function formatCurrency(value: string | number): string {
    if (typeof value === "number") {
        const numericValue = value.toFixed(2);
        let [intPart, decimalPart] = numericValue.split(".");
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${intPart},${decimalPart}`;
    }

    if (!value) return "";

    const rawValue = value.replace(/\D/g, "");

    if (!rawValue) {
        return "";
    }

    const numericValue = (parseInt(rawValue, 10) / 100).toFixed(2);

    let [intPart, decimalPart] = numericValue.split(".");

    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${intPart},${decimalPart}`;
}