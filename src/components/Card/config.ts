import { Config } from '../../common/type';
import { Props } from './props';

const config: Config<Props> = {
    name: 'Card',
    width: 300,
    height: 180,
    canDrag: true,
    canAddAsChild: true,
    props: {
        // 会导致 1px 误差
        bordered: false,
        title: '卡片',
    },
};

export default config;
