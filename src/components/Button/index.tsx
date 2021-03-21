import React, { memo } from 'react';
import { Button } from 'antd';

import config from './config';
import manifest from './manifest';
import { Props } from './props';

import './index.scss';

const JsButton = ({ btnText, ...props }: Props) => {
    return (
        <Button className="js-button" {...props}>
            {btnText}
        </Button>
    );
};

const options = {
    view: memo(JsButton),
    config,
    manifest,
};

export default options;
