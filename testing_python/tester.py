#tester.py
import os
import sys
import json
import difflib
import argparse
import importlib
import subprocess


# ANSI color codes for colorful output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'

def find_test_cases(test_dir):
    """Finds pairs of .in and .out files in a directory."""
    test_cases = {}
    for filename in sorted(os.listdir(test_dir)):
        if filename.endswith(".in"):
            test_name = filename[:-3]
            in_file = os.path.join(test_dir, filename)
            out_file = os.path.join(test_dir, test_name + ".out")
            if os.path.exists(out_file):
                test_cases[test_name] = (in_file, out_file)
            else:
                print(f"{Colors.YELLOW}Warning: Found {filename} but no corresponding .out file. Skipping.{Colors.ENDC}")
    return test_cases

def is_number(s):
  try:
    float(s)
    return True
  except ValueError:
    return False

def parse_data(line):
    #this might need to be expanded further, such as a json that says what settings are needed to build a custom class
    #for now, this just parses the json file
    rval = json.loads(line)
    return rval

def parse_file(file_name):
    """
    Parses a file containing one JSON object per line.
    Returns a list of Python objects.
    """
    rval = []
    with open(file_name, 'r') as f:
        for line in f:
            clean_line = line.strip()
            if clean_line: # Ignore empty lines
                rval.append(parse_data(clean_line))
    return rval

def run_single_test(to_test, input_file, expected_output_file):
    """
    Runs a single test case against the UUT.
    Returns a tuple: (did_pass, message)
    """
    try:
        input_data = parse_file(input_file)
        expected_output = parse_file(expected_output_file)

        if input_data == [] and expected_output == []:
            return False, f"{Colors.RED}Error: In and out files both don't have inputs.{Colors.ENDC}"
        elif input_data == []:
            return False, f"{Colors.RED}Error: In file doesn't have inputs.{Colors.ENDC}"
        elif expected_output == []:
            return False, f"{Colors.RED}Error: Out file doesn't have inputs.{Colors.ENDC}"
        
        actual_output = to_test(*input_data)
        same = True

        if isinstance(actual_output, tuple):
            i = 0
            for item in actual_output:
                if item != expected_output[i]:
                    same = False
                i+=1
        else:
            if actual_output != expected_output[0]:
                same = False

        if same:
            return True, f"{Colors.GREEN}PASS{Colors.ENDC}"
        else:
            # Generate a diff to show the user what's wrong
            diff = difflib.unified_diff(
                str(expected_output),
                str(actual_output),
                fromfile='expected.out',
                tofile='actual.out',
            )
            diff_text = ''.join(diff)
            message = (f"{Colors.RED}FAIL{Colors.ENDC}\n"
                       f"  - Reason: Output does not match expected output.\n"
                       f"  - Diff (- expected, + actual):\n{diff_text}")
            print(str(expected_output))
            print(str(actual_output))
            return False, message

    except FileNotFoundError:
        return False, f"{Colors.RED}Error: File not found during test execution.{Colors.ENDC}"
    except subprocess.TimeoutExpired:
        return False, f"{Colors.RED}FAIL\n  - Reason: Program timed out (took >5 seconds).{Colors.ENDC}"
    except Exception as e:
        return False, f"{Colors.RED}FAIL\n  - Reason: An unexpected error occurred: {e}{Colors.ENDC}"


def main():
    """Main function to parse arguments and run the test suite."""
    parser = argparse.ArgumentParser(description="A simple Python testing harness.")
    parser.add_argument("uut", help="The Python script to test (Unit Under Test).")
    parser.add_argument("func", help="The function to test in the Unit Under Test")
    parser.add_argument("test_dir", help="The directory containing test case files (.in/.out).")
    args = parser.parse_args()

    # --- Import the UUT Dynamically ---
    try:
        module_name = os.path.splitext(os.path.basename(args.uut))[0]
        uut_module = importlib.import_module(module_name)
        solve_function = getattr(uut_module, args.func)

    except FileNotFoundError:
        print(f"{Colors.RED}Error: UUT file not found at '{args.uut}'{Colors.ENDC}")
        sys.exit(1)
    except ModuleNotFoundError:
        print(f"{Colors.RED}Error: Could not import module '{module_name}'. Make sure it's in the same directory.{Colors.ENDC}")
        sys.exit(1)
    except AttributeError:
        print(f"{Colors.RED}Error: The UUT '{args.uut}' does not have a 'solve(input_text)' function.{Colors.ENDC}")
        sys.exit(1)
    
    if not os.path.isdir(args.test_dir):
        print(f"{Colors.RED}Error: Test directory not found at '{args.test_dir}'{Colors.ENDC}")
        sys.exit(1)

    print(f"Testing {Colors.BLUE}{args.uut}{Colors.ENDC} with test cases from {Colors.BLUE}{args.test_dir}{Colors.ENDC}\n")

    passed_count = 0
    failed_count = 0
    
    test_cases = find_test_cases(args.test_dir)
    if not test_cases:
        print(f"{Colors.YELLOW}No valid test cases (.in/.out pairs) found.{Colors.ENDC}")
        sys.exit(0)

    for test_name, (in_file, out_file) in test_cases.items():
        print(f"Running test: {test_name:<20} ... ", end='', flush=True)
        is_pass, message = run_single_test(solve_function, in_file, out_file)
        print(message)
        if is_pass:
            passed_count += 1
        else:
            failed_count += 1

    # --- Final Summary ---
    print("\n" + "="*40)
    print("Test Summary")
    print("="*40)
    print(f"{Colors.GREEN}Passed: {passed_count}{Colors.ENDC}")
    print(f"{Colors.RED}Failed: {failed_count}{Colors.ENDC}")
    print(f"Total:  {len(test_cases)}")
    print("="*40)
    
    # Exit with a non-zero status code if any tests failed, useful for CI/CD
    if failed_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()