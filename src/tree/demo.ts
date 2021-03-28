import { SchemaMap } from '../common/type';

export const treeDataDemo: SchemaMap = {
    '63046433': {
        manifest: {
            name: 'Button',
            cname: '按钮',
            version: '1.0.0',
        },
        config: {
            name: 'Button',
            width: 100,
            height: 30,
            canDrag: true,
            canAddAsChild: false,
            props: {
                btnText: '按钮',
            },
            x: 50,
            y: 99,
        },
        props: {
            btnText: '按钮',
        },
        id: '63046433',
        children: [],
        parent: '63045cfa',
    },
    '63047798': {
        manifest: {
            name: 'Card',
            cname: '卡片',
            version: '1.0.0',
        },
        config: {
            name: 'Card',
            width: 242,
            height: 124,
            canDrag: true,
            canAddAsChild: true,
            props: {
                bordered: false,
                title: '卡片',
            },
            x: 44,
            y: 193,
        },
        props: {
            bordered: false,
            title: '卡片',
        },
        id: '63047798',
        children: ['6304bcf6'],
        parent: '63045cfa',
    },
    App: {
        id: 'App',
        props: {},
        children: ['63043c47', '6304551c'],
        config: {
            name: 'App',
            canDrag: false,
            canAddAsChild: true,
            props: {},
            height: 650,
        },
        manifest: {
            name: 'App',
            cname: '拼图',
            version: '1.0.0',
        },
    },
    '63043c47': {
        manifest: {
            name: 'Floor',
            cname: '楼',
            version: '1.0.0',
        },
        config: {
            name: 'Floor',
            width: '100%',
            x: 0,
            y: 0,
            height: 650,
            canDrag: false,
            canAddAsChild: true,
            props: {},
        },
        props: {},
        id: '63043c47',
        children: ['63045cfa'],
        parent: 'App',
    },
    '6304551c': {
        manifest: {
            name: 'Floor',
            cname: '楼',
            version: '1.0.0',
        },
        config: {
            name: 'Floor',
            width: '100%',
            x: 0,
            y: 0,
            height: 650,
            canDrag: false,
            canAddAsChild: true,
            props: {},
        },
        props: {},
        id: '6304551c',
        children: ['6304d5a6', '6304d7f6', '6304d8ac'],
        parent: 'App',
    },
    '63045cfa': {
        manifest: {
            name: 'Card',
            cname: '楼',
            version: '1.0.0',
        },
        config: {
            name: 'Card',
            width: 316,
            height: 350,
            canDrag: true,
            canAddAsChild: true,
            props: {
                bordered: false,
                title: '卡片',
            },
            x: 25,
            y: 25,
        },
        props: {
            bordered: false,
            title: '卡片',
        },
        id: '63045cfa',
        children: ['63046433', '63047798'],
        parent: '63043c47',
    },
    '6304bcf6': {
        manifest: {
            name: 'Button',
            cname: '楼',
            version: '1.0.0',
        },
        config: {
            name: 'Button',
            width: 100,
            height: 30,
            canDrag: true,
            canAddAsChild: false,
            props: {
                btnText: '按钮',
            },
            x: 44,
            y: 69,
        },
        props: {
            btnText: '按钮',
        },
        id: '6304bcf6',
        children: [],
        parent: '63047798',
    },
    '6304d5a6': {
        manifest: {
            name: 'Button',
            cname: '按钮',
            version: '1.0.0',
        },
        config: {
            name: 'Button',
            width: 100,
            height: 30,
            canDrag: true,
            canAddAsChild: false,
            props: {
                btnText: '按钮',
            },
            x: 0,
            y: 0,
        },
        props: {
            btnText: '按钮',
        },
        id: '6304d5a6',
        children: [],
        parent: '6304551c',
    },
    '6304d7f6': {
        manifest: {
            name: 'Button',
            cname: '按钮',
            version: '1.0.0',
        },
        config: {
            name: 'Button',
            width: 100,
            height: 30,
            canDrag: true,
            canAddAsChild: false,
            props: {
                btnText: '按钮',
            },
            x: 0,
            y: 30,
        },
        props: {
            btnText: '按钮',
        },
        id: '6304d7f6',
        children: [],
        parent: '6304551c',
    },
    '6304d8ac': {
        manifest: {
            name: 'Card',
            cname: '卡片',
            version: '1.0.0',
        },
        config: {
            name: 'Card',
            width: 316,
            height: 350,
            canDrag: true,
            canAddAsChild: true,
            props: {
                title: '卡片',
            },
            x: 0,
            y: 60,
        },
        props: {
            bordered: false,
            title: '卡片',
        },
        id: '6304d8ac',
        children: [],
        parent: '6304551c',
    },
};
