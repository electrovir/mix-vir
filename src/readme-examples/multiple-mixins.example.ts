import {defineMixin, mixinsWith} from '..';

export const MyMixin1 = defineMixin((parent: URL) => {
    return {
        myMixinMethod() {
            return parent.origin + 'hello';
        },
    };
});

export const MyMixin2 = defineMixin(() => {
    return {
        myMixinMethod2() {
            return 32;
        },
    };
});

export class MyClass extends mixinsWith(URL, MyMixin1, MyMixin2) {
    public myMethod() {
        return this.myMixinMethod() + this.myMixinMethod2();
    }
}
