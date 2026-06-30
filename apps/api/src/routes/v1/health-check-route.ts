import { Router } from "express";

import { authAdmin } from "../middlewares";

export default (router: Router): void => {
  router.get("/health", authAdmin, (req, res) => {
    console.log("LOCALS", req.locals);

    return res.status(200).send({ message: "OK" });
  });
};
