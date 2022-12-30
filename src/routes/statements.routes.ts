import { Router } from "express";

import { CreateStatementController } from "../modules/statements/useCases/createStatement/CreateStatementController";
import { GetBalanceController } from "../modules/statements/useCases/getBalance/GetBalanceController";
import { GetStatementOperationController } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationController";
import { ValueTransferController } from "../modules/statements/useCases/valueTransfer/ValueTransferController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const valueTransferController = new ValueTransferController();

statementRouter.use(ensureAuthenticated);

statementRouter.get("/balance", getBalanceController.execute);
statementRouter.post("/deposit", createStatementController.execute);
statementRouter.post("/withdraw", createStatementController.execute);
statementRouter.get("/:statement_id", getStatementOperationController.execute);
statementRouter.post("/transfers/:id", valueTransferController.handle);

export { statementRouter };
