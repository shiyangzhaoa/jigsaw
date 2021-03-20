import React from 'react';
import { Button } from 'antd';

import useSchema from '../../hooks/use-schema';
import config from './config';
import manifest from './manifest';
import { Props } from './props';

import './index.scss';

const JsButton = ({ btnText, ...props }: Props) => {
    const [store] = useSchema();

    return (
        <Button className="js-button" {...props}>
            {btnText}
        </Button>
    );
};

const options = {
    view: JsButton,
    config,
    manifest,
};

export default options;
