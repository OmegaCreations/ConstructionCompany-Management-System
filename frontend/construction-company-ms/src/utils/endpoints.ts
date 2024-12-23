// easier to later change all endpoints' url
// i love working with endpoints this way
export const endpoint = {
  // user endpoints
  USER_GET_ALL: () => `http://localhost:5000/api/user`,
  USER_GET: (pracownik_id: number) =>
    `http://localhost:5000/api/user/${pracownik_id}`,
  USER_LOGIN: () => `http://localhost:5000/api/auth/login`,
  USER_PAYCHECK: (pracownik_id: number) =>
    `http://localhost:5000/api/user/${pracownik_id}/paycheck`,

  USER_UPDATE: () => ``,

  // client endpoints
  CLIENT_GET_ALL: () => `http://localhost:5000/api/client`,
  CLIENT_GET: (klient_id: number) =>
    `http://localhost:5000/api/client/${klient_id}`,

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

  // warehouse endpoints
  WAREHOUSE_GET_ALL: () => `http://localhost:5000/api/warehouse`,
  WAREHOUSE_GET_RESOURCES: (magazyn_id: number) =>
    `http://localhost:5000/api/warehouse/${magazyn_id}/resources`,

  // position endpoints
  POSITION_GET_ALL: () => `http://localhost:5000/api/position`,

  // resources endpoints
  RESOURCE_GET_ALL: () => `http://localhost:5000/api/resource`,
};
