import React, { PropsWithChildren, memo } from 'react';
import config from './config';
import manifest from './manifest';

const Floor = ({ children }: PropsWithChildren<void>) => {
    return <div>{children}</div>;
};

const options = {
    view: memo(Floor),
    config,
    manifest,
};

export default options;
