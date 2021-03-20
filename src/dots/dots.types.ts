import { Row, Column } from '../common/type';

export interface DotsProps {
    row: Row;
    column: Column;
    onMouseDown: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
