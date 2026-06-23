with open('App.tsx', 'r') as f:
    content = f.read()

# Make RootNavigator accept NavigationContainer
import_navigation = "import { DefaultTheme, DarkTheme } from '@react-navigation/native';"
if "DefaultTheme" not in content:
    content = content.replace('import { NavigationContainer } from "@react-navigation/native";', 'import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";')

# Import useAppTheme
if "import { ThemeProvider } from" in content:
    content = content.replace('import { ThemeProvider } from "./src/contexts/ThemeContext";', 'import { ThemeProvider, useAppTheme } from "./src/contexts/ThemeContext";')

root_nav_start = """function RootNavigator() {
  const { usuarioAtual, isLoading } = useAuth();
  const { isDark, theme } = useAppTheme();"""

content = content.replace("""function RootNavigator() {
  const { usuarioAtual, isLoading } = useAuth();""", root_nav_start)

# Add NavigationContainer inside RootNavigator return
root_nav_return = """  const customTheme = isDark ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <NavigationContainer theme={customTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator"""

content = content.replace("""  return (
      <Stack.Navigator""", root_nav_return)

content = content.replace("""        <Stack.Screen name="FormDependente" component={FormDependenteScreen} />
      </Stack.Navigator>
  );""", """        <Stack.Screen name="FormDependente" component={FormDependenteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );""")

# Remove NavigationContainer from App component
app_return_old = """          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>"""
app_return_new = """          <RootNavigator />"""
content = content.replace(app_return_old, app_return_new)

with open('App.tsx', 'w') as f:
    f.write(content)
