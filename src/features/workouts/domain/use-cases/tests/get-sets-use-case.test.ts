import { FilterSets } from "@/types/filterSets";
import { GroupSetsByDate } from "@/types/groupByDay";
import { SetsRepository } from "../../repositories/sets-repository";
import { GetSetsUseCase } from "../get-sets-use-case";

describe("GetSetsUseCase", () => {
  let mockSetsRepository: jest.Mocked<SetsRepository>;
  let getSetsUseCase: GetSetsUseCase;

  beforeEach(() => {
    mockSetsRepository = {
      addNewSet: jest.fn(),
      removeSet: jest.fn(),
      updateSet: jest.fn(),
      getSets: jest.fn(),
      getLastSession: jest.fn(),
    };
    getSetsUseCase = new GetSetsUseCase(mockSetsRepository);
  });

  it("devuelve las series del ejercicio segun el filtro", async () => {
    const grouped: GroupSetsByDate[] = [
      {
        date: "2026-08-29",
        sets: [
          {
            id: "1",
            weight: "80",
            reps: "5",
            performed_at: "2026-08-29T12:00:00.000Z",
          },
        ],
      },
    ];

    mockSetsRepository.getSets.mockResolvedValue(grouped);

    const result = await getSetsUseCase.getSets(10, FilterSets.today);

    expect(result).toEqual(grouped);
    expect(mockSetsRepository.getSets).toHaveBeenCalledWith(
      10,
      FilterSets.today,
    );
  });
});
