// Generated with util/create-component.js
import React from 'react';
import { render } from '@testing-library/react';

import Dots from '.';
import { DotsProps } from './dots.types';

describe('Test Component', () => {
    let props: DotsProps;

    beforeEach(() => {
        props = {
            row: 'center',
            column: 'center',
            onMouseDown: function () {
                //
            },
        };
    });

    const renderComponent = () => render(<Dots {...props} />);

    it('should render foo text correctly', () => {
        const { getByTestId } = renderComponent();

        const component = getByTestId('dots');

        expect(component).toBeInTheDocument();
    });
});
