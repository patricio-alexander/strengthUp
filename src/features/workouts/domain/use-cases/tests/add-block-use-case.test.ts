import { CreateBlock } from "../../entities/block";
import { BlockRepository } from "../../repositories/block-repository";
import { AddBlockUseCase } from "../add-block-use-case";

describe("AddBlockUseCase", () => {
  let mockedBlockRepository: jest.Mocked<BlockRepository>;
  let addBlockUseCase: AddBlockUseCase;

  beforeEach(() => {
    mockedBlockRepository = {
      addBlock: jest.fn(),
      getBlockById: jest.fn(),
      getBlocksByWorkoutId: jest.fn(),
      orderBlocks: jest.fn(),
      removeBlock: jest.fn(),
      updateBlock: jest.fn(),
    };

    addBlockUseCase = new AddBlockUseCase(mockedBlockRepository);
  });

  it("agrega un bloque de entrenamiento", async () => {
    const block: CreateBlock = {
      dayKey: "0",
      name: "monday",
      workoutId: "1",
    };

    mockedBlockRepository.addBlock.mockResolvedValue();

    await addBlockUseCase.add(block);

    expect(mockedBlockRepository.addBlock).toHaveBeenLastCalledWith(block);
  });

  it("lanza un error al intentar agregar un entrenamiento", async () => {
    const block: CreateBlock = {
      dayKey: "0",
      name: "monday",
      workoutId: "1",
    };

    mockedBlockRepository.addBlock.mockRejectedValue(new Error("falla"));

    await expect(addBlockUseCase.add(block)).rejects.toThrow("falla");
  });
});
