// easier to later change all endpoints' url
// i love working with endpoints this way
//const serverUrl = "https://walicki.azurewebsites.net";
const serverUrl = "http://localhost:9007";
export const endpoint = {
  // user endpoints
  USER_GET_ALL: () => `${serverUrl}/api/user`,
  USER_GET: (pracownik_id: number) => `${serverUrl}/api/user/${pracownik_id}`,
  USER_LOGIN: () => `${serverUrl}/api/auth/login`,
  USER_REFRESH_TOKEN: () => `${serverUrl}/api/auth/refresh`,
  USER_PAYCHECK: (pracownik_id: number) =>
    `${serverUrl}/api/user/${pracownik_id}/paycheck`,

  USER_UPDATE: () => `${serverUrl}/api/user`,
  USER_CREATE: () => `${serverUrl}/api/user`,
  USER_DELETE: () => `${serverUrl}/api/user`,

  // client endpoints
  CLIENT_GET_ALL: () => `${serverUrl}/api/client`,
  CLIENT_GET: (klient_id: number) => `${serverUrl}/api/client/${klient_id}`,
  CLIENT_CREATE: () => `${serverUrl}/api/client`,
  CLIENT_DELETE: () => `${serverUrl}/api/client`,
  CLIENT_UPDATE: () => `${serverUrl}/api/client`,
  CLIENT_GET_AS_CLIENT: (token: string) =>
    `${serverUrl}/api/client/public?token=${token}`,

  // order endpoints
  ORDER_GET_ALL: () => `${serverUrl}/api/order`,
  ORDER_GET: (zlecenie_id: number) => `${serverUrl}/api/order/${zlecenie_id}`,
  ORDER_CLIENT_GET: (klient_id: number) =>
    `${serverUrl}/api/order/client/${klient_id}`,
  ORDER_GET_COSTS: (zlecenie_id: number) =>
    `${serverUrl}/api/order/${zlecenie_id}/costs`,
  ORDER_GET_RESOURCES: (zlecenie_id: number) =>
    `${serverUrl}/api/order/${zlecenie_id}/resources`,
  ORDER_CREATE: () => `${serverUrl}/api/order/`,
  ORDER_DELTE: () => `${serverUrl}/api/order/`,
  ORDER_UPDATE: () => `${serverUrl}/api/order/`,
  ORDER_ADD_RESOURCE: () => `${serverUrl}/api/order/resource/`,
  ORDER_DELETE_RESOURCE: () => `${serverUrl}/api/order/resource/`,
  ORDER_UPDATE_RESOURCE: () => `${serverUrl}/api/order/resource/`,

  // profits
  PROFITS: () => `${serverUrl}/api/order/profits`,

  // workdays endpoints
  WORKDAY_GET_ALL: (year: number, month: number) =>
    `${serverUrl}/api/workday/${month}/${year}`,
  WORKDAY_GET_BY_MONTH: (pracownik_id: number, year: number, month: number) =>
    `${serverUrl}/api/workday/${pracownik_id}/${year}/${month}`,
  WORKDAY_GET_BY_DATE: (
    pracownik_id: number,
    year: number,
    month: number,
    day: number
  ) => `${serverUrl}/api/workday/${pracownik_id}/${year}/${month}/${day}`,
  WORKDAY_ADD: () => `${serverUrl}/api/workday/`,
  WORKDAY_DELETE: () => `${serverUrl}/api/workday/`,
  WORKDAY_UPDATE: () => `${serverUrl}/api/workday/`,
  WORKDAT_GET_TOTAL_HOURS: () => `${serverUrl}/api/workday/workedhours`,

  // warehouse endpoints
  WAREHOUSE_GET_ALL: () => `${serverUrl}/api/warehouse`,
  WAREHOUSE_GET_RESOURCES: (magazyn_id: number) =>
    `${serverUrl}/api/warehouse/${magazyn_id}/resources`,
  WAREHOUSE_CREATE: () => `${serverUrl}/api/warehouse`,
  WAREHOUSE_UPDATE: () => `${serverUrl}/api/warehouse`,
  WAREHOUSE_ADD_RESOURCE: () => `${serverUrl}/api/warehouse/resource`,
  WAREHOUSE_UPDATE_RESOURCE: () => `${serverUrl}/api/warehouse/resource`,
  WAREHOUSE_DELETE: () => `${serverUrl}/api/warehouse`,
  WAREHOUSE_DELETE_RESOURCE: () => `${serverUrl}/api/warehouse/resource`,

  // position endpoints
  POSITION_GET_ALL: () => `${serverUrl}/api/position`,
  POSITION_CREATE: () => `${serverUrl}/api/position`,
  POSITION_DELETE: () => `${serverUrl}/api/position`,
  POSITION_UPDATE: () => `${serverUrl}/api/position`,

  // resources endpoints
  RESOURCE_GET_ALL: () => `${serverUrl}/api/resource`,
  RESOURCE_CREATE: () => `${serverUrl}/api/resource`,
  RESOURCE_DELETE: () => `${serverUrl}/api/resource`,
  RESOURCE_UPDATE: () => `${serverUrl}/api/resource`,

  // shopping list
  SHOPPING_LIST_GET: (year: number, month: number, day: number) =>
    `${serverUrl}/api/shoppinglist/${year}/${month}/${day}`,

  // db reset
  DATABASE_RESET: () => `${serverUrl}/api/db/reset`,
};
