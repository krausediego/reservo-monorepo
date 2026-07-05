/* eslint-disable no-param-reassign */

/**
 * Passa establishmentId e userId dos params recebidos para as
 * propriedades correspondentes da classe (ex: BaseDatabaseService).
 * @param target The prototype of the class the method belongs to.
 * @param propertyKey The name of the method being decorated.
 * @param descriptor The property descriptor for the method.
 * @returns descriptor
 */
export const setDatabaseContext = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = async function handle(...args: any[]) {
    const params = args[0];

    if (this && typeof this === "object") {
      if (params?.establishmentId && "establishmentId" in this) {
        this.establishmentId = params.establishmentId;
      }
      if (params?.userId && "userId" in this) {
        this.userId = params.userId;
      }
    }

    return originalMethod.apply(this, args);
  };

  return descriptor;
};
