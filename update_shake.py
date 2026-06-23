with open('src/screens/ShakeReveal/index.tsx', 'r') as f:
    content = f.read()

# Add ScratchCard import
if 'ScratchCard' not in content:
    content = content.replace('import { useAppTheme } from "../../contexts/ThemeContext";', 'import { useAppTheme } from "../../contexts/ThemeContext";\nimport { ScratchCard } from "../../components/ScratchCard";\nimport { Dimensions } from "react-native";')

# Get isScratchMode
content = content.replace('const { theme } = useAppTheme();', 'const { theme, isScratchMode } = useAppTheme();')

# Need navigation to pass to ScratchCard's onReveal
content = content.replace('const { \n    shakeAnimation, \n    explodeScale, \n    explodeOpacity, \n    hasShaken \n  } = useShakeRevealViewModel(navigation);',
"""  const { 
    shakeAnimation, 
    explodeScale, 
    explodeOpacity, 
    hasShaken,
    simularShake
  } = useShakeRevealViewModel(navigation);
  
  const handleRevealScratch = () => {
    // Navigate immediately or call simularShake which handles the navigation logic
    simularShake();
  };
""")

# Build the ScratchCard alternative render block
scratch_block = """
      {isScratchMode ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
            <ScratchCard 
                width={300} 
                height={300} 
                onReveal={handleRevealScratch} 
                underneathComponent={
                    <View style={{ width: 300, height: 300, backgroundColor: theme.colors.surface, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: theme.colors.primary }}>
                        <Text style={styles.emoji}>🎁</Text>
                        <Text style={{ fontSize: 20, color: theme.colors.text, marginTop: 16, fontWeight: 'bold' }}>Revelado!</Text>
                    </View>
                }
            />
        </View>
      ) : (
        <Animated.View 
            style={[
            styles.box, 
            { 
                opacity: explodeOpacity,
                transform: [
                { translateX: hasShaken ? 0 : shakeAnimation },
                { scale: explodeScale }
                ] 
            }
            ]}
        >
            <Text style={styles.emoji}>🎁</Text>
        </Animated.View>
      )}
"""

# Replace the Animated.View with the conditional block
content = content.replace("""      <Animated.View 
        style={[
          styles.box, 
          { 
            opacity: explodeOpacity,
            transform: [
              { translateX: hasShaken ? 0 : shakeAnimation },
              { scale: explodeScale }
            ] 
          }
        ]}
      >
        <Text style={styles.emoji}>🎁</Text>
      </Animated.View>""", scratch_block)

content = content.replace('{hasShaken ? "Preparando a surpresa..." : "Chacoalhe o celular para descobrir o seu amigo secreto..."}',
                          '{hasShaken ? "Preparando a surpresa..." : isScratchMode ? "Raspe o cartão para descobrir o seu amigo secreto!" : "Chacoalhe o celular para descobrir o seu amigo secreto..."}')

with open('src/screens/ShakeReveal/index.tsx', 'w') as f:
    f.write(content)

