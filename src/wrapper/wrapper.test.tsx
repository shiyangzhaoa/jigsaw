// Generated with script/create-component.js
import React from 'react';
import { render } from '@testing-library/react';

import Wrapper from '.';
import { WrapperProps } from './wrapper.types';

describe('Test Component', () => {
    let props: WrapperProps;

    beforeEach(() => {
        props = {
            width: 100,
            height: 100,
        };
    });

    const renderComponent = () => render(<Wrapper {...props} />);

    it('should render foo text correctly', () => {
        props.width = 200;
        const { getByTestId } = renderComponent();

        const component = getByTestId('wrapper');

        expect(component).toHaveTextContent('harvey was here');
    });
});
