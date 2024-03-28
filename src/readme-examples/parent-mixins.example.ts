import {defineMixin, mixinsWith} from '..';

export const MyMixin = defineMixin((parent: URL) => {
    return {
        myMixinMethod() {
            return parent.origin + 'hello';
        },
    };
});

export class MyClass extends mixinsWith(URL, MyMixin) {
    public myMethod() {
        return this.myMixinMethod();
    }
}
