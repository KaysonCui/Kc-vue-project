const POST = 'post'
const GET = 'get'

const ApiSetting = {
  userLogin: {
    url: '/login',
    method: POST
  },
  getStore: {
    url: '/buffet-meal/store/{store_id}',
    method: GET
  },
  makeOrder: {
    url: '/buffet-meal/order',
    method: POST
  },
  editOrder: {
    url: '/buffet-meal/order/edit/{id}',
    method: POST
  },
  addOrder: {
    url: '/buffet-meal/order/add/{id}',
    method: POST
  },
  getOrder: {
    url: '/buffet-meal/order/{id}',
    method: GET
  },
  payOrder: {
    url: '/buffet-meal/order/{id}/pay',
    method: POST
  },
  payCallBack: {
    url: '/pay/client/{id}',
    method: POST
  }
}

export default ApiSetting

export const ApiPath = __API_PATH__
