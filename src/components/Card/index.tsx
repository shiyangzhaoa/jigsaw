import React, { memo, PropsWithChildren } from 'react';
import { Card } from 'antd';

import config from './config';
import manifest from './manifest';
import { Props } from './props';

import './index.scss';

const JsCard = ({ children, ...props }: PropsWithChildren<Props>) => {
    return (
        <Card className="js-card" {...props}>
            {children}
        </Card>
    );
};

const options = {
    view: memo(JsCard),
    config,
    manifest,
};

export default options;
