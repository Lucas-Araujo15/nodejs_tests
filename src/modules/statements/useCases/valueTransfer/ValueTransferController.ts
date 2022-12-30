import { Request, Response } from "express";
import { container } from "tsyringe";

import { TransferViewModel } from "../../../../shared/infra/http/viewModels/TransferViewModel";
import { ValueTransferUseCase } from "./ValueTransferUseCase";

class ValueTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { amount, description } = request.body;
    const { id: receiver_id } = request.params;

    const valueTransferUseCase = container.resolve(ValueTransferUseCase);

    const transfer = await valueTransferUseCase.execute({
      amount,
      description,
      receiver_id,
      sender_id,
    });

    return response.json(TransferViewModel.toHTTP(transfer));
  }
}

export { ValueTransferController };
