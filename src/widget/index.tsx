import React, { PropsWithChildren } from 'react';

import useSchema, { ActionEnum } from '../hooks/use-schema';
import { createCpnSchema } from '../utils';
import { WidgetProps } from './widget.types';

import './widget.scss';

const prefix = 'jigsaw-widget';

const Widget = ({ manifest, children }: PropsWithChildren<WidgetProps>) => {
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
