import { Router } from "express";

import { authAdmin } from "../middlewares";

export default (router: Router): void => {
  router.get("/health", authAdmin, (_, res) =>
    res.status(200).send({ message: "OK" }),
  );
};
