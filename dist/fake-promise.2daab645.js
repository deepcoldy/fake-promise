// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
// 判断变量否为function
var isFunction = function isFunction(variable) {
    return typeof variable === 'function';
};
// 定义Promise的三种状态常量
var PENDING = 'PENDING';
var FULFILLED = 'FULFILLED';
var REJECTED = 'REJECTED';
var MyPromise = /** @class */function () {
    function MyPromise(handle) {
        // 添加状态
        this._status = PENDING;
        // 添加状态
        this._value = undefined;
        // 添加成功回调函数队列
        this._fulfilledQueues = [];
        // 添加失败回调函数队列
        this._rejectedQueues = [];
        if (!isFunction(handle)) {
            throw new Error('MyPromise must accept a function as a parameter');
        }
        // 执行handle
        try {
            handle(this._resolve.bind(this), this._reject.bind(this));
        } catch (err) {
            this._reject(err);
        }
    }
    // 添加resovle时执行的函数
    MyPromise.prototype._resolve = function (val) {
        var _this = this;
        var run = function run() {
            if (_this._status !== PENDING) return;
            // 依次执行成功队列中的函数，并清空队列
            var runFulfilled = function runFulfilled(value) {
                var cb;
                while (cb = _this._fulfilledQueues.shift()) {
                    cb(value);
                }
            };
            // 依次执行失败队列中的函数，并清空队列
            var runRejected = function runRejected(error) {
                var cb;
                while (cb = _this._rejectedQueues.shift()) {
                    cb(error);
                }
            };
            /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
              当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
            */
            if (val instanceof MyPromise) {
                val.then(function (value) {
                    _this._value = value;
                    _this._status = FULFILLED;
                    runFulfilled(value);
                }, function (err) {
                    _this._value = err;
                    _this._status = REJECTED;
                    runRejected(err);
                });
            } else {
                _this._value = val;
                _this._status = FULFILLED;
                runFulfilled(val);
            }
        };
        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(run, 0);
    };
    // 添加reject时执行的函数
    MyPromise.prototype._reject = function (err) {
        var _this = this;
        if (this._status !== PENDING) return;
        // 依次执行失败队列中的函数，并清空队列
        var run = function run() {
            _this._status = REJECTED;
            _this._value = err;
            var cb;
            while (cb = _this._rejectedQueues.shift()) {
                cb(err);
            }
        };
        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(run, 0);
    };
    // 添加then方法
    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        var _this = this;
        var _a = this,
            _value = _a._value,
            _status = _a._status;
        // 返回一个新的Promise对象
        return new MyPromise(function (onFulfilledNext, onRejectedNext) {
            // 封装一个成功时执行的函数
            var fulfilled = function fulfilled(value) {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value);
                    } else {
                        var res = onFulfilled(value);
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res);
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err);
                }
            };
            // 封装一个失败时执行的函数
            var rejected = function rejected(error) {
                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(error);
                    } else {
                        var res = onRejected(error);
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext);
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res);
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err);
                }
            };
            switch (_status) {
                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                case PENDING:
                    _this._fulfilledQueues.push(fulfilled);
                    _this._rejectedQueues.push(rejected);
                    break;
                // 当状态已经改变时，立即执行对应的回调函数
                case FULFILLED:
                    fulfilled(_value);
                    break;
                case REJECTED:
                    rejected(_value);
                    break;
            }
        });
    };
    // 添加catch方法
    MyPromise.prototype["catch"] = function (onRejected) {
        return this.then(undefined, onRejected);
    };
    // 添加静态resolve方法
    MyPromise.resolve = function (value) {
        // 如果参数是MyPromise实例，直接返回这个实例
        if (value instanceof MyPromise) return value;
        return new MyPromise(function (resolve) {
            return resolve(value);
        });
    };
    // 添加静态reject方法
    MyPromise.reject = function (value) {
        return new MyPromise(function (resolve, reject) {
            return reject(value);
        });
    };
    // 添加静态all方法
    MyPromise.all = function (list) {
        var _this = this;
        return new MyPromise(function (resolve, reject) {
            /**
             * 返回值的集合
             */
            var values = [];
            var count = 0;
            var _loop_1 = function _loop_1(i, p) {
                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
                _this.resolve(p).then(function (res) {
                    values[i] = res;
                    count++;
                    // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                    if (count === list.length) resolve(values);
                }, function (err) {
                    // 有一个被rejected时返回的MyPromise状态就变成rejected
                    reject(err);
                });
            };
            for (var _i = 0, _a = list.entries(); _i < _a.length; _i++) {
                var _b = _a[_i],
                    i = _b[0],
                    p = _b[1];
                _loop_1(i, p);
            }
        });
    };
    // 添加静态race方法
    MyPromise.race = function (list) {
        var _this = this;
        return new MyPromise(function (resolve, reject) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var p = list_1[_i];
                // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                _this.resolve(p).then(function (res) {
                    resolve(res);
                }, function (err) {
                    reject(err);
                });
            }
        });
    };
    MyPromise.prototype["finally"] = function (cb) {
        return this.then(function (value) {
            return MyPromise.resolve(cb()).then(function () {
                return value;
            });
        }, function (reason) {
            return MyPromise.resolve(cb()).then(function () {
                throw reason;
            });
        });
    };
    return MyPromise;
}();
exports["default"] = MyPromise;
},{}],7:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var fake_promise_1 = __importDefault(require("./fake-promise"));
new fake_promise_1["default"](function (resolve, reject) {
    setTimeout(function () {
        resolve("FULFILLED");
    }, 1000);
});
new fake_promise_1["default"](function (resolve, reject) {
    setTimeout(function () {
        resolve("FULFILLED");
    }, 1000);
});
var promise1 = new fake_promise_1["default"](function (resolve, reject) {
    setTimeout(function () {
        resolve();
    }, 1000);
});
var promise2 = promise1.then(function (res) {
    // 返回一个普通值
    return '这里返回一个普通值1';
});
promise2.then(function (res) {
    console.log(res); //1秒后打印出：这里返回一个普通值
});
var promise3 = new fake_promise_1["default"](function (resolve, reject) {
    setTimeout(function () {
        resolve();
    }, 1000);
});
var promise4 = promise3.then(function (res) {
    // 返回一个Promise对象
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('这里返回一个Promise');
        }, 2000);
    });
});
promise2.then(function (res) {
    console.log(res); //3秒后打印出：这里返回一个Promise
});
},{"./fake-promise":3}],4:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '60306' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[4,7], null)
//# sourceMappingURL=/fake-promise.2daab645.map