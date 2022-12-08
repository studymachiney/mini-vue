import { isObject } from "@vue/shared";

const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

const reactiveMap = new WeakMap();
const mutableHandlers: ProxyHandler<object> = {
  get(target, key, receiver) {
    // 在get中增加标识，当获取IS_REACTIVE时返回true
    if(key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    const res = Reflect.get(target, key, receiver);
    return res;
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    return result;
  },
};

function createReactiveObject(target: object, isReadonly: boolean) {
  if (!isObject(target)) {
    return target;
  }

  if(target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 如果已经代理过则直接返回代理后的对象
  const existProxy = reactiveMap.get(target)
  if(existProxy) {
    return existProxy
  }
  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}

export function reactive<T extends object>(target: T): T {
  return createReactiveObject(target, false)
}
