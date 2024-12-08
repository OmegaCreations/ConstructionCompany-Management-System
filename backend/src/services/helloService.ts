import helloModel from "../models/helloModel";

// business logic
const getHelloMessage = async () => {
  const message = helloModel.getMessage();
  return message;
};

export default { getHelloMessage };
