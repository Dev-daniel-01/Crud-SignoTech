import { Router } from "express";
import {optionController} from "./controllers/option.js";
import {pollController} from "./controllers/poll.js";

const routes = Router();


routes.get("/", (req, res) => {
    return res.send("rota de teste");
});


routes.post("/options", optionController.create);
routes.get("/options/:pollId", optionController.read);
routes.put("/options/:id", optionController.update);
routes.delete("/options/:id", optionController.delete);

routes.post("/polls", pollController.create);
routes.get("/polls", pollController.read);
routes.get("/polls/:id", pollController.readOne);
routes.put("/polls/:id", pollController.update);
routes.delete("/polls/:id", pollController.delete);
routes.post("/polls/:pollId/vote/:optionId", pollController.vote);



export default routes;