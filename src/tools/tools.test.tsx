// Generated with script/create-component.js
import React from 'react';
import { render } from '@testing-library/react';

import Tools from '.';
import { toolsProps } from './tools.types';

describe('Test Component', () => {
    let props: toolsProps;

    beforeEach(() => {
        props = {
            foo: 'bar',
        };
    });

    const renderComponent = () => render(<Tools {...props} />);

    it('should render foo text correctly', () => {
        props.foo = 'harvey was here';
        const { getByTestId } = renderComponent();

        const component = getByTestId('tools');

        expect(component).toHaveTextContent('harvey was here');
    });
});
