import { useMemo } from 'react';

export interface Props {
    headerTitle: string;
}

export function useAppHeaderViewModel({ headerTitle }: Props) {
    const title = useMemo(() => headerTitle, [headerTitle]);

    return {
        title,
    };
};