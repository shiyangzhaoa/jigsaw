import { Config } from '../../common/type';
import { Props } from './props';

const config: Config & { props: Props } = {
    name: 'Button',
    width: 100,
    height: 30,
    canDrag: true,
    canAddAsChild: false,
    props: {
        btnText: '按钮',
    },
};

export default config;
