import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it's a styles.ts file
    if filepath.endswith('styles.ts'):
        if 'import { theme }' in content or 'import { theme' in content:
            # Change import { theme } from "../../styles/theme";
            # to import { ThemeType } from "../../styles/theme";
            content = re.sub(r'import\s*\{\s*theme\s*\}\s*from\s*(["\'].*?theme["\']);?', r'import { ThemeType } from \1;', content)
            
            # Change export const styles = StyleSheet.create({
            # to export const createStyles = (theme: ThemeType) => StyleSheet.create({
            content = re.sub(r'export\s+const\s+styles\s*=\s*StyleSheet\.create\s*\(\{', r'export const createStyles = (theme: ThemeType) => StyleSheet.create({', content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated styles: {filepath}")

    # If it's a component or screen (index.tsx, ViewModel.ts, etc)
    elif filepath.endswith('.tsx') or filepath.endswith('.ts'):
        # Only process if it imports styles from ./styles
        if re.search(r'import\s*\{\s*styles\s*\}\s*from\s*["\']./styles["\']', content):
            # Read all lines
            lines = content.split('\n')
            
            # Change the import
            content = re.sub(r'import\s*\{\s*styles\s*\}\s*from\s*(["\']./styles["\']);?', r'import { createStyles } from \1;', content)
            
            # We need to inject `import { useAppTheme } from ".../contexts/ThemeContext";`
            # Let's find the relative path to ThemeContext
            # Count depth
            depth = filepath.replace(os.getcwd() + '/', '').count('/') - 1
            if depth < 0: depth = 0
            rel_path = '../' * depth + 'contexts/ThemeContext'
            if depth == 0:
                rel_path = './contexts/ThemeContext'
            
            # Add useAppTheme import if not exists
            if 'useAppTheme' not in content:
                # Find last import
                last_import_idx = 0
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if line.startswith('import '):
                        last_import_idx = i
                
                lines.insert(last_import_idx + 1, f'import {{ useAppTheme }} from "{rel_path}";')
                content = '\n'.join(lines)
                
            # Now we need to inject `const { theme } = useAppTheme(); const styles = createStyles(theme);`
            # Inside the functional component or hook.
            # This is tricky using regex. 
            # We can find `export const ComponentName = ` or `export function `
            # and inject it right after the opening brace.
            
            # Let's find the main function.
            # Match `export const \w+ = [^=]*=>\s*{` or `export function \w+\([^)]*\)\s*{`
            func_pattern = r'(export\s+(?:const|function)\s+\w+\s*(?:=\s*(?:\([^)]*\)|[^=]+)=>\s*|\([^)]*\)\s*){)'
            
            def inject_theme(match):
                return match.group(1) + '\n    const { theme } = useAppTheme();\n    const styles = createStyles(theme);'
            
            content = re.sub(func_pattern, inject_theme, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated component: {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            process_file(os.path.join(root, file))
