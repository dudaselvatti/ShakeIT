import re

files_to_fix = [
    'src/components/AppFooter/index.tsx',
    'src/components/RestrictionCard/index.tsx',
    'src/components/RestrictionCard/styles.ts',
    'src/components/Tag/index.tsx',
    'src/screens/PartyDrawRestrictions/index.tsx',
    'src/screens/PartyDrawRestrictions/styles.ts'
]

# We also had errors in src/components/Button/ButtonViewModel.test.ts
# and src/screens/Settings/index.tsx (redeclare block-scoped variable)

for f in files_to_fix:
    try:
        with open(f, 'r') as file:
            content = file.read()
            
        if f.endswith('styles.ts'):
            # Change import { theme } to import { ThemeType }
            content = re.sub(r'import\s*\{\s*theme\s*\}\s*from\s*(["\'].*?theme["\']);?', r'import { ThemeType } from \1;', content)
            # Change export const styles = StyleSheet.create({ to export const createStyles = (theme: ThemeType) => StyleSheet.create({
            content = re.sub(r'export\s+const\s+styles\s*=\s*StyleSheet\.create\s*\(\{', r'export const createStyles = (theme: ThemeType) => StyleSheet.create({', content)
            
            with open(f, 'w') as file:
                file.write(content)
            continue
            
        if 'const styles = createStyles(theme);' not in content:
            if 'export const AppFooter =' in content:
                content = content.replace('export const AppFooter = ({ onNavigateIntercept }: AppFooterProps = {}) => {', 
                                          'export const AppFooter = ({ onNavigateIntercept }: AppFooterProps = {}) => {\n  const { theme } = useAppTheme();\n  const styles = createStyles(theme);')
            elif 'export const RestrictionCard = ' in content:
                content = content.replace('export const RestrictionCard = ({ id, label, icon, onToggle, isSelected }: RestrictionCardProps) => {',
                                          'export const RestrictionCard = ({ id, label, icon, onToggle, isSelected }: RestrictionCardProps) => {\n  const { theme } = useAppTheme();\n  const styles = createStyles(theme);')
            elif 'export const Tag = ' in content:
                content = content.replace('export const Tag = ({ label, onRemove }: Props) => {',
                                          'export const Tag = ({ label, onRemove }: Props) => {\n  const { theme } = useAppTheme();\n  const styles = createStyles(theme);')
            elif 'export const PartyDrawRestrictionsScreen = ' in content:
                content = content.replace('export const PartyDrawRestrictionsScreen = () => {',
                                          'export const PartyDrawRestrictionsScreen = () => {\n  const { theme } = useAppTheme();\n  const styles = createStyles(theme);')
                                          
            # Need to ensure useAppTheme is imported
            if 'useAppTheme' not in content:
                lines = content.split('\n')
                idx = 0
                for i, l in enumerate(lines):
                    if l.startswith('import '):
                        idx = i
                lines.insert(idx + 1, 'import { useAppTheme } from "../../contexts/ThemeContext";')
                content = '\n'.join(lines)
                
            with open(f, 'w') as file:
                file.write(content)
    except Exception as e:
        print("Error processing", f, e)

# Fix double theme in Settings/index.tsx
with open('src/screens/Settings/index.tsx', 'r') as file:
    content = file.read()
    content = content.replace('const { isDark, toggleTheme, theme } = useAppTheme();', 'const { isDark, toggleTheme } = useAppTheme();')
with open('src/screens/Settings/index.tsx', 'w') as file:
    file.write(content)

