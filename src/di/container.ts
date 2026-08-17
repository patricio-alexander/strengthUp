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
import { AddPushTokenUseCase } from "@features/notifications/domain/user-cases/add-push-token-use-case";
import { CheckPushTokenUseCase } from "@features/notifications/domain/user-cases/check-push-token-use-case";
import { NotificationRespositoryImpl } from "@features/notifications/data/repositories/notificatoin-respository";
import { UserSettingsUseCase } from "@features/user/domain/use-cases/user-settings";
import { SetsRepositoryImpl } from "@features/workouts/data/repositories/sets-repository";
import { AddNewSetUseCase } from "@features/workouts/domain/use-cases/add-new-set-use-case";
import { ExerciseRepositoryImpl } from "@features/workouts/data/repositories/exercise-repository";
import { GetExercisesUseCase } from "@features/workouts/domain/use-cases/get-exercises-use-case";
import { GetDefaultExercisesUseCase } from "@features/workouts/domain/use-cases/get-default-exercises-use-case";
import { RemoveExerciseUseCase } from "@features/workouts/domain/use-cases/remove-exercise-use-case";
import { AddExerciseUseCase } from "@features/workouts/domain/use-cases/add-exercise-use-case";
import { UpdateExerciseUseCase } from "@features/workouts/domain/use-cases/update-exercise-use-case";
import { GetSelectedExercisesUseCase } from "@features/workouts/domain/use-cases/get-selected-exercises-use-case";
import { AddExerciseToWorkoutUseCase } from "@features/workouts/domain/use-cases/add-exercise-to-workout-use-case";
import { RemoveExerciseFromWorkoutUseCase } from "@features/workouts/domain/use-cases/remove-exercise-from-workout-use-case";
import { OrderSelectedExercisesUseCase } from "@features/workouts/domain/use-cases/order-selected-exercises-use-case";
import { GetSetsUseCase } from "@features/workouts/domain/use-cases/get-sets-use-case";
import { GetLastSessionUseCase } from "@features/workouts/domain/use-cases/get-last-session-use-case";
import { RemoveSetUseCase } from "@features/workouts/domain/use-cases/remove-set-use-case";

// Dependency Injection
// Injeccion de depencias -> usecase(repositoryImpl)
const loginUseCase = new LoginUseCase(new AuthRepositoryImpl());
const userRepository = new UserRepositoryImpl();
const blockRepository = new BlockRepositoryImpl();
const notificationRepository = new NotificationRespositoryImpl();
const workoutRepository = new WorkoutRepositoryImpl();
const setsRepository = new SetsRepositoryImpl();
const exercisesRepository = new ExerciseRepositoryImpl();

const removeSetUseCase = new RemoveSetUseCase(setsRepository);

const addNewSetUseCase = new AddNewSetUseCase(setsRepository);
const getSetsUseCase = new GetSetsUseCase(setsRepository);
const getUserWorkoutUseCase = new GetUserWorkoutUseCase(workoutRepository);
const removeWorkoutUseCase = new RemoveWorkoutUseCase(workoutRepository);
const addWorkoutUseCase = new AddWorkoutUseCase(workoutRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const getExercisesUseCase = new GetExercisesUseCase(exercisesRepository);
const getDefaultExercisesUseCase = new GetDefaultExercisesUseCase(
  exercisesRepository,
);
const getLastSessionUseCase = new GetLastSessionUseCase(setsRepository);

const removeExerciseUseCase = new RemoveExerciseUseCase(exercisesRepository);
const addExerciseUseCase = new AddExerciseUseCase(exercisesRepository);
const updateExerciseUseCase = new UpdateExerciseUseCase(exercisesRepository);
const getSelectedExercisesUseCase = new GetSelectedExercisesUseCase(
  exercisesRepository,
);
const addExerciseToWorkoutUseCase = new AddExerciseToWorkoutUseCase(
  exercisesRepository,
);
const removeExerciseFromWorkoutUseCase = new RemoveExerciseFromWorkoutUseCase(
  exercisesRepository,
);
const orderSelectedExercisesUseCase = new OrderSelectedExercisesUseCase(
  exercisesRepository,
);
const getUserSettingsUseCase = new UserSettingsUseCase(userRepository);

const getBlocksUseCase = new GetBlocksUseCase(blockRepository);
const orderBlocksUseCase = new OrderBlocksUseCase(blockRepository);
const addBlockUseCase = new AddBlockUseCase(blockRepository);
const getBlockByIdUseCase = new GetBlockByIdUseCase(blockRepository);
const updateBlockUseCase = new UpdateBlockUseCase(blockRepository);
const removeBlockUseCase = new RemoveBlockUseCase(blockRepository);
const addPushTokenUseCase = new AddPushTokenUseCase(notificationRepository);
const checkPushTokenExistsUseCase = new CheckPushTokenUseCase(
  notificationRepository,
);

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
  addPushTokenUseCase,
  checkPushTokenExistsUseCase,
  getUserSettingsUseCase,
  addNewSetUseCase,
  getExercisesUseCase,
  getDefaultExercisesUseCase,
  removeExerciseUseCase,
  addExerciseUseCase,
  updateExerciseUseCase,
  getSelectedExercisesUseCase,
  addExerciseToWorkoutUseCase,
  removeExerciseFromWorkoutUseCase,
  orderSelectedExercisesUseCase,
  getSetsUseCase,
  getLastSessionUseCase,
  removeSetUseCase,
};
