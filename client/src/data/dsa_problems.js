export const CONTROLS = {
    LANGUAGES: [
        { id: 'javascript', name: 'JavaScript', version: '18.15.0' },
        { id: 'python', name: 'Python', version: '3.10.0' },
        { id: 'java', name: 'Java', version: '15.0.2' },
    ]
};

export const DSA_ROADMAP = [
    {
        id: 'arrays',
        title: 'Arrays & Hashing',
        description: 'The foundation of all data structures. Master these to handle data storage and retrieval efficiently.',
        problems: [
            {
                id: 'two-sum',
                title: 'Two Sum',
                difficulty: 'Easy',
                description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.

You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.`,
                examples: [
                    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
                    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
                ],
                starterCode: {
                    javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
                    python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass`
                }
            },
            {
                id: 'contains-duplicate',
                title: 'Contains Duplicate',
                difficulty: 'Easy',
                description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
                starterCode: {
                    javascript: `/**\n * @param {number[]} nums\n * @return {boolean}\n */\nvar containsDuplicate = function(nums) {\n    \n};`,
                    python: `class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass`
                }
            }
        ]
    },
    {
        id: 'two-pointers',
        title: 'Two Pointers',
        description: 'A pattern used to search for pairs in a sorted array or linked list.',
        problems: [
            {
                id: 'valid-palindrome',
                title: 'Valid Palindrome',
                difficulty: 'Easy',
                description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
                starterCode: {
                    javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isPalindrome = function(s) {\n    \n};`,
                    python: `class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass`
                }
            }
        ]
    }
];
