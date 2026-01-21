Problem 1: Three ways to sum to n
Provide 3 unique implementations of the following function in JavaScript.
Input: n - any integer
Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER.
Output: return - summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.

Answer 1:
var sum_to_n_a = function(n) {
return (n \* (n + 1)) / 2;
};

Characteristics:
• Time complexity: O(1)
• Space complexity: O(1)

Answer 2:
var sum_to_n_b = function(n) {
let sum = 0;
for (let i = 1; i <= n; i++) {
sum += i;
}
return sum;
};

Characteristics:
• Time complexity: O(n)
• Space complexity: O(1)

Answer 3:
var sum*to_n_c = function(n) {
return Array.from({ length: n }, (*, i) => i + 1)
.reduce((acc, curr) => acc + curr, 0);
};

Characteristics:
• Time complexity: O(n)
• Space complexity: O(n) (due to array creation)
