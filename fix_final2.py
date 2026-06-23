import re

with open('src/components/RestrictionCard/index.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { styles, iconColor, xColor } from './styles';", "import { createStyles } from './styles';")
content = content.replace('color={isSelected ? xColor : iconColor}', 'color={isSelected ? theme.colors.danger : theme.colors.textLight}')
with open('src/components/RestrictionCard/index.tsx', 'w') as f:
    f.write(content)

with open('src/components/RestrictionCard/styles.ts', 'r') as f:
    content = f.read()
content = re.sub(r'export const xColor = .*?;', '', content)
content = re.sub(r'export const iconColor = .*?;', '', content)
with open('src/components/RestrictionCard/styles.ts', 'w') as f:
    f.write(content)

with open('src/components/Tag/index.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { createStyles } from "./styles";\nimport { theme } from "../../styles/theme";\nimport { styles } from "./styles";', 'import { createStyles } from "./styles";\nimport { useAppTheme } from "../../contexts/ThemeContext";')
if 'useAppTheme' not in content:
    content = 'import { useAppTheme } from "../../contexts/ThemeContext";\n' + content
content = content.replace('import { createStyles } from "./styles";\nimport { createStyles } from "./styles";', 'import { createStyles } from "./styles";')
with open('src/components/Tag/index.tsx', 'w') as f:
    f.write(content)

with open('src/screens/PartyDrawRestrictions/index.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { styles, iconColor } from './styles';", "import { createStyles } from './styles';")
with open('src/screens/PartyDrawRestrictions/index.tsx', 'w') as f:
    f.write(content)

with open('src/components/Tag/styles.ts', 'r') as f:
    content = f.read()
if 'export const styles' in content:
    content = content.replace('export const styles = StyleSheet.create({', 'export const createStyles = (theme: ThemeType) => StyleSheet.create({')
    content = re.sub(r'import\s*\{\s*theme\s*\}\s*from\s*(["\'].*?theme["\']);?', r'import { ThemeType } from \1;', content)
with open('src/components/Tag/styles.ts', 'w') as f:
    f.write(content)
