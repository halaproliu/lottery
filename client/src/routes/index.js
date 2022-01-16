import Lottery from '@/pages/Lotterys'
import Setting from '@/pages/Setting'
import Users from '@/pages/Users'
import Winners from '@/pages/Winners'
import NotArriveUsers from '@/pages/NotArriveUsers'
import PrizeList from '@/pages/PrizeList'

const routes = [{
  path: '/lottery',
  title: '抽奖',
  component: Lottery
}, {
  path: '/prize',
  title: '奖品列表',
  component: PrizeList
}, {
  path: '/user',
  title: '用户列表',
  component: Users
}, {
  path: '/winners',
  title: '用户列表',
  component: Winners
}, {
  path: '/notArriveUsers',
  title: '中奖未到场用户列表',
  component: NotArriveUsers
}, {
  path: '/setting',
  title: '操作',
  component: Setting
}]

export default routes
