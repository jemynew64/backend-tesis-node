import { UserModel } from "../../database/prismaClient";

const heartRecoveryTimers = new Map<number, NodeJS.Timeout>();

export const scheduleHeartRecovery = (userId: number) => {
  if (heartRecoveryTimers.has(userId)) return;

  const timeout = setTimeout(async () => {
    try {
      const user = await UserModel.findUnique({ where: { id: userId } });

      if (user && user.hearts < 5) {
        await UserModel.update({
          where: { id: userId },
          data: { hearts: user.hearts + 1 },
        });
        console.log(`❤️ Corazón restaurado al usuario ${userId}`);
      }
    } catch (error) {
      console.error(`❌ Error restaurando corazón al usuario ${userId}:`, error);
    } finally {
      heartRecoveryTimers.delete(userId);
    }
  }, 5 * 60 * 1000); // 5 minutos

  heartRecoveryTimers.set(userId, timeout);
};
