interface Medidas {
    camisa: string;
    calca: string;
    calcado: string;
};

interface Preferencias {
    coisasQueAmo: string[];
    melhorEvitar: string[];
};

export interface Perfil {
    idUsuario: number;
    isConfirmado: boolean;
    medidas: Medidas;
    preferencias: Preferencias;
    isDependente: boolean;
    idDependente?: number;
};