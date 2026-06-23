import re

files = [
    'src/components/RestrictionCard/index.tsx',
    'src/components/RestrictionCard/styles.ts',
    'src/components/Tag/index.tsx',
    'src/screens/PartyDrawRestrictions/index.tsx',
    'src/screens/PartyDrawRestrictions/styles.ts'
]

# We need to make sure createStyles is imported and used, and any static constants that use theme are inside the createStyles function or the component itself.

with open('src/components/RestrictionCard/styles.ts', 'r') as f:
    content = f.read()
# iconColor was exported using theme.colors.textLight
content = content.replace('export const iconColor = theme.colors.textLight;', '')
with open('src/components/RestrictionCard/styles.ts', 'w') as f:
    f.write(content)

with open('src/components/RestrictionCard/index.tsx', 'r') as f:
    content = f.read()
content = content.replace("import { styles, iconColor } from './styles';", "import { createStyles } from './styles';")
content = content.replace('color={isSelected ? theme.colors.danger : iconColor}', 'color={isSelected ? theme.colors.danger : theme.colors.textLight}')
with open('src/components/RestrictionCard/index.tsx', 'w') as f:
    f.write(content)

with open('src/components/Tag/index.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { styles, iconColor } from "./styles";', 'import { createStyles } from "./styles";\nimport { theme } from "../../styles/theme";') # We might need theme there
content = content.replace('color={iconColor}', 'color={theme.colors.textLight}')
with open('src/components/Tag/index.tsx', 'w') as f:
    f.write(content)

with open('src/screens/PartyDrawRestrictions/styles.ts', 'r') as f:
    content = f.read()
content = content.replace('export const iconColor = theme.colors.textLight;', '')
with open('src/screens/PartyDrawRestrictions/styles.ts', 'w') as f:
    f.write(content)

with open('src/screens/PartyDrawRestrictions/index.tsx', 'r') as f:
    content = f.read()
content = content.replace('import { styles, iconColor } from "./styles";', 'import { createStyles } from "./styles";')
content = content.replace('color={iconColor}', 'color={theme.colors.textLight}')
# It needs `import { useAppTheme } from "../../contexts/ThemeContext";` and `import { createStyles } from "./styles";` but I think I already added them.
# Let's ensure they are there correctly without duplicates.
lines = content.split('\n')
clean_lines = [l for l in lines if 'import { createStyles } from "./styles";' not in l and 'import { useAppTheme } from "../../contexts/ThemeContext";' not in l]
clean_lines.insert(0, 'import { createStyles } from "./styles";')
clean_lines.insert(0, 'import { useAppTheme } from "../../contexts/ThemeContext";')
content = '\n'.join(clean_lines)
with open('src/screens/PartyDrawRestrictions/index.tsx', 'w') as f:
    f.write(content)

