import Lottery from '@/components/Lottery'
import Setting from '@/components/Setting'

const routes = [{
  path: '/',
  title: '抽奖',
  component: Lottery
}, {
  path: '/setting',
  title: '操作',
  component: Setting
}]

export default routes