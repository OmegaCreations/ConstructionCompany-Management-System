// easier to later change all endpoints' url
// i love working with endpoints this way
export const endpoint = {
  // user endpoints
  USER_GET_ALL: () => `http://localhost:5000/api/user`,
  USER_GET: (pracownik_id: number) =>
    `http://localhost:5000/api/user/${pracownik_id}`,
  USER_LOGIN: () => `http://localhost:5000/api/auth/login`,
  USER_REFRESH_TOKEN: () => `http://localhost:5000/api/auth/refresh`,
  USER_PAYCHECK: (pracownik_id: number) =>
    `http://localhost:5000/api/user/${pracownik_id}/paycheck`,

  USER_UPDATE: () => ``,
  USER_CREATE: () => `http://localhost:5000/api/user`,

  // client endpoints
  CLIENT_GET_ALL: () => `http://localhost:5000/api/client`,
  CLIENT_GET: (klient_id: number) =>
    `http://localhost:5000/api/client/${klient_id}`,
  CLIENT_CREATE: () => `http://localhost:5000/api/client`,

  // order endpoints
  ORDER_GET_ALL: () => `http://localhost:5000/api/order`,
  ORDER_GET: (zlecenie_id: number) =>
    `http://localhost:5000/api/order/${zlecenie_id}`,
  ORDER_CLIENT_GET: (klient_id: number) =>
    `http://localhost:5000/api/order/client/${klient_id}`,
  ORDER_GET_COSTS: (zlecenie_id: number) =>
    `http://localhost:5000/api/order/${zlecenie_id}/costs`,
  ORDER_GET_RESOURCES: (zlecenie_id: number) =>
    `http://localhost:5000/api/order/${zlecenie_id}/resources`,
  ORDER_CREATE: () => `http://localhost:5000/api/order/`,
  ORDER_ADD_RESOURCE: () => `http://localhost:5000/api/order/resource/`,

  // profits
  PROFITS: () => `http://localhost:5000/api/order/profits`,

  // workdays endpoints
  WORKDAY_GET_ALL: (year: number, month: number) =>
    `http://localhost:5000/api/workday/${year}/${month}`,
  WORKDAY_GET_BY_MONTH: (pracownik_id: number, year: number, month: number) =>
    `http://localhost:5000/api/workday/${pracownik_id}/${year}/${month}`,
  WORKDAY_GET_BY_DATE: (
    pracownik_id: number,
    year: number,
    month: number,
    day: number
  ) =>
    `http://localhost:5000/api/workday/${pracownik_id}/${year}/${month}/${day}`,
  WORKDAY_ADD: () => `http://localhost:5000/api/workday/`,
  WORKDAT_GET_TOTAL_HOURS: () =>
    `http://localhost:5000/api/workday/workedhours`,

  // warehouse endpoints
  WAREHOUSE_GET_ALL: () => `http://localhost:5000/api/warehouse`,
  WAREHOUSE_GET_RESOURCES: (magazyn_id: number) =>
    `http://localhost:5000/api/warehouse/${magazyn_id}/resources`,
  WAREHOUSE_CREATE: () => `http://localhost:5000/api/warehouse`,
  WAREHOUSE_ADD_RESOURCE: () => `http://localhost:5000/api/warehouse/resource`,

  // position endpoints
  POSITION_GET_ALL: () => `http://localhost:5000/api/position`,
  POSITION_CREATE: () => `http://localhost:5000/api/position`,

  // resources endpoints
  RESOURCE_GET_ALL: () => `http://localhost:5000/api/resource`,
  RESOURCE_CREATE: () => `http://localhost:5000/api/resource`,

  // shopping list
  SHOPPING_LIST_GET: (year: number, month: number, day: number) =>
    `http://localhost:5000/api/shoppinglist/${year}/${month}/${day}`,
};
