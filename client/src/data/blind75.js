export const BLIND_75 = [
    {
        id: 'arrays',
        title: 'Arrays & Hashing',
        problems: [
            {
                id: 'two-sum',
                title: 'Two Sum',
                difficulty: 'Easy',
                status: 'pending',
                description: `<div><p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p><p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p><p>You can return the answer in any order.</p></div>`,
                approach: {
                    hint1: 'Think about what value you need to find for each element. If the current number is x, what number do you need?',
                    hint2: 'Use a hash map to store numbers you\'ve already seen. For each number, check if (target - num) exists in the map.',
                    solution: 'Use a dictionary/hashmap. For each number, compute complement = target - num. If complement is in the map, return both indices. Otherwise, add the current number to the map.',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    pattern: 'Hash Map Lookup'
                },
                starterCode: {
                    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        pass`,
                    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
                    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
                    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`
                },
                testCases: [
                    { input: "nums = [2,7,11,15], target = 9", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
                    { input: "nums = [3,2,4], target = 6", args: [[3, 2, 4], 6], expected: [1, 2] },
                    { input: "nums = [3,3], target = 6", args: [[3, 3], 6], expected: [0, 1] }
                ],
                examples: [
                    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
                    { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
                ]
            },
            {
                id: 'contains-duplicate',
                title: 'Contains Duplicate',
                difficulty: 'Easy',
                status: 'pending',
                description: `<div><p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears <strong>at least twice</strong> in the array, and return <code>false</code> if every element is distinct.</p></div>`,
                approach: {
                    hint1: 'What data structure lets you check if you\'ve seen a value before in O(1)?',
                    hint2: 'Use a Set. Add elements one by one. If an element already exists in the set, return true.',
                    solution: 'Create a set and iterate through nums. For each number, if it\'s in the set → return True. Otherwise add it. If the loop completes → return False.',
                    timeComplexity: 'O(n)',
                    spaceComplexity: 'O(n)',
                    pattern: 'Hash Set'
                },
                starterCode: {
                    python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        pass`,
                    javascript: `var containsDuplicate = function(nums) {
    
};`
                },
                testCases: [
                    { input: "nums = [1,2,3,1]", args: [[1, 2, 3, 1]], expected: true },
                    { input: "nums = [1,2,3,4]", args: [[1, 2, 3, 4]], expected: false },
                    { input: "nums = [1,1,1,3,3,4,3,2,4,2]", args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
                ],
                examples: [
                    { input: "nums = [1,2,3,1]", output: "true" },
                    { input: "nums = [1,2,3,4]", output: "false" }
                ]
            },
            {
                id: 'valid-anagram', title: 'Valid Anagram', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'If two strings are anagrams, what can you say about the frequency of each character?', hint2: 'Count character frequencies in both strings and compare.', solution: 'Use a hash map or counter for both strings. Compare the frequency maps — they should be identical.', timeComplexity: 'O(n)', spaceComplexity: 'O(1) — 26 chars max', pattern: 'Character Frequency' }
            },
            {
                id: 'group-anagrams', title: 'Group Anagrams', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'What do all anagrams have in common when you sort them?', hint2: 'Sort each string and use the sorted version as a key in a hash map.', solution: 'Create a dictionary where keys are sorted strings. Group all strings with the same sorted form together.', timeComplexity: 'O(n * k log k)', spaceComplexity: 'O(n * k)', pattern: 'Hash Map Grouping' }
            },
            {
                id: 'top-k-frequent', title: 'Top K Frequent Elements', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'First count frequencies. Then how do you find the top K?', hint2: 'Use a heap or bucket sort. Bucket sort gives O(n) time.', solution: 'Count frequencies with hash map. Use bucket sort where index = frequency. Iterate buckets from highest to collect top K.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Bucket Sort + Hash Map' }
            },
            {
                id: 'product-except-self', title: 'Product of Array Except Self', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'Can you compute the product without using division?', hint2: 'For each position, multiply all elements to its left, then all elements to its right.', solution: 'Two passes: first pass computes prefix products left-to-right, second pass multiplies suffix products right-to-left.', timeComplexity: 'O(n)', spaceComplexity: 'O(1) — output array only', pattern: 'Prefix/Suffix Product' }
            },
            {
                id: 'longest-consecutive', title: 'Longest Consecutive Sequence', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'How do you find the start of a consecutive sequence?', hint2: 'A number is the start of a sequence if (num - 1) is NOT in the set.', solution: 'Put all numbers in a set. For each number where (num-1) doesn\'t exist, count consecutive numbers up from it. Track the maximum length.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Hash Set + Sequence Detection' }
            }
        ]
    },
    {
        id: 'two-pointers',
        title: 'Two Pointers',
        problems: [
            {
                id: 'valid-palindrome', title: 'Valid Palindrome', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'Can you check from both ends simultaneously?', hint2: 'Use two pointers — one from start, one from end. Skip non-alphanumeric characters.', solution: 'Set left pointer at start, right at end. Compare characters (case-insensitive), skip non-alphanumeric. If all match → palindrome.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Pointers (Inward)' }
            },
            {
                id: '3sum', title: '3Sum', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'If you fix one number, the problem becomes Two Sum.', hint2: 'Sort the array. For each number, use two pointers on the remaining elements to find pairs that sum to -num.', solution: 'Sort array. For each i, set left=i+1, right=end. Move pointers based on sum. Skip duplicates at each level.', timeComplexity: 'O(n²)', spaceComplexity: 'O(1)', pattern: 'Sort + Two Pointers' }
            },
            {
                id: 'container-with-most-water', title: 'Container With Most Water', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'Start with the widest container. Which pointer should you move?', hint2: 'Move the shorter line inward — keeping the taller line can only help.', solution: 'Two pointers at edges. Calculate area = min(height[L], height[R]) * (R-L). Move the shorter pointer inward. Track max area.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Pointers (Greedy)' }
            }
        ]
    },
    {
        id: 'sliding-window',
        title: 'Sliding Window',
        problems: [
            {
                id: 'buy-sell-stock', title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'You want to find the maximum difference where the smaller value comes before the larger.', hint2: 'Track the minimum price seen so far, and at each step compute profit = price - minPrice.', solution: 'Iterate through prices. Track minPrice. For each price, compute profit = price - minPrice and update maxProfit. Update minPrice if current price is lower.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Sliding Window / Kadane\'s Variant' }
            },
            {
                id: 'longest-substring', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'When you find a duplicate, which part of the window do you shrink?', hint2: 'Use a sliding window with a set. When a duplicate is found, move the left pointer past the first occurrence.', solution: 'Use a set and two pointers (sliding window). Expand right pointer, adding chars to set. When duplicate found, shrink from left until duplicate is removed. Track max window size.', timeComplexity: 'O(n)', spaceComplexity: 'O(min(n, m))', pattern: 'Sliding Window + Hash Set' }
            },
            {
                id: 'longest-repeating-char', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'How many characters do you need to replace in a window?', hint2: 'windowSize - maxFrequency gives the number of replacements needed. If > k, shrink the window.', solution: 'Sliding window with char frequency map. Track maxFreq in window. If windowSize - maxFreq > k, shrink from left. Track max valid window size.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Sliding Window + Frequency Count' }
            }
        ]
    },
    {
        id: 'stack',
        title: 'Stack',
        problems: [
            {
                id: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'What should happen when you see a closing bracket?', hint2: 'Push opening brackets onto stack. For closing brackets, check if the top of stack matches.', solution: 'Use a stack. Push opening brackets. For closing brackets, pop and check if it matches. Valid if stack is empty at end.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Stack (Matching)' }
            },
            {
                id: 'min-stack', title: 'Min Stack', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'Can you track the minimum at each level of the stack?', hint2: 'Use two stacks — one for values, one for minimums. Or store (value, currentMin) tuples.', solution: 'Maintain a second stack that tracks the minimum at each depth. When pushing, push min(val, currentMin) onto the min stack.', timeComplexity: 'O(1) all operations', spaceComplexity: 'O(n)', pattern: 'Auxiliary Stack' }
            },
            {
                id: 'evaluate-rpn', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'In RPN, when you see an operator, what do you do?', hint2: 'Push numbers onto stack. When you see an operator, pop two numbers, compute, push result.', solution: 'Use a stack. Push numbers. When operator found, pop b then a, compute a op b, push result. Final stack element is the answer.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Stack (Evaluation)' }
            }
        ]
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        problems: [
            {
                id: 'binary-search', title: 'Binary Search', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'The array is sorted. Can you eliminate half the search space each step?', hint2: 'Compare target with middle element. Go left or right accordingly.', solution: 'Set left=0, right=len-1. Compute mid=(left+right)/2. If nums[mid]==target → return. If target < mid → right=mid-1. Else → left=mid+1.', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', pattern: 'Classic Binary Search' }
            },
            {
                id: 'search-2d-matrix', title: 'Search a 2D Matrix', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'Can you treat the 2D matrix as a 1D sorted array?', hint2: 'Use a single binary search. Convert 1D index to 2D: row = idx/cols, col = idx%cols.', solution: 'Flatten the matrix conceptually. Binary search on index 0 to m*n-1. Convert index to row/col to access elements.', timeComplexity: 'O(log(m*n))', spaceComplexity: 'O(1)', pattern: 'Binary Search (Virtual Flatten)' }
            },
            {
                id: 'min-rotated-sorted', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'The minimum is at the rotation point. How can you find it with binary search?', hint2: 'If nums[mid] > nums[right], the min is in the right half. Otherwise, it\'s in the left half (including mid).', solution: 'Binary search. Compare mid with right. If nums[mid] > nums[right] → minimum is in right half (left=mid+1). Else → minimum is in left half including mid (right=mid).', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', pattern: 'Modified Binary Search' }
            }
        ]
    },
    {
        id: 'linked-list',
        title: 'Linked List',
        problems: [
            {
                id: 'reverse-linked-list', title: 'Reverse Linked List', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'Can you reverse the pointers as you traverse?', hint2: 'Keep track of prev, current, and next. Point current.next to prev, then advance all three.', solution: 'Initialize prev=null. While current exists: save next=current.next, point current.next=prev, advance prev=current, current=next. Return prev.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Iterative Pointer Reversal' }
            },
            {
                id: 'merge-two-lists', title: 'Merge Two Sorted Lists', difficulty: 'Easy', status: 'pending',
                approach: { hint1: 'Compare the heads of both lists and pick the smaller one each time.', hint2: 'Use a dummy head. Compare both lists, attach the smaller node, advance that pointer.', solution: 'Create dummy node. While both lists have nodes, compare and attach smaller. Attach remaining list. Return dummy.next.', timeComplexity: 'O(n + m)', spaceComplexity: 'O(1)', pattern: 'Merge with Dummy Node' }
            },
            {
                id: 'reorder-list', title: 'Reorder List', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'Can you split the list in half, reverse the second half, then merge?', hint2: 'Use slow/fast pointers to find mid. Reverse second half. Alternate-merge both halves.', solution: 'Step 1: Find middle with slow/fast pointers. Step 2: Reverse the second half. Step 3: Merge both halves alternating nodes.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Find Middle + Reverse + Merge' }
            },
            {
                id: 'remove-nth-node', title: 'Remove Nth Node From End of List', difficulty: 'Medium', status: 'pending',
                approach: { hint1: 'Can you find the nth from end in one pass?', hint2: 'Use two pointers. Advance fast pointer by n steps, then move both until fast reaches end. Slow is at the target.', solution: 'Use dummy head + two pointers. Move fast n+1 steps ahead. Move both until fast is null. Delete slow.next.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Pointers (n-gap)' }
            }
        ]
    }
];
