import type {AnyObject} from '@augment-vir/common';
import type {Constructor} from 'type-fest';
import type {Mixin, MixinChain} from './mixin';

/**
 * Combes all given mixins into an extendable class.
 *
 * @category Main
 * @param Mixins All the mixins that will be combined.
 */
export function mixins<const Mixins extends ReadonlyArray<Mixin<void | undefined, AnyObject>>>(
    ...mixins: Mixins
): Constructor<MixinChain<Mixins>, []> {
    const anonymousClass = class {
        constructor() {
            mixins.forEach((mixin) => {
                const mixinResult = mixin();
                Object.assign(this, mixinResult);
                Object.assign(Object.getPrototypeOf(Object.getPrototypeOf(this)), mixinResult);
            });
        }
    };

    return anonymousClass as any;
}

/**
 * Combines all provided mixins into an extendable class that inherits from the given parent class.
 *
 * Same as `mixins` but inherits from the given parent class.
 *
 * @category Main
 */
export function mixinsWith<
    ParentConstructor extends Constructor<any>,
    const Mixins extends ReadonlyArray<
        Mixin<InstanceType<ParentConstructor> | void | undefined, AnyObject>
    >,
>(
    parentClass: ParentConstructor,
    ...mixins: Mixins
): Constructor<
    MixinChain<Mixins> & InstanceType<ParentConstructor>,
    ConstructorParameters<ParentConstructor>
> {
    return class extends parentClass {
        constructor(...params: any[]) {
            super(...params);
            mixins.forEach((mixin) => {
                const mixinResult = mixin(this);
                Object.assign(this, mixinResult);
                Object.assign(Object.getPrototypeOf(Object.getPrototypeOf(this)), mixinResult);
            });
        }
    } as any;
}
