import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AppHeader } from "../../components/AppHeader";
import { Button } from '../../components/Button';
import { SelectInput } from '../../components/SelectInput';
import { usePartyDrawRestrictionsViewModel } from './PartyDrawRestrictionsViewModel';
import { RestrictionCard } from "../../components/RestrictionCard";
import { styles, iconColor } from './styles';

export const PartyDrawRestrictionsScreen = () => {
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
        BlockDependentDrawButtonTitle,
        handleToggleBlockDependentDraw,
     } = usePartyDrawRestrictionsViewModel();

    return (
        <SafeAreaView>
            <AppHeader headerTitle="Regras de Sorteio" showSettingsIcon={true} />
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
                                color={iconColor}
                            />
                            {restrictionDirection === "both_ways" && (
                                <Feather
                                    name="arrow-up"
                                    size={16}
                                    color={iconColor}
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
                <View style={styles.restrictionView}>
                    <Button 
                        title={BlockDependentDrawButtonTitle}
                        onPress={handleToggleBlockDependentDraw}
                        variant="outline"
                    />
                </View>
            </View>
            <View>
                <Text style={styles.heading}>Regras Ativas</Text>
                {blockDependentDraw && (
                    <View style={styles.activeBlockDependentDraw}>
                        <Text>Titulares e dependentes não podem se tirar</Text>
                    </View>
                )}
                <FlatList
                    data={restrictionsList}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.listContent]}
                    renderItem={({ item }) => (
                        <RestrictionCard
                            personAName={item.personAName}
                            personBName={item.personBName}
                            restrictionDirection={item.restrictionDirection}
                            onPress={() => handleDeleteRestriction(item.id)}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
}