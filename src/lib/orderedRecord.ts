
/** Ordered record, basically a record + ordering */
export type OrderedRecord <K extends string, V> = {
  entries: Record<K, V>
  order: K[]
  get: (key: K) => V
  set: (key: K, value: V) => void
  keys: () => K[]
  values: () => V[]
  items: () => [K, V][]
  map: <T>(fn: (key: K, value: V) => T) => OrderedRecord<K, T>
}

/** Create an ordered record of the given entries and ordering */
export function orderedRecord<K extends string, V>(entries: Record<K, V>, order: K[]): OrderedRecord<K, V> {
  const values = () => order.map(k => entries[k]);
  const items: () => [K, V][] = () => order.map(k => [k, entries[k]]);
  const map: OrderedRecord<K, V>['map'] = fn => orderedRecord(
    // @ts-expect-error -- Object.fromEntries produces a Record<string, T>
    // instead of a Record<K, T>, but since we can't introduce the type var T
    // in a way that allows us to use it in this expression, there is no way
    // for us to cast it to the correct type. Therefore, we just need to
    // silence the error. Yucky.
    Object.fromEntries(
      items().map(([k, v]) => [k, fn(k, v)])
    ),
    order,
  );
  return {
    entries,
    order,
    get: k => entries[k],
    set: (k, v) => { entries[k] = v; },
    keys: () => order,
    values,
    items,
    map,
  };
}
