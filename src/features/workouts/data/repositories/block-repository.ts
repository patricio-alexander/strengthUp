import { BlockRepository } from "@features/workouts/domain/repositories/block-repository";
import { Block, CreateBlock } from "@features/workouts/domain/entities/block";
import { supabase } from "@/lib/supabase";
export class BlockRepositoryImpl implements BlockRepository {
  async getBlockById(blockId: number): Promise<Block | null> {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("name, day, id")
      .eq("id", blockId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return { id: data.id, name: data.name, day: data.day };
  }

  async addBlock(block: CreateBlock): Promise<void> {
    const { error } = await supabase.from("workout_sessions").insert({
      name: block.name,
      day: block.dayKey,
      routine_id: block.workoutId,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async getBlocksByWorkoutId(workoutId: number): Promise<Block[]> {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select(`id, name, workout_sessions_exercises(count), day`)
      .eq("routine_id", workoutId);

    if (error) {
      throw new Error("Error al obtener los bloques");
    }

    return data.map((w) => ({
      id: w.id,
      name: w.name,
      day: w.day,
      exercises: [],
      totalExercises: w.workout_sessions_exercises[0].count,
    }));
  }

  async updateBlock(block: Block): Promise<void> {
    const { error } = await supabase
      .from("workout_sessions")
      .update({ name: block.name, day: block.day })
      .eq("id", block.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async removeBlock(blockId: number): Promise<void> {
    const { error } = await supabase
      .from("workout_sessions")
      .delete()
      .eq("id", blockId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async orderBlocks(blocks: Block[]): Promise<void> {
    await Promise.all(
      blocks.map((w, index) =>
        supabase
          .from("workout_sessions")
          .update({ sorted: index })
          .eq("id", w.id),
      ),
    );
  }
}
