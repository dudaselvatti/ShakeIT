export function calcularIdade(dataDeNascimento: string): number {
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(dataDeNascimento)) {
        throw new Error("Formato de data inválido. Use o padrão 'YYYY-MM-DD'.");
    }

    const [ano, mes, dia] = dataDeNascimento.split('-').map(Number);
    const nascimento = new Date(ano, mes - 1, dia);

    if (
        nascimento.getFullYear() !== ano ||
        nascimento.getMonth() !== mes - 1 ||
        nascimento.getDate() !== dia
    ) {
        throw new Error("A data fornecida é inválida.");
    }

    const hoje = new Date();
    
    const hojeAjustado = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    if (nascimento > hojeAjustado) {
        throw new Error("A data de nascimento não pode ser uma data futura.");
    }

    let idade = hojeAjustado.getFullYear() - nascimento.getFullYear();

    const mesAtual = hojeAjustado.getMonth();
    const diaAtual = hojeAjustado.getDate();

    const mesNasc = nascimento.getMonth();
    const diaNasc = nascimento.getDate();

    if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
        idade--;
    }

    return idade;
}