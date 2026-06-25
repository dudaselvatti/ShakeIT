import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenCapture from 'expo-screen-capture';

import { PopupModal } from '../../components/PopupModal';
import { PerfilSorteadoHeader } from './components/PerfilSorteadoHeader';
import { PerfilSorteadoContent } from './components/PerfilSorteadoContent';
import { usePerfilSorteadoViewModel } from './PerfilSorteadoViewModel';
import { createStyles } from './styles';
import { AppHeader } from "../../components/AppHeader";
import { AppFooter } from "../../components/AppFooter";
import { useAppTheme } from "../../contexts/ThemeContext";
import { formatDate } from '../../utils/Formatting/formatDate';
import { formatCurrency } from '../../utils/Formatting/formatCurrency';
import { ParticipanteCard } from '../../components/ParticipanteCard';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

export const PerfilSorteadoScreen = () => {
    const { theme } = useAppTheme();
    const styles = createStyles(theme);
    const { usuarioAtual, tabs, activeTabKey, setActiveTabKey, isLoading, handleRevealAll, confirmRevealAll } = usePerfilSorteadoViewModel();
    const [isScreenshotModalVisible, setIsScreenshotModalVisible] = useState(false);
    const [isRevealConfirmVisible, setIsRevealConfirmVisible] = useState(false);
    const [isRevealErrorVisible, setIsRevealErrorVisible] = useState(false);

    const getTabIcon = (tab: any) => {
        if (tab.type === 'event') {
            return require('../../../assets/presente.png');
        }
        if (tab.type === 'receiver' && tab.giver) {
            const avatarUrl = tab.giver.perfil.participant_avatar || tab.giver.usuario?.avatar_url;
            if (avatarUrl && !avatarUrl.includes('gravatar')) {
                return { uri: avatarUrl };
            }

            const pType = tab.giver.perfil.participant_type;
            if (pType === 'dependent') {
                if (tab.giver.perfil.dependent_type === 'child') return require('../../../assets/crianca.png');
                if (tab.giver.perfil.dependent_type === 'pet') return require('../../../assets/pet.png');
            }
        }
        return require('../../../assets/perfil-padrao.png');
    };

    useFocusEffect(
        useCallback(() => {
            const subscription = ScreenCapture.addScreenshotListener(() => {
                setIsScreenshotModalVisible(true);
            });

            return () => {
                subscription.remove();
            };
        }, [])
    );

    if (isLoading || tabs.length === 0) {
        return null;
    }

    const activeTab = tabs.find(t => t.key === activeTabKey) || tabs[0];

    const getBirthDateStr = (bd: any) => {
        if (!bd) return "2000-01-01";
        if (typeof bd === 'string') return bd;
        if (bd.toDate) {
            const date = bd.toDate();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
        return "2000-01-01";
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader headerTitle="Resultado do Sorteio" showBackButton={true} showSettingsIcon={true} />
            
            <View style={{ flexDirection: 'row', backgroundColor: theme.colors.surface, paddingVertical: 8, paddingHorizontal: 16 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map(tab => (
                        <TouchableOpacity 
                            key={tab.key} 
                            onPress={() => setActiveTabKey(tab.key)}
                            style={{ 
                                paddingVertical: 8, 
                                paddingHorizontal: 16, 
                                borderBottomWidth: activeTabKey === tab.key ? 2 : 0, 
                                borderBottomColor: theme.colors.primary,
                                marginRight: 8
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Image source={getTabIcon(tab)} style={{ width: 20, height: 20 }} resizeMode="contain" />
                                <Text style={{ 
                                    color: activeTabKey === tab.key ? theme.colors.primary : theme.colors.textLight, 
                                    fontWeight: activeTabKey === tab.key ? 'bold' : 'normal' 
                                }}>{tab.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={{ flex: 1 }}>
                {activeTab.type === 'receiver' && activeTab.participant && (
                    <>
                        <PerfilSorteadoHeader
                            fotoUrl={activeTab.participant.perfil.participant_type === 'dependent' ? activeTab.participant.perfil.participant_avatar : (activeTab.participant.perfil.participant_avatar || activeTab.participant.usuario?.avatar_url || '')}
                            nome={activeTab.participant.perfil.participant_name || activeTab.participant.usuario?.nome || 'Amigo'}
                            dataDeNascimento={getBirthDateStr(activeTab.participant.perfil.birth_date) !== "2000-01-01" ? getBirthDateStr(activeTab.participant.perfil.birth_date) : getBirthDateStr(activeTab.participant.usuario?.birth_date)}
                            genero={activeTab.participant.perfil.gender || activeTab.participant.usuario?.genero || "Não informado"}
                            participantType={activeTab.participant.perfil.participant_type}
                            dependentType={activeTab.participant.perfil.dependent_type}
                        />
                        <PerfilSorteadoContent
                            bio={activeTab.participant.perfil.participant_type === 'dependent' ? activeTab.participant.perfil.bio : (activeTab.participant.perfil.bio || activeTab.participant.usuario?.bio)}
                            medidas={activeTab.participant.perfil.sizes || {}}
                            preferencias={activeTab.participant.perfil.preferencias || {}}
                        />
                    </>
                )}
                {activeTab.type === 'event' && activeTab.party && (
                    <View style={{ padding: 24 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 16 }}>{activeTab.party.name}</Text>
                        
                        <Card style={{ marginBottom: 24, padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 16 }}>
                                <View style={{ backgroundColor: theme.colors.primary + '15', padding: 12, borderRadius: 12, marginRight: 16 }}>
                                    <Image source={require('../../../assets/calendario.png')} style={{ width: 24, height: 24, tintColor: theme.colors.primary }} />
                                </View>
                                <View>
                                    <Text style={{ color: theme.colors.textLight, fontSize: 14 }}>Data do Sorteio</Text>
                                    <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 18 }}>{formatDate(activeTab.party.event_date)}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: theme.colors.primary + '15', padding: 12, borderRadius: 12, marginRight: 16 }}>
                                    <Image source={require('../../../assets/dinheiro.png')} style={{ width: 24, height: 24, tintColor: theme.colors.primary }} />
                                </View>
                                <View>
                                    <Text style={{ color: theme.colors.textLight, fontSize: 14 }}>Intervalo de Valores</Text>
                                    <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 18 }}>R$ {formatCurrency(activeTab.party.min_value)} - R$ {formatCurrency(activeTab.party.max_value)}</Text>
                                </View>
                            </View>
                        </Card>

                        {activeTab.party?.status === 'sorteio_revelado' && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.success }}>
                                <Image source={require('../../../assets/check-confirmacao.png')} style={{ width: 24, height: 24, marginRight: 12, tintColor: theme.colors.success }} />
                                <Text style={{ color: theme.colors.text, fontWeight: 'bold', fontSize: 16, flex: 1 }}>Evento Revelado e Encerrado!</Text>
                            </View>
                        )}

                        {activeTab.party?.status === 'sorteio_realizado' && activeTab.party.admin_id === usuarioAtual?.id && (
                            <Button 
                                title="Revelar Sorteio para Todos" 
                                onPress={() => {
                                    if (handleRevealAll()) {
                                        setIsRevealConfirmVisible(true);
                                    } else {
                                        setIsRevealErrorVisible(true);
                                    }
                                }}
                                style={{ marginBottom: 24 }}
                            />
                        )}

                        {activeTab.party?.status === 'sorteio_revelado' && activeTab.allDrawResults && activeTab.allDrawResults.length > 0 && (
                            <>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 }}>Quem tirou quem (Gabarito)</Text>
                                <View style={{ backgroundColor: theme.colors.surface, borderRadius: 12, padding: 16, marginBottom: 24 }}>
                                    {activeTab.allDrawResults.map(draw => {
                                        const giver = activeTab.allParticipants?.find(p => p.perfil.id === draw.giver_profile_id);
                                        const receiver = activeTab.allParticipants?.find(p => p.perfil.id === draw.receiver_profile_id);
                                        const giverName = giver?.perfil.participant_name || giver?.usuario?.nome || "Desconhecido";
                                        const receiverName = receiver?.perfil.participant_name || receiver?.usuario?.nome || "Desconhecido";
                                        
                                        return (
                                            <View key={draw.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                                                <Text style={{ color: theme.colors.text, flex: 1 }}>{giverName}</Text>
                                                <Text style={{ color: theme.colors.textLight, paddingHorizontal: 8 }}>→</Text>
                                                <Text style={{ color: theme.colors.primary, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{receiverName}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </>
                        )}

                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 }}>Participantes do Sorteio</Text>
                        {activeTab.allParticipants?.map(p => (
                            <ParticipanteCard 
                                key={p.perfil.id}
                                participante={p}
                                showRemoveIcon={false}
                            />
                        ))}
                        <View style={{ height: 100 }} />
                    </View>
                )}
            </ScrollView>

            <AppFooter />

            <PopupModal
                visible={isScreenshotModalVisible}
                title="Atenção!"
                message="Não vá espalhar seu amigo secreto por aí, é secreto sabia..."
                confirmText="Foi mal!"
                hideCancelButton={true}
                onCancel={() => setIsScreenshotModalVisible(false)}
                onConfirm={() => setIsScreenshotModalVisible(false)}
            />

            <PopupModal
                visible={isRevealConfirmVisible}
                title="Atenção!"
                iconName="alert-triangle"
                message="Deseja revelar o resultado do sorteio para todos? (Isso mostrará quem tirou quem)"
                cancelText="Cancelar"
                confirmText="Revelar"
                onCancel={() => setIsRevealConfirmVisible(false)}
                onConfirm={() => {
                    setIsRevealConfirmVisible(false);
                    confirmRevealAll();
                }}
            />

            <PopupModal
                visible={isRevealErrorVisible}
                title="Aguarde!"
                iconName="clock"
                message="A revelação do gabarito só estará disponível no dia do evento ou depois."
                confirmText="Entendi"
                hideCancelButton={true}
                onCancel={() => setIsRevealErrorVisible(false)}
                onConfirm={() => setIsRevealErrorVisible(false)}
            />
        </SafeAreaView>
    );
}