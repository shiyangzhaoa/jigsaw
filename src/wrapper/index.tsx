import React, { useContext } from 'react';

import ctx from '../common/context';
import { WrapperProps } from './wrapper.types';
import FloorWrapper from './floor';
import WidgetWrapper from './widget';

import './wrapper.scss';

const Wrapper = ({ id, children }: React.PropsWithChildren<WrapperProps>) => {
    const { store } = useContext(ctx);
    const { schema } = store;
    const { name } = schema[id].manifest;

    if (name === 'App') {
        return <>{children}</>;
    }

    if (name === 'Floor') {
        return <FloorWrapper id={id}>{children}</FloorWrapper>;
    }

    return <WidgetWrapper id={id}>{children}</WidgetWrapper>;
};

export default Wrapper;
