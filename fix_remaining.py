import re

# Fix ButtonViewModel.test.ts
with open('src/components/Button/ButtonViewModel.test.ts', 'r') as f:
    content = f.read()
content = content.replace('import { createStyles } from "./styles";', 'import { createStyles } from "./styles";\nconst styles = createStyles(theme);')
with open('src/components/Button/ButtonViewModel.test.ts', 'w') as f:
    f.write(content)

# Fix MeuPerfil/index.tsx (SizeCard needs styles)
with open('src/screens/MeuPerfil/index.tsx', 'r') as f:
    content = f.read()
content = content.replace('const SizeCard = ({ title, emoji, placeholder, selectedValue, onValueChange, options, isEditing }: SizeCardProps) => {',
                          'const SizeCard = ({ title, emoji, placeholder, selectedValue, onValueChange, options, isEditing }: SizeCardProps) => {\n    const { theme } = useAppTheme();\n    const styles = createStyles(theme);')
with open('src/screens/MeuPerfil/index.tsx', 'w') as f:
    f.write(content)

# Fix PartyDrawRestrictions/styles.ts
with open('src/screens/PartyDrawRestrictions/styles.ts', 'r') as f:
    content = f.read()
content = content.replace('export const styles = StyleSheet.create({', 'export const createStyles = (theme: ThemeType) => StyleSheet.create({')
content = re.sub(r'import\s*\{\s*theme\s*\}\s*from\s*(["\'].*?theme["\']);?', r'import { ThemeType } from \1;', content)
with open('src/screens/PartyDrawRestrictions/styles.ts', 'w') as f:
    f.write(content)

# Fix PartyDrawRestrictions/index.tsx
with open('src/screens/PartyDrawRestrictions/index.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { styles } from "./styles";', 'import { createStyles } from "./styles";\nimport { useAppTheme } from "../../contexts/ThemeContext";')
if 'const styles = createStyles(theme);' not in content:
    content = content.replace('export const PartyDrawRestrictionsScreen = () => {', 'export const PartyDrawRestrictionsScreen = () => {\n  const { theme } = useAppTheme();\n  const styles = createStyles(theme);')
with open('src/screens/PartyDrawRestrictions/index.tsx', 'w') as f:
    f.write(content)

