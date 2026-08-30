import { CreateSet } from "../../entities/set";
import { SetsRepository } from "../../repositories/sets-repository";
import { AddNewSetUseCase } from "../add-new-set-use-case";

describe("AddNewSetUseCase", () => {
  let mockSetsRepository: jest.Mocked<SetsRepository>;
  let addNewSetUseCase: AddNewSetUseCase;

  beforeEach(() => {
    mockSetsRepository = {
      addNewSet: jest.fn(),
      removeSet: jest.fn(),
      updateSet: jest.fn(),
      getSets: jest.fn(),
      getLastSession: jest.fn(),
    };
    addNewSetUseCase = new AddNewSetUseCase(mockSetsRepository);
  });

  it("registra una serie en el ejercicio", async () => {
    const set: CreateSet = {
      weight: "80",
      reps: "5",
      performed_at: "2026-08-29T12:00:00.000Z",
    };

    mockSetsRepository.addNewSet.mockResolvedValue();

    await addNewSetUseCase.addNewset(set, 10);

    expect(mockSetsRepository.addNewSet).toHaveBeenCalledWith(set, 10);
  });

  it("propaga el error si no se puede guardar la serie", async () => {
    const set: CreateSet = {
      weight: "80",
      reps: "5",
      performed_at: "2026-08-29T12:00:00.000Z",
    };

    mockSetsRepository.addNewSet.mockRejectedValue(new Error("falla"));

    await expect(addNewSetUseCase.addNewset(set, 10)).rejects.toThrow("falla");
  });
});
