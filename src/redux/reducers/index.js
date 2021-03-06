/* 
    该文件用于汇总所有的 reducer 为一个总的reducer
*/

// 引入 combineReducers 用于汇总多个reducer
import { combineReducers } from 'redux'

import IsCollapsed from './CollapsedReducer.js'

// 持久化的引用
import storage from 'redux-persist/lib/storage' // defaults to sessionStorage for web
// 用来定义保存状态的持久化信息
export const persistConfig = {
    key: 'redux_state',
    storage,
    // 黑名单  里面的状态 不作持久化
    blacklist: [],
}
export const allReducers = combineReducers({
    IsCollapsed
})
