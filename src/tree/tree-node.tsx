// import React from 'react';
// import clsx from 'clsx';

// import { prefix } from './constant';
// import { TreeNodeProps } from './tree.types';

// const baseClassName = `${prefix}-indent`;

// const TreeNode = ({ id, key, depth, schema }: TreeNodeProps) => {
//     const list: React.ReactElement[] = [];

//     for (let i = 0; i < depth; i++) {
//         list.push(
//             <span
//                 key={i}
//                 className={clsx(baseClassName, {
//                 [`${baseClassName}-start`]: isStart[i],
//                 [`${baseClassName}-end`]: isEnd[i],
//                 })}
//             />
//         );
//     }

//     return (
//         <div>
//             <span aria-hidden="true" className={`${prefix}-indent`}>
//                 {Array.from({ length: depth - 1 }).map((_, index) => (
//                     <span key={index} className={`ant-tree-indent-unit ant-tree-indent-unit-start`}></span>
//                 ))}
//             </span>
//         </div>
//     );
// };

// export default TreeNode;
