function bubble_sort(arr) {
  const n = arr.length;
  const sorted_arr = [...arr]; // Make a copy

  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (sorted_arr[j] > sorted_arr[j+1]) {
        [sorted_arr[j], sorted_arr[j+1]] = [sorted_arr[j+1], sorted_arr[j]]; // Swap elements
        swapped = true;
      }
    }
    if (!swapped) {
      break;
    }
  }
  return sorted_arr;
}

module.exports = bubble_sort;
