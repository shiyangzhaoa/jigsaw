import React from 'react';

export interface Props {
    style?: React.CSSProperties;
    hoverable?: boolean;
    bordered?: boolean;
    title?: string;
    size?: 'default' | 'small';
}
