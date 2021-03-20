import React, { PropsWithChildren } from 'react';
import config from './config';
import manifest from './manifest';

const Floor = ({ children }: PropsWithChildren<void>) => {
    return <div>{children}</div>;
};

const options = {
    view: Floor,
    config,
    manifest,
};

export default options;
