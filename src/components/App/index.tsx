import React, { PropsWithChildren } from 'react';
import config from './config';
import manifest from './manifest';

import './index.scss';

const App = ({ children }: PropsWithChildren<void>) => {
    return <div className="jigsaw-app">{children}</div>;
};

const options = {
    view: App,
    config,
    manifest,
};

export default options;
