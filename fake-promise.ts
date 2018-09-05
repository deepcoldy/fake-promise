// 判断变量否为function
const isFunction = variable => typeof variable === "function";

// 定义Promise的三种状态常量

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
export default class fakePromise {
  // 添加状态
  _status = PENDING;
  _value = undefined;
  _fulfilledQueues = [];
  // 添加失败回调函数队列
  _rejectedQueues = [];

  constructor(handle: (resolve?: any, reject?: any) => void) {
    if (!isFunction(handle)) {
      throw new Error("MyPromise must accept a function as a parameter");
    }

    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }
  // 添加resovle时执行的函数
  _resolve(val) {
    if (this._status !== PENDING) return;
    this._status = FULFILLED;
    this._value = val;
  }
  // 添加reject时执行的函数
  _reject(err) {
    if (this._status !== PENDING) return;
    this._status = REJECTED;
    this._value = err;
  }
  // 添加then方法
  then(onFulfilled?: any, onRejected?: any) {
    const { _value, _status } = this;
    switch (_status) {
      // 当状态为pending时，将then方法回调函数加入执行队列等待执行
      case PENDING:
        this._fulfilledQueues.push(onFulfilled);
        this._rejectedQueues.push(onRejected);
        break;
      // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        onFulfilled(_value);
        break;
      case REJECTED:
        onRejected(_value);
        break;
    }
    // 返回一个新的Promise对象
    return new fakePromise((onFulfilledNext, onRejectedNext) => {});
  }
}
