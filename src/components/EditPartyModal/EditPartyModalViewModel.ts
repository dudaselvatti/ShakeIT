import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useState, useEffect } from "react";
import { updateParty } from "../../services/cloud/Party/PartyDb";
import { formatCurrency } from "../../utils/Formatting/formatCurrency";

export interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    partyId: string;
    initialData: {
        name: string;
        event_date: string;
        min_value: number;
        max_value: number;
    };
}

export function useEditPartyModalViewModel(props: Props) {
    const [nomeParty, setNomeParty] = useState(props.initialData.name);
    const [dataRevelacao, setDataRevelacao] = useState<Date | undefined>(new Date(props.initialData.event_date));
    const [valorMinimo, setValorMinimo] = useState(formatCurrency(props.initialData.min_value));
    const [valorMaximo, setValorMaximo] = useState(formatCurrency(props.initialData.max_value));
    const [errors, setErrors] = useState({ nome: "", data: "", valores: "" });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (props.visible) {
            setNomeParty(props.initialData.name);
            setDataRevelacao(new Date(props.initialData.event_date));
            setValorMinimo(formatCurrency(props.initialData.min_value));
            setValorMaximo(formatCurrency(props.initialData.max_value));
            setErrors({ nome: "", data: "", valores: "" });
        }
    }, [props.visible, props.initialData]);

    const updateNomeParty = (text: string) => {
        setNomeParty(text);
        if (errors.nome) setErrors((prev) => ({ ...prev, nome: "" }));
    };

    const updateDataRevelacao = (date: Date) => {
        setDataRevelacao(date);
        if (errors.data) setErrors((prev) => ({ ...prev, data: "" }));
    };

    const updateValorMinimo = (text: string) => {
        setValorMinimo(text);
        if (errors.valores) setErrors((prev) => ({ ...prev, valores: "" }));
    };

    const updateValorMaximo = (text: string) => {
        setValorMaximo(text);
        if (errors.valores) setErrors((prev) => ({ ...prev, valores: "" }));
    };

    const parseCurrency = (value: string) => {
        if (!value) return 0;
        return parseFloat(value.replace(/\./g, "").replace(",", "."));
    };

    const initialDateStr = new Date(props.initialData.event_date).toISOString().split('T')[0];
    const currentDataStr = dataRevelacao ? dataRevelacao.toISOString().split('T')[0] : "";
    
    const hasChanges = nomeParty !== props.initialData.name ||
        currentDataStr !== initialDateStr ||
        parseCurrency(valorMinimo) !== props.initialData.min_value ||
        parseCurrency(valorMaximo) !== props.initialData.max_value;

    const handleSalvar = async () => {
        let isValid = true;
        let newErrors = { nome: "", data: "", valores: "" };

        if (!nomeParty.trim()) {
            newErrors.nome = "O nome da Party é obrigatório.";
            isValid = false;
        }

        if (!dataRevelacao) {
            newErrors.data = "Selecione a data da revelação.";
            isValid = false;
        }

        const numMin = parseCurrency(valorMinimo);
        const numMax = parseCurrency(valorMaximo);

        if (valorMinimo === "" || valorMaximo === "") {
            newErrors.valores = "Preencha o valor mínimo e máximo.";
            isValid = false;
        } else if (numMax < numMin) {
            newErrors.valores = "O valor máximo não pode ser menor que o mínimo.";
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        setIsLoading(true);

        try {
            await updateParty(props.partyId, {
                name: nomeParty,
                event_date: dataRevelacao!.toISOString(),
                min_value: numMin,
                max_value: numMax,
            });
            props.onSave();
            props.onClose();
        } catch (error) {
            console.error("Erro ao atualizar a Party:", error);
            Toast.show({ type: "error", text1: "Oops!", text2: "Sistema indisponível no momento." });
            setErrors((prev) => ({
                ...prev,
                nome: "Erro ao salvar as alterações. Tente novamente.",
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return {
        nomeParty,
        updateNomeParty,
        dataRevelacao,
        updateDataRevelacao,
        valorMinimo,
        updateValorMinimo,
        valorMaximo,
        updateValorMaximo,
        errors,
        handleSalvar,
        isLoading,
        hasChanges
    };
}
