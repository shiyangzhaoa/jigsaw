// Generated with script/create-component.js
import React from 'react';

import { toolsProps } from './tools.types';

import './tools.scss';

const tools: React.FC<toolsProps> = ({ foo }) => (
    <div data-testid="tools" className="foo-bar">
        {foo}
    </div>
);

export default tools;
