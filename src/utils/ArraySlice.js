/**数组截取 */
export default (list, current, size = 1) => {
  return list.slice((current - 1) * size, current * size);
};
