/**
 * 将数组对象中的某个值进行映射合并
 * @param array 数组对象
 * @param key 合并的字段值
 * @returns 一维数组
 * @example ```ts
 *            const arr = [{ group: 'A', chidlren: [1, 2, 3] }, { group: 'B', chidlren: [4, 5, 6] }];
              const target = combileArrayBy(arr, 'chidlren'); // [1, 2, 3, 4, 5, 6]         
            ```
 */
export function combileArrayBy<T extends any[], K extends keyof T[number]>(array: T, key: K): T[number][K] {
  return array.map(v => v[key]).reduce((pre, cur) => pre.concat(cur), []);
}
