/* 
    1、该文件是用于创建一个为Count组件服务的reducer，reducer的本质就是一个函数
    2、reducer函数会接收到两个参数，分别为： 之前的状态（preState） 动作对象（action）
*/
import { CHANGECOLLAPSED } from '../contents'
const isCollapsed = false
export default function IsCollapsed(preState = isCollapsed, action) {
  const { type } = action
  switch (type) {
    case CHANGECOLLAPSED:
      const newState = !preState
      return newState
    default:
      return preState
  }
}
