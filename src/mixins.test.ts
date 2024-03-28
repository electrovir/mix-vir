import {assert} from '@open-wc/testing';
import {assertInstanceOf} from 'run-time-assertions';
import {defineMixin} from './mixin';
import {mixins, mixinsWith} from './mixins';

const noParentMixin = defineMixin(() => {
    return {
        mixinMethod(): number {
            return 56;
        },
        mixinValue: 2,
    };
});

const noParentMixin2 = defineMixin(() => {
    return {
        mixinMethod2(): string {
            return 'hello there';
        },
        mixinValue: 'overridden value',
    };
});

const urlParentMixin = defineMixin((parent: URL) => {
    return {
        mixinMethod(): string {
            return parent.hostname + ' long boi';
        },
        mixinValue: parent.origin,
    };
});
const urlParentMixin2 = defineMixin((parent: URL) => {
    return {
        mixinMethod2(): string {
            return parent.pathname + ' long boi';
        },
    };
});

const dateParentMixin = defineMixin((parent: Date) => {
    return {
        mixinMethod() {
            return parent.toString();
        },
    };
});

describe(mixins.name, () => {
    it('allows mixin properties to be used internally', () => {
        class ExampleClass extends mixins(noParentMixin) {
            doThing() {
                return this.mixinMethod() + this.mixinValue;
            }
        }

        assert.strictEqual(new ExampleClass().doThing(), 58);
    });

    it('works with super', () => {
        class ExampleClass extends mixins(noParentMixin) {
            doThingWithSuper() {
                return super.mixinMethod() + super.mixinValue;
            }
        }

        assert.strictEqual(new ExampleClass().doThingWithSuper(), 58);
    });

    it('can have members overridden', () => {
        class ExampleClass extends mixins(noParentMixin) {
            override mixinMethod = () => {
                return 42;
            };

            override mixinValue = 32;

            doThing() {
                return this.mixinMethod() + this.mixinValue;
            }
        }

        assert.strictEqual(new ExampleClass().doThing(), 74);
    });

    it('overrides mixin properties with later mixins', () => {
        class ExampleClass extends mixins(noParentMixin, noParentMixin2) {
            override mixinMethod = () => {
                return 42;
            };

            override mixinValue = 'should be a string';

            doThing() {
                return this.mixinMethod2() + ' ' + this.mixinValue;
            }
        }

        assert.strictEqual(new ExampleClass().doThing(), 'hello there should be a string');
    });

    it('supports multi-level inheritance', () => {
        class ExampleClass extends mixins(noParentMixin, noParentMixin2) {
            override mixinMethod = () => {
                return 42;
            };

            override mixinValue = 'should be a string';
        }
        class ExampleGrandchildClass extends ExampleClass {
            override mixinMethod = () => {
                return 42;
            };

            doThing() {
                return this.mixinMethod2() + ' ' + this.mixinValue;
            }

            doThingWithSuper() {
                // @ts-expect-error: TS complains about this but it works
                return super.mixinMethod() + ' ' + super.mixinValue;
            }
        }

        assert.strictEqual(
            new ExampleGrandchildClass().doThing(),
            'hello there should be a string',
        );
        assert.strictEqual(new ExampleGrandchildClass().doThingWithSuper(), '56 overridden value');
    });

    it('supports instanceof', () => {
        const mixinsParent = mixins(noParentMixin, noParentMixin2);

        class ExampleClass extends mixinsParent {
            override mixinMethod = () => {
                return 42;
            };

            override mixinValue = 'should be a string';
        }

        assertInstanceOf(new ExampleClass(), mixinsParent);
    });
});

describe(mixinsWith.name, () => {
    it('cannot use mixins when parents are expected', () => {
        // @ts-expect-error: missing parent, needs mixinsWith
        mixins(urlParentMixin);
    });

    it('cannot combine mixins that require different parents', () => {
        // @ts-expect-error: missing parent, needs mixinsWith
        mixinsWith(URL, urlParentMixin, dateParentMixin);
    });

    it('supports multiple mixins with matching parents', () => {
        mixinsWith(URL, urlParentMixin, urlParentMixin2);
    });

    it('supports using a subclass', () => {
        class SubUrl extends URL {}

        mixinsWith(SubUrl, urlParentMixin, urlParentMixin2);
    });

    it('allows mixins to access parent', () => {
        class TestClass extends mixinsWith(URL, urlParentMixin, urlParentMixin2) {
            public doThing() {
                return super.mixinMethod() + ' ' + super.mixinValue;
            }
        }

        assert.strictEqual(
            new TestClass('https://www.example.com').doThing(),
            'www.example.com long boi https://www.example.com',
        );
    });

    /** This test causes an infinite loop. */
    // it('allows overrides and super calls', async () => {
    //     await wrapPromiseInTimeout(
    //         20,
    //         (async () => {
    //             class ParentClass {
    //                 myMethod() {
    //                     console.log('calling parent myMethod');
    //                     return 32;
    //                 }
    //             }

    //             const myMixin = defineMixin((parent: ParentClass) => {
    //                 return {
    //                     myMethod() {
    //                         return 2;
    //                         console.log(parent);
    //                         console.log('calling mixin myMethod');
    //                         return parent.myMethod() + 2;
    //                     },
    //                 };
    //             });

    //             class ChildClass extends mixinsWith(ParentClass, myMixin) {
    //                 public override myMethod = () => {
    //                     console.log('calling child myMethod');
    //                     return super.myMethod() + 10;
    //                 };
    //             }

    //             assert.strictEqual(new ChildClass().myMethod(), 44);
    //         })(),
    //     );
    // });
});
