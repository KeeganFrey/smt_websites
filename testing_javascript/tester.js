// testing_javascript/tester.js
const fs = require('fs');
const path = require('path');
const { diffLines } = require('diff'); // This will be installed later via package.json

// ANSI color codes
const Colors = {
    GREEN: '\x1b[32m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    ENDC: '\x1b[0m'
};

function find_test_cases(test_dir) {
    // Implement logic to find pairs of .in and .out files
    // Return an object like: { test_name: { in_file: 'path/to.in', out_file: 'path/to.out' } }
    // Based on Python's find_test_cases
    const test_cases = {};
    const files = fs.readdirSync(test_dir).sort();
    for (const filename of files) {
        if (filename.endsWith(".in")) {
            const test_name = filename.slice(0, -3);
            const in_file = path.join(test_dir, filename);
            const out_file = path.join(test_dir, test_name + ".out");
            if (fs.existsSync(out_file)) {
                test_cases[test_name] = { in_file, out_file };
            } else {
                console.log(`${Colors.YELLOW}Warning: Found ${filename} but no corresponding .out file. Skipping.${Colors.ENDC}`);
            }
        }
    }
    return test_cases;
}

function parse_file(file_name) {
    // Implement logic to read a file line by line, parsing each line as JSON
    // Return an array of parsed objects
    // Based on Python's parse_file
    const rval = [];
    const fileContent = fs.readFileSync(file_name, 'utf-8');
    const lines = fileContent.split('\n');
    for (const line of lines) {
        const clean_line = line.trim();
        if (clean_line) {
            rval.push(JSON.parse(clean_line));
        }
    }
    return rval;
}

function run_single_test(to_test_function, input_file, expected_output_file) {
    // Implement logic to run a single test
    // Read input data, call the function, compare with expected output
    // Return { pass: boolean, message: string }
    // Based on Python's run_single_test
    try {
        const input_data = parse_file(input_file);
        const expected_output = parse_file(expected_output_file);

        if (input_data.length === 0 && expected_output.length === 0) {
            return { pass: false, message: `${Colors.RED}Error: In and out files both don't have inputs.${Colors.ENDC}` };
        } else if (input_data.length === 0) {
            return { pass: false, message: `${Colors.RED}Error: In file doesn't have inputs.${Colors.ENDC}` };
        } else if (expected_output.length === 0) {
            return { pass: false, message: `${Colors.RED}Error: Out file doesn't have inputs.${Colors.ENDC}` };
        }

        // The dynamically imported function might not be directly callable with spread arguments
        // if it expects a single array argument. Adjust if necessary based on typical JS module patterns.
        // For bubble_sort, it expects a single array.
        const actual_output = to_test_function(input_data[0]); // Assuming bubble_sort takes the first element (the array)

        let same = true;
        // Assuming expected_output[0] is the array to compare against actual_output
        if (JSON.stringify(actual_output) !== JSON.stringify(expected_output[0])) {
            same = false;
        }

        if (same) {
            return { pass: true, message: `${Colors.GREEN}PASS${Colors.ENDC}` };
        } else {
            const diff = diffLines(JSON.stringify(expected_output[0], null, 2), JSON.stringify(actual_output, null, 2));
            let diff_text = '';
            diff.forEach(part => {
                const color = part.added ? Colors.GREEN : part.removed ? Colors.RED : Colors.ENDC;
                diff_text += color + part.value + Colors.ENDC;
            });
            const message = `${Colors.RED}FAIL${Colors.ENDC}\n` +
                           `  - Reason: Output does not match expected output.\n` +
                           `  - Diff (- expected, + actual):\n${diff_text}`;
            return { pass: false, message: message };
        }

    } catch (e) {
        if (e instanceof SyntaxError) { // JSON parsing error
             return { pass: false, message: `${Colors.RED}FAIL\n  - Reason: Error parsing JSON in test files: ${e.message}${Colors.ENDC}` };
        }
        return { pass: false, message: `${Colors.RED}FAIL\n  - Reason: An unexpected error occurred: ${e.stack}${Colors.ENDC}` };
    }
}

function main() {
    // Implement argument parsing (process.argv)
    // Dynamically import the solution module and function
    // Loop through test cases, run them, and print summary
    // Based on Python's main
    const args = process.argv.slice(2); // 0: node, 1: script_name.js
    if (args.length < 3) {
        console.error(`${Colors.RED}Usage: node tester.js <uut.js> <functionName> <test_dir>${Colors.ENDC}`);
        process.exit(1);
    }

    const uut_file_arg = args[0];
    const func_name_arg = args[1];
    const test_dir_arg = args[2];

    const uut_path = path.resolve(uut_file_arg); // Get absolute path

    if (!fs.existsSync(uut_path)) {
        console.error(`${Colors.RED}Error: UUT file not found at '${uut_path}'${Colors.ENDC}`);
        process.exit(1);
    }
    if (!fs.statSync(uut_path).isFile()) {
        console.error(`${Colors.RED}Error: UUT path '${uut_path}' is not a file.${Colors.ENDC}`);
        process.exit(1);
    }


    if (!fs.existsSync(test_dir_arg)) {
        console.error(`${Colors.RED}Error: Test directory not found at '${test_dir_arg}'${Colors.ENDC}`);
        process.exit(1);
    }
    if (!fs.statSync(test_dir_arg).isDirectory()) {
        console.error(`${Colors.RED}Error: Test directory path '${test_dir_arg}' is not a directory.${Colors.ENDC}`);
        process.exit(1);
    }

    let solve_function;
    try {
        const uut_module = require(uut_path);
        // Check if the module itself is the function (e.g., module.exports = functionToTest)
        // and if its name matches func_name_arg.
        if (typeof uut_module === 'function' && uut_module.name === func_name_arg) {
            solve_function = uut_module;
        }
        // Else, check if the function is a property of the module (e.g., module.exports = { functionToTest: ... })
        else if (uut_module && typeof uut_module[func_name_arg] === 'function') {
            solve_function = uut_module[func_name_arg];
        }
        // If neither, then the function is not found or not exported correctly.
        else {
            let errorDetail = `Function '${func_name_arg}' not found or not a function.`;
            if (typeof uut_module === 'function' && uut_module.name !== func_name_arg) {
                errorDetail += ` Module exports a function named '${uut_module.name}', but expected '${func_name_arg}'.`;
            } else if (typeof uut_module === 'object' && uut_module !== null) {
                const availableKeys = Object.keys(uut_module);
                if (availableKeys.length > 0) {
                    errorDetail += ` Available exports in module: ${availableKeys.join(', ')}.`;
                } else {
                    errorDetail += ` Module is an object but has no exports.`;
                }
            } else if (typeof uut_module === 'function' && uut_module.name === null ) {
                 errorDetail += ` Module exports an anonymous function. Cannot match by func_name_arg if it's anonymous and directly exported.`;
            }
            // Add more specific error details if possible
            throw new Error(`${errorDetail} in '${uut_file_arg}'.`);
        }
    } catch (e) {
        console.error(`${Colors.RED}Error loading UUT: ${e.message}${Colors.ENDC}`);
        process.exit(1);
    }

    console.log(`Testing ${Colors.BLUE}${uut_file_arg}${Colors.ENDC} (function: ${func_name_arg}) with test cases from ${Colors.BLUE}${test_dir_arg}${Colors.ENDC}\n`);

    let passed_count = 0;
    let failed_count = 0;

    const test_cases = find_test_cases(test_dir_arg);
    const test_names = Object.keys(test_cases);

    if (test_names.length === 0) {
        console.log(`${Colors.YELLOW}No valid test cases (.in/.out pairs) found.${Colors.ENDC}`);
        process.exit(0); // Not an error if no tests are found, could be intentional.
    }

    for (const test_name of test_names) {
        const { in_file, out_file } = test_cases[test_name];
        process.stdout.write(`Running test: ${test_name.padEnd(20)} ... `);
        const result = run_single_test(solve_function, in_file, out_file);
        console.log(result.message);
        if (result.pass) {
            passed_count++;
        } else {
            failed_count++;
        }
    }

    console.log("\n" + "=".repeat(40));
    console.log("Test Summary");
    console.log("=".repeat(40));
    console.log(`${Colors.GREEN}Passed: ${passed_count}${Colors.ENDC}`);
    console.log(`${Colors.RED}Failed: ${failed_count}${Colors.ENDC}`);
    console.log(`Total:  ${test_names.length}`);
    console.log("=".repeat(40));

    if (failed_count > 0) {
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { find_test_cases, parse_file, run_single_test }; // For potential future testing of the tester itself
