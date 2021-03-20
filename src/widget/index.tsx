import React, { PropsWithChildren } from 'react';

import useSchema, { ActionEnum } from '../hooks/use-schema';
import { createCpnSchema } from '../utils';
import { widgetProps } from './widget.types';

import './widget.scss';

const prefix = 'jigsaw-widget';

const Widget = ({ manifest, children }: PropsWithChildren<widgetProps>) => {
    const [store, dispatch] = useSchema();

    const handleClick = () => {
        const schema = createCpnSchema(store, manifest);
        dispatch(ActionEnum.ADD, schema);
    };

    return (
        <div data-testid="widget" className={prefix} onClick={handleClick}>
            {children}
        </div>
    );
};

export default Widget;
