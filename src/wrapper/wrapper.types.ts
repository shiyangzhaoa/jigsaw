import { Config } from '../common/type';

export interface WrapperProps {
    id?: string;
    parentId?: string;
    config: Config;
    childrenId?: WrapperProps[];
    onSave?: (schema: unknown) => void;
}
