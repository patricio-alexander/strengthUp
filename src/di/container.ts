import { AuthRepositoryImpl } from "@features/auth/data/repositories/auth-repository";
import { LoginUseCase } from "@features/auth/domain/use-cases/login-use-case";
import { GetUserByIdUseCase } from "@features/user/domain/use-cases/get-user-by-id-use-case";
import { UserRepositoryImpl } from "../features/user/data/user-repository";
import { GetUserWorkoutUseCase } from "@features/workouts/domain/use-cases/get-user-workout-use-case";
import { WorkoutRepositoryImpl } from "@features/workouts/data/repositories/workout-repository";
import { RemoveWorkoutUseCase } from "@features/workouts/domain/use-cases/remove-workout-use-case";
import { BlockRepositoryImpl } from "@features/workouts/data/repositories/block-repository";
import { GetBlocksUseCase } from "@features/workouts/domain/use-cases/get-blocks-use-case";
import { OrderBlocksUseCase } from "@features/workouts/domain/use-cases/order-blocks-use-case";
import { AddWorkoutUseCase } from "@features/workouts/domain/use-cases/add-workout-use-case";
import { AddBlockUseCase } from "@features/workouts/domain/use-cases/add-block-use-case";
import { GetBlockByIdUseCase } from "@features/workouts/domain/use-cases/get-block-by-id-use-case";
import { UpdateBlockUseCase } from "@features/workouts/domain/use-cases/update-block-use-case";
import { RemoveBlockUseCase } from "@features/workouts/domain/use-cases/remove-block-use-case";

// Dependency Injection
// Injeccion de depencias -> usecase(repositoryImpl)
const loginUseCase = new LoginUseCase(new AuthRepositoryImpl());
const getUserByIdUseCase = new GetUserByIdUseCase(new UserRepositoryImpl());

const workoutRepository = new WorkoutRepositoryImpl();
const getUserWorkoutUseCase = new GetUserWorkoutUseCase(workoutRepository);
const removeWorkoutUseCase = new RemoveWorkoutUseCase(workoutRepository);
const addWorkoutUseCase = new AddWorkoutUseCase(workoutRepository);

const blockRepository = new BlockRepositoryImpl();
const getBlocksUseCase = new GetBlocksUseCase(blockRepository);
const orderBlocksUseCase = new OrderBlocksUseCase(blockRepository);
const addBlockUseCase = new AddBlockUseCase(blockRepository);
const getBlockByIdUseCase = new GetBlockByIdUseCase(blockRepository);
const updateBlockUseCase = new UpdateBlockUseCase(blockRepository);
const removeBlockUseCase = new RemoveBlockUseCase(blockRepository);

export {
  loginUseCase,
  getUserByIdUseCase,
  getUserWorkoutUseCase,
  removeWorkoutUseCase,
  getBlocksUseCase,
  orderBlocksUseCase,
  addWorkoutUseCase,
  addBlockUseCase,
  getBlockByIdUseCase,
  updateBlockUseCase,
  removeBlockUseCase,
};
