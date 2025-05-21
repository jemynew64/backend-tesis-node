import { UserModel } from "../../database/prismaClient";

export async function ShopLivesService(user_id: number) {
  const user = await UserModel.findFirst({
    where: { id: user_id },
  });

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  if (user.points < 50) {
    throw new Error("No tienes suficientes puntos para comprar una vida.");
  }

  if (user.hearts >= 5) {
    throw new Error("Ya tienes el máximo de vidas (5).");
  }

  const updatedUser = await UserModel.update({
    where: { id: user_id },
    data: {
      points: user.points - 50,
      hearts: user.hearts + 1,
    },
  });

  return {
    hearts: updatedUser.hearts,
    points: updatedUser.points,
  };
}
