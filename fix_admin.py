import re

with open('src/screens/PartyAdmin/index.tsx', 'r') as f:
    content = f.read()

# Remove the button from the footer
content = content.replace("""                <Button 
                    title="Configurar restrições de sorteio"
                    onPress={handleNavigatePartyDrawRestrictions}
                    variant="outline"
                />""", "")

# Add the IconButton import if not present
if "import { IconButton }" not in content:
    content = content.replace("import { Button }", "import { Button }\nimport { IconButton }")

# Add the icon next to the party name
old_title = "<Text style={styles.partyName}>{partyName}</Text>"
new_title = """<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Text style={styles.partyName}>{partyName}</Text>
                        <IconButton 
                            iconName="sliders" 
                            onPress={handleNavigatePartyDrawRestrictions} 
                            color={theme.colors.textLight} 
                            size={20}
                        />
                    </View>"""
content = content.replace(old_title, new_title)

with open('src/screens/PartyAdmin/index.tsx', 'w') as f:
    f.write(content)

with open('src/screens/PartyAdmin/styles.ts', 'r') as f:
    styles_content = f.read()

# Let's make flatListContainer take the remaining space
styles_content = styles_content.replace('height: 300,', 'flex: 1,')
with open('src/screens/PartyAdmin/styles.ts', 'w') as f:
    f.write(styles_content)

