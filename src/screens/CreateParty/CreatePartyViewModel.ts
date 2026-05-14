import { useState } from "react";
import { Party } from "../../types/Party";
import { gerarPartyCode } from "../../utils/PartyCode/gerarPartyCode";
import { createPartyInCloud } from "../../services/cloudDb/cloudDb";
import { useAuth } from "../../contexts/AuthContext/AuthContext";

export function useCreatePartyViewModel(navigation: any) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [nomeParty, setNomeParty] = useState("");
  const [dataRevelacao, setDataRevelacao] = useState<Date | undefined>(undefined);
  const [valorMinimo, setValorMinimo] = useState("");
  const [valorMaximo, setValorMaximo] = useState("");
  const [errors, setErrors] = useState({ nome: "", data: "", valores: "" });

  const { usuarioAtual } = useAuth();

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

  const handleBackPress = () => setModalVisible(true);
  const cancelExit = () => setModalVisible(false);
  const confirmExit = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  const parseCurrency = (value: string) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  };

  const handleCriarParty = async () => {
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

    if (!isValid || !usuarioAtual) return;

    const novaParty: Omit<Party, "id"> = {
      name: nomeParty,
      eventDate: dataRevelacao!.toISOString(),
      minPrice: numMin,
      maxPrice: numMax,
      idAdmin: usuarioAtual.id,
      inviteCode: gerarPartyCode(),
      status: "Aguardando Sorteio",
    };

    try {
    const createdParty = await createPartyInCloud(novaParty);

      console.log("Party criada no Firebase:", createdParty);

      navigation.navigate("PartyCreated", {
        party: createdParty,
      });

    } catch (error) {
      console.error("Erro ao criar Party no Firebase:", error);
      setErrors((prev) => ({
        ...prev,
        nome: "Erro ao criar a Party. Tente novamente.",
      }));
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
    isModalVisible,
    cancelExit,
    handleBackPress,
    confirmExit,
    handleCriarParty,
  };
};