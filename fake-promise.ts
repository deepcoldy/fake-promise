export default class fakePromise {
  status = 'pending'
  value = undefined
  reason = undefined
  resolve = (value) =>{
    if (this.status === 'pending') {
      // resolve调用后，status转化为成功态
      this.status = 'fulfilled';
      // 储存成功的值
      this.value = value;
    }
  }
  reject = (reason) => {
    if (this.status === 'pending') {
      // reject调用后，status转化为失败态
      this.status = 'rejected';
      // 储存失败的原因
      this.reason = reason;
    }
  }
  catch = () => {

  }
  finally = () => {

  }
  then = (onFulfilled, onRejected) =>{
    // 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.status === 'fulfilled') {
      onFulfilled(this.value);
    };
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.status === 'rejected') {
      onRejected(this.reason);
    };
    return this
  }
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {

    }
  }
  
  
  
}
