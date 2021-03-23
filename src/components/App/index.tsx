import React, { PropsWithChildren, useEffect } from 'react';
import useSchema, { ActionEnum } from '../../hooks/use-schema';
import keyCode from '../../common/key-code';
import config from './config';
import manifest from './manifest';

import './index.scss';

const App = ({ children }: PropsWithChildren<void>) => {
    const [store, dispatch] = useSchema();
    const { activityId, schema } = store;

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.code === keyCode.DELETE && activityId) {
            dispatch(ActionEnum.DELETE, schema[activityId]);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [activityId]);

    return <div className="jigsaw-app">{children}</div>;
};

const options = {
    view: App,
    config,
    manifest,
};

export default options;
