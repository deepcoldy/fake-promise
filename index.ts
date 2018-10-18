import fakePromise from "./fake-promise";

new fakePromise((resolve, reject) => {
  setTimeout(() => {
    resolve("FULFILLED");
  }, 1000);
});


new fakePromise((resolve, reject) => {
  setTimeout(() => {
    resolve("FULFILLED");
  }, 1000);
});


let promise1 = new fakePromise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})
let promise2 = promise1.then(res => {
  // 返回一个普通值
  return '这里返回一个普通值1'
})
promise2.then(res => {
  console.log(res) //1秒后打印出：这里返回一个普通值
})


let promise3 = new fakePromise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});
let promise4 = promise3.then(res => {
  // 返回一个Promise对象
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('这里返回一个Promise')
    }, 2000)
  })
})
promise2.then(res => {
  console.log(res) //3秒后打印出：这里返回一个Promise
})
