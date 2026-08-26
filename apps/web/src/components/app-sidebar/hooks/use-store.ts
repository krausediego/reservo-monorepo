/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

type StoreProps<T, F> = {
  store: (callback: (state: T) => unknown) => unknown;
  callback: (state: T) => F;
};

export const useStore = <T, F>({ store, callback }: StoreProps<T, F>) => {
  const [data, setData] = useState<F>();
  const result = store(callback) as F;

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
