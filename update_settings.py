with open('src/screens/Settings/index.tsx', 'r') as f:
    content = f.read()

content = content.replace('const { isDark, toggleTheme } = useAppTheme();', 'const { isDark, toggleTheme, isScratchMode, toggleScratchMode } = useAppTheme();')

scratch_toggle = """                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                            <Text style={{ fontSize: 16, color: theme.colors.text, fontWeight: '500' }}>Raspadinha (Sem acelerômetro)</Text>
                            <Switch 
                                value={isScratchMode} 
                                onValueChange={toggleScratchMode} 
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor={theme.colors.surface}
                            />
                        </View>
"""

content = content.replace('                    <View style={styles.optionsList}>', '                    <View style={styles.optionsList}>\n' + scratch_toggle)

with open('src/screens/Settings/index.tsx', 'w') as f:
    f.write(content)
