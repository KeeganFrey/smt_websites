#sorting_solution.py
import json

def bubble_sort(arr):
  """
  Sorts a list of numbers in ascending order using the Bubble Sort algorithm.

  Args:
    arr: A list of numbers (integers or floats).

  Returns:
    A new list containing the numbers from arr sorted in ascending order.
  """
  n = len(arr)
  # Make a copy to avoid modifying the original list in place,
  # which can be unexpected behavior for a function.
  sorted_arr = list(arr)

  # Traverse through all array elements
  for i in range(n):
    # A flag to optimize if the list is already sorted
    swapped = False
    # Last i elements are already in place
    for j in range(0, n - i - 1):
      # Traverse the array from 0 to n-i-1
      # Swap if the element found is greater than the next element
      if sorted_arr[j] > sorted_arr[j+1]:
        sorted_arr[j], sorted_arr[j+1] = sorted_arr[j+1], sorted_arr[j]
        swapped = True
    
    # If no two elements were swapped by inner loop, then break
    if not swapped:
      break
      
  return sorted_arr