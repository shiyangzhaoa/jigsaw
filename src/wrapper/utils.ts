import { isNumber } from '../utils';
import { Config, Position, Row, Column } from '../common/type';

export const getDotsLocBy = (config: Config) => {
    const { x, y, width, height } = config;
    if (typeof height !== 'number') {
        throw new Error('width/height should be a number');
    }

    const one = {
        x,
        y,
    };
    const two = {
        x: isNumber(width) ? x + width : x,
        y,
    };
    const three = {
        x,
        y: y + height,
    };
    const four = {
        x: isNumber(width) ? x + width : x,
        y: y + height,
    };

    return [one, two, three, four] as const;
};

export const getReverseBy = (config: Config, row: Row, col: Column) => {
    const dotsList = getDotsLocBy(config);
    const index = dotsList.length - 1;
    let num;
    if (row === 'left' && col === 'top') {
        num = 3;
    }
    if (row === 'left' && col === 'center') {
        num = 1;
    }
    if (row === 'left' && col === 'bottom') {
        num = 1;
    }
    if (row === 'center' && col === 'top') {
        num = 3;
    }
    if (row === 'center' && col === 'bottom') {
        num = 0;
    }
    if (row === 'right' && col === 'top') {
        num = 2;
    }
    if (row === 'right' && col === 'center') {
        num = 0;
    }
    if (row === 'right' && col === 'bottom') {
        num = 0;
    }

    return [dotsList[index - num], dotsList[num]] as const;
};

export const resolveMouseEffect = (firstLoc: Position, realLoc: Position) => {
    const { x, y } = firstLoc;
    let newX: number;
    let newY: number;

    if (realLoc.x < x) {
        newX = realLoc.x;
    } else {
        newX = x;
    }

    if (realLoc.y < y) {
        newY = realLoc.y;
    } else {
        newY = y;
    }

    const w = Math.abs(realLoc.x - x);
    const h = Math.abs(realLoc.y - y);

    return [newX, newY, w, h] as const;
};

export const getValidByRange = (num: number, min: number, max: number) => {
    if (num < min) {
        return min;
    }
    if (num > max) {
        return max;
    }

    return num;
};
