import { useAppTheme } from "../../contexts/ThemeContext";
import { createStyles } from "./styles";
import { View, Text, FlatList, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AppHeader } from "../../components/AppHeader";
import { Button } from '../../components/Button';
import { SelectInput } from '../../components/SelectInput';
import { usePartyDrawRestrictionsViewModel } from './PartyDrawRestrictionsViewModel';
import { RestrictionCard } from "../../components/RestrictionCard";

export const PartyDrawRestrictionsScreen = () => {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
    const {
        participantsOptions,
        restrictionsList,
        personA,
        personB,
        setPersonA,
        setPersonB,
        restrictionDirection,
        handleChangeRestrictionDirection,
        RestrictionDirectionButtonTitle,
        handleCreateRestriction,
        handleDeleteRestriction,
        blockDependentDraw,
        handleToggleBlockDependentDraw,
     } = usePartyDrawRestrictionsViewModel();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <AppHeader headerTitle="Regras de Sorteio" showSettingsIcon={true} />
            <FlatList
                data={restrictionsList}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: 40 }]}
                ListHeaderComponent={
                    <View>
                        <View style={styles.container}>
                            <View style={styles.restrictionView}>
                                <Text style={styles.guideText}>Evite que pessoas específicas se tirem no sorteio (ex: casais).</Text>
                                <SelectInput
                                    label="Pessoa A"
                                    selectedValue={personA}
                                    onValueChange={setPersonA}
                                    options={participantsOptions}
                                />
                                <View style={styles.RestrictionDirection}>
                                    <Button
                                        title={RestrictionDirectionButtonTitle}
                                        onPress={handleChangeRestrictionDirection}
                                        variant="text"
                                    />
                                    <View style={styles.RestrictionDirectionArrows}>
                                        <Feather
                                            name="arrow-down"
                                            size={16}
                                            color={theme.colors.textLight}
                                        />
                                        {restrictionDirection === "both_ways" && (
                                            <Feather
                                                name="arrow-up"
                                                size={16}
                                                color={theme.colors.textLight}
                                            />
                                        )}
                                    </View>
                                </View>
                                <SelectInput
                                    label="Pessoa B"
                                    selectedValue={personB}
                                    onValueChange={setPersonB}
                                    options={participantsOptions}
                                />
                                <Button
                                    title="+ Adicionar Regra"
                                    onPress={handleCreateRestriction}
                                    variant="outline"
                                />
                            </View>
                            <View style={[styles.restrictionView, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                <Text style={[styles.guideText, { flex: 1, marginRight: 12 }]}>Impedir que titulares e dependentes se tirem no sorteio</Text>
                                <Switch 
                                    value={blockDependentDraw} 
                                    onValueChange={handleToggleBlockDependentDraw} 
                                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                    thumbColor={theme.colors.surface}
                                />
                            </View>
                        </View>
                        <View>
                            <Text style={[styles.heading, { color: theme.colors.text }]}>Regras Ativas</Text>
                            {blockDependentDraw && (
                                <View style={styles.activeBlockDependentDraw}>
                                    <Text style={{ color: theme.colors.text }}>Titulares e dependentes não podem se tirar</Text>
                                </View>
                            )}
                        </View>
                    </View>
                }
                renderItem={({ item }) => (
                    <RestrictionCard
                        personAName={item.personAName}
                        personBName={item.personBName}
                        restrictionDirection={item.restrictionDirection}
                        onPress={() => handleDeleteRestriction(item.id)}
                    />
                )}
            />
        </SafeAreaView>
    );
}