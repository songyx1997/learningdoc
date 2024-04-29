/**
 * 帮助TypeScript编译器识别项目中使用的非标准或自定义类型
 */
declare module '*.less' {
    interface ClassNames {
        [className: string]: string;
    }
    const classes: ClassNames;
    export = classes;
}

/**
 * 解决TypeScript编译器无法找到对应模块的类型定义
 */
declare module 'uuid' {
    export function v4(): string;
}