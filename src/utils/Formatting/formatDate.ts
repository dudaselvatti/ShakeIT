export function formatDate(
    value?: Date | string | null,
    locale: string = "pt-BR"
): string {
    if (!value) return "";
    const dateObj = typeof value === "string" ? new Date(value) : value;
    return dateObj.toLocaleDateString(locale);
}