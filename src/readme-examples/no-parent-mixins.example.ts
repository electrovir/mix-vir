import {defineMixin, mixins} from '..';

const MyMixin = defineMixin(() => {
    return {
        myMixinMethod(): number {
            return 100;
        },
        myMixinVariable: 'value',
    };
});

export class MyClass extends mixins(MyMixin) {
    public myMethod() {
        return this.myMixinMethod();
    }
}
