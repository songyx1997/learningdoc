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