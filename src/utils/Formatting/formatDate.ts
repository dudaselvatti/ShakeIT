export function formatDate(
    value?: Date | null,
    locale: string = "pt-BR"
): string {
    return value ? value.toLocaleDateString(locale) : "";
}