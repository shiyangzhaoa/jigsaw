import React from 'react';
import clsx from 'clsx';

import { DotsProps } from './dots.types';

import './dots.scss';

const Dots = ({ row, column, onMouseDown }: DotsProps) => {
    return (
        <div
            data-testid="dots"
            className={clsx('jigsaw-dots', `jigsaw-dots__${row}-${column}`)}
            onMouseDown={onMouseDown}
        ></div>
    );
};

export default Dots;
