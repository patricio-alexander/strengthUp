import { WorkoutRepository } from "../../repositories/workout-repository";
import { AddWorkoutUseCase } from "../add-workout-use-case";

describe("AddWorkoutUseCase", () => {
  let mockWorkoutRepository: jest.Mocked<WorkoutRepository>;
  let addWorkoutUseCase: AddWorkoutUseCase;

  beforeEach(() => {
    mockWorkoutRepository = {
      getUserWorkout: jest.fn(),
      removeWorkout: jest.fn(),
      updateWorkout: jest.fn(),
      addWorkout: jest.fn(),
    };
    addWorkoutUseCase = new AddWorkoutUseCase(mockWorkoutRepository);
  });

  it("agrega una rutina para el usuario", async () => {
    mockWorkoutRepository.addWorkout.mockResolvedValue();

    await addWorkoutUseCase.add("Push Pull", "user-1");

    expect(mockWorkoutRepository.addWorkout).toHaveBeenCalledWith(
      "Push Pull",
      "user-1",
    );
  });

  it("propaga el error si no se puede crear la rutina", async () => {
    mockWorkoutRepository.addWorkout.mockRejectedValue(new Error("falla"));

    await expect(addWorkoutUseCase.add("Push Pull", "user-1")).rejects.toThrow(
      "falla",
    );
  });
});
