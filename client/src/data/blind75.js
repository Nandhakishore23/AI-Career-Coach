// Helper to create a problem entry concisely
const P = (id, title, difficulty, approach, extras = {}) => ({
    id, title, difficulty, status: 'pending',
    approach,
    ...extras
});

// ============================================
// CATEGORY 1: MUST-KNOW (Core Interview Problems)
// ============================================
const MUST_KNOW = [
    {
        id: 'arrays-hashing',
        title: 'Arrays & Hashing',
        category: 'must-know',
        problems: [
            P('two-sum', 'Two Sum', 'Easy',
                { hint1: 'For each element x, you need target - x.', hint2: 'Use a hash map to store seen values and their indices.', solution: 'Hash map lookup: for each num, check if complement exists in map. O(n) time.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Hash Map Lookup' },
                {
                    description: '<div><p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p></div>',
                    starterCode: {
                        python: 'class Solution:\n    def twoSum(self, nums, target):\n        pass',
                        javascript: 'var twoSum = function(nums, target) {\n    \n};'
                    },
                    testCases: [
                        { input: 'nums = [2,7,11,15], target = 9', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
                        { input: 'nums = [3,2,4], target = 6', args: [[3, 2, 4], 6], expected: [1, 2] },
                        { input: 'nums = [3,3], target = 6', args: [[3, 3], 6], expected: [0, 1] }
                    ],
                    examples: [
                        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
                        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
                    ]
                }),
            P('contains-duplicate', 'Contains Duplicate', 'Easy',
                { hint1: 'What data structure checks membership in O(1)?', hint2: 'Use a Set. If element already in set, return true.', solution: 'Iterate, add to set. If already present, return true. End means false.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Hash Set' },
                {
                    description: '<div><p>Given an integer array <code>nums</code>, return <code>true</code> if any value appears at least twice, and <code>false</code> if every element is distinct.</p></div>',
                    starterCode: {
                        python: 'class Solution:\n    def containsDuplicate(self, nums):\n        pass',
                        javascript: 'var containsDuplicate = function(nums) {\n    \n};'
                    },
                    testCases: [
                        { input: 'nums = [1,2,3,1]', args: [[1, 2, 3, 1]], expected: true },
                        { input: 'nums = [1,2,3,4]', args: [[1, 2, 3, 4]], expected: false }
                    ],
                    examples: [
                        { input: 'nums = [1,2,3,1]', output: 'true' },
                        { input: 'nums = [1,2,3,4]', output: 'false' }
                    ]
                }),
            P('valid-anagram', 'Valid Anagram', 'Easy',
                { hint1: 'Anagrams have identical character frequencies.', hint2: 'Count chars in both strings, compare.', solution: 'Use Counter/frequency map. Compare both maps.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Char Frequency' }),
            P('group-anagrams', 'Group Anagrams', 'Medium',
                { hint1: 'All anagrams share the same sorted form.', hint2: 'Sort each string, use as hash key.', solution: 'Dict with sorted string keys. Group words with same key.', timeComplexity: 'O(n*k log k)', spaceComplexity: 'O(n*k)', pattern: 'Hash Map Grouping' }),
            P('top-k-frequent', 'Top K Frequent Elements', 'Medium',
                { hint1: 'Count frequencies first. Then find top K.', hint2: 'Bucket sort by frequency gives O(n).', solution: 'Count freq with map. Bucket sort where idx=freq. Collect from top.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Bucket Sort' }),
            P('product-except-self', 'Product of Array Except Self', 'Medium',
                { hint1: 'No division allowed. Think prefix and suffix.', hint2: 'Two passes: left products then right products.', solution: 'Forward pass: prefix[i] = product of all left. Backward pass: multiply suffix.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Prefix/Suffix' }),
            P('longest-consecutive', 'Longest Consecutive Sequence', 'Medium',
                { hint1: 'A sequence starts where num-1 is NOT in the set.', hint2: 'Put all in set. For each start, count up.', solution: 'Set all nums. For each where (n-1) absent, count consecutive. Track max.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Hash Set Sequence' }),
            P('encode-decode-strings', 'Encode and Decode Strings', 'Medium',
                { hint1: 'How to handle strings containing any character?', hint2: 'Prefix each string with its length + delimiter.', solution: 'Encode: len#string for each. Decode: read length, extract substring.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Length Prefix Encoding' }),
        ]
    },
    {
        id: 'two-pointers',
        title: 'Two Pointers',
        category: 'must-know',
        problems: [
            P('valid-palindrome', 'Valid Palindrome', 'Easy',
                { hint1: 'Check from both ends simultaneously.', hint2: 'Two pointers: skip non-alphanumeric, compare.', solution: 'Left+right pointers inward. Skip non-alnum. Compare case-insensitive.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Pointers Inward' }),
            P('3sum', '3Sum', 'Medium',
                { hint1: 'Fix one number then solve Two Sum on rest.', hint2: 'Sort array. For each i, two-pointer on remaining.', solution: 'Sort. For each i: L=i+1, R=end. Move based on sum. Skip duplicates.', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', pattern: 'Sort + Two Pointers' }),
            P('container-with-most-water', 'Container With Most Water', 'Medium',
                { hint1: 'Start widest. Move the shorter line.', hint2: 'Area = min(h[L],h[R])*(R-L). Move shorter pointer.', solution: 'Two pointers at edges. Compute area. Move shorter line inward. Track max.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Greedy Two Pointers' }),
            P('trapping-rain-water', 'Trapping Rain Water', 'Hard',
                { hint1: 'Water at each position = min(maxLeft, maxRight) - height.', hint2: 'Two pointers with running maxLeft and maxRight.', solution: 'L/R pointers. Track maxL, maxR. Process the smaller side, add water.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Pointers + Max Tracking' }),
        ]
    },
    {
        id: 'sliding-window',
        title: 'Sliding Window',
        category: 'must-know',
        problems: [
            P('buy-sell-stock', 'Best Time to Buy and Sell Stock', 'Easy',
                { hint1: 'Track minimum price seen so far.', hint2: 'At each price: profit = price - minPrice.', solution: 'Iterate. Track minPrice. Compute profit at each step. Track maxProfit.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Kadane Variant' }),
            P('longest-substring', 'Longest Substring Without Repeating', 'Medium',
                { hint1: 'Expand window right. Shrink when duplicate found.', hint2: 'Set + two pointers (sliding window).', solution: 'Window with set. Expand right, add char. If dup then shrink left. Track max.', timeComplexity: 'O(n)', spaceComplexity: 'O(min(n,m))', pattern: 'Sliding Window + Set' }),
            P('longest-repeating-char', 'Longest Repeating Character Replacement', 'Medium',
                { hint1: 'Replacements needed = windowSize - maxFreq.', hint2: 'If replacements > k, shrink window.', solution: 'Window with freq map. Track maxFreq. If window-maxFreq > k then shrink.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Sliding Window + Freq' }),
            P('minimum-window-substring', 'Minimum Window Substring', 'Hard',
                { hint1: 'Expand right until all chars covered. Then shrink left.', hint2: 'Use char count maps and a "formed" counter.', solution: 'Two maps. Expand right collecting chars. When valid, shrink left tracking min.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Sliding Window + Counter' }),
        ]
    },
    {
        id: 'stack-mk',
        title: 'Stack',
        category: 'must-know',
        problems: [
            P('valid-parentheses', 'Valid Parentheses', 'Easy',
                { hint1: 'Push openers. For closers, check top matches.', hint2: 'Use a stack. Map closers to openers.', solution: 'Stack. Push openers. Pop for closers, check match. Valid if empty at end.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Stack Matching' }),
            P('min-stack', 'Min Stack', 'Medium',
                { hint1: 'Track minimum at each stack level.', hint2: 'Two stacks: values and minimums.', solution: 'Auxiliary min stack. Push min(val, currentMin). All ops O(1).', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', pattern: 'Auxiliary Stack' }),
            P('evaluate-rpn', 'Evaluate Reverse Polish Notation', 'Medium',
                { hint1: 'Operators act on the top two stack elements.', hint2: 'Push nums. Pop two for operators, push result.', solution: 'Stack. Push numbers. Operator: pop b,a, compute a op b, push result.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Stack Evaluation' }),
            P('daily-temperatures', 'Daily Temperatures', 'Medium',
                { hint1: 'For each day, find next warmer day.', hint2: 'Monotonic decreasing stack of indices.', solution: 'Stack of indices. For each temp, pop all smaller, compute distance.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Monotonic Stack' }),
            P('largest-rect-histogram', 'Largest Rectangle in Histogram', 'Hard',
                { hint1: 'For each bar, find how far it extends left and right.', hint2: 'Monotonic stack tracks boundaries.', solution: 'Stack of indices. Pop when current < top. Width = i - stack[-1] - 1.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Monotonic Stack' }),
        ]
    },
    {
        id: 'binary-search-mk',
        title: 'Binary Search',
        category: 'must-know',
        problems: [
            P('binary-search', 'Binary Search', 'Easy',
                { hint1: 'Eliminate half the search space each step.', hint2: 'Compare mid with target. Go left or right.', solution: 'L=0, R=end. Mid=(L+R)/2. Match then return. Target<mid then R=mid-1 else L=mid+1.', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', pattern: 'Classic Binary Search' }),
            P('search-2d-matrix', 'Search a 2D Matrix', 'Medium',
                { hint1: 'Treat 2D matrix as sorted 1D array.', hint2: 'Index: row=idx/cols, col=idx%cols.', solution: 'Binary search 0 to m*n-1. Convert to 2D indices.', timeComplexity: 'O(log(mn))', spaceComplexity: 'O(1)', pattern: 'Virtual Flatten BS' }),
            P('min-rotated-sorted', 'Min in Rotated Sorted Array', 'Medium',
                { hint1: 'Min is at the rotation point.', hint2: 'If mid > right then min in right half.', solution: 'BS. mid>right then L=mid+1. Else R=mid. Return nums[L].', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', pattern: 'Modified BS' }),
            P('search-rotated-sorted', 'Search in Rotated Sorted Array', 'Medium',
                { hint1: 'One half is always sorted.', hint2: 'Determine which half is sorted, check if target is in it.', solution: 'BS. Find sorted half. If target in sorted range then search there, else other.', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', pattern: 'Modified BS' }),
            P('koko-eating-bananas', 'Koko Eating Bananas', 'Medium',
                { hint1: 'Binary search on the answer (eating speed).', hint2: 'For a given speed k, can Koko finish in h hours?', solution: 'BS on speed 1 to max(piles). For each speed, compute total hours.', timeComplexity: 'O(n log m)', spaceComplexity: 'O(1)', pattern: 'BS on Answer' }),
        ]
    },
    {
        id: 'linked-list-mk',
        title: 'Linked List',
        category: 'must-know',
        problems: [
            P('reverse-linked-list', 'Reverse Linked List', 'Easy',
                { hint1: 'Reverse pointers as you traverse.', hint2: 'Track prev, curr, next. Point curr.next to prev.', solution: 'prev=null. While curr: save next, point back, advance. Return prev.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Pointer Reversal' }),
            P('merge-two-lists', 'Merge Two Sorted Lists', 'Easy',
                { hint1: 'Compare heads, pick smaller.', hint2: 'Dummy head + compare-and-attach loop.', solution: 'Dummy node. While both: attach smaller, advance. Attach remainder.', timeComplexity: 'O(n+m)', spaceComplexity: 'O(1)', pattern: 'Merge with Dummy' }),
            P('linked-list-cycle', 'Linked List Cycle', 'Easy',
                { hint1: 'Two runners at different speeds.', hint2: 'Slow moves 1 step, fast moves 2. If they meet, cycle exists.', solution: 'Floyd cycle detection: slow=1step, fast=2steps. If meet, cycle exists.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Fast/Slow Pointers' }),
            P('reorder-list', 'Reorder List', 'Medium',
                { hint1: 'Split in half, reverse second, merge alternating.', hint2: 'Slow/fast for mid. Reverse second half. Interleave.', solution: '1) Find mid. 2) Reverse 2nd half. 3) Merge alternating.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Split+Reverse+Merge' }),
            P('remove-nth-node', 'Remove Nth From End', 'Medium',
                { hint1: 'One-pass with two pointers n apart.', hint2: 'Advance fast by n. Move both until fast=null.', solution: 'Dummy+two ptrs. Fast n+1 ahead. Move both. Delete slow.next.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Ptr n-gap' }),
            P('lru-cache', 'LRU Cache', 'Medium',
                { hint1: 'Need O(1) get AND O(1) put.', hint2: 'Hash map + doubly linked list.', solution: 'Map for O(1) lookup. DLL for O(1) remove/insert. Move to front on access.', timeComplexity: 'O(1)', spaceComplexity: 'O(n)', pattern: 'HashMap + DLL' }),
        ]
    },
    {
        id: 'trees-mk',
        title: 'Trees',
        category: 'must-know',
        problems: [
            P('invert-binary-tree', 'Invert Binary Tree', 'Easy',
                { hint1: 'Swap left and right children at every node.', hint2: 'Recursively swap children.', solution: 'DFS: swap node.left, node.right. Recurse on both.', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', pattern: 'DFS Recursion' }),
            P('max-depth-binary-tree', 'Maximum Depth of Binary Tree', 'Easy',
                { hint1: 'Depth = 1 + max(left depth, right depth).', hint2: 'Recursive DFS, return 0 for null.', solution: 'Base: null returns 0. Return 1 + max(depth(left), depth(right)).', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', pattern: 'DFS' }),
            P('same-tree', 'Same Tree', 'Easy',
                { hint1: 'Compare nodes in parallel.', hint2: 'Both null=true. One null=false. Compare vals, recurse.', solution: 'Recursive: both null=T, one null=F, vals differ=F, recurse both.', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', pattern: 'Parallel DFS' }),
            P('subtree-of-another', 'Subtree of Another Tree', 'Easy',
                { hint1: 'At each node, check if trees are identical.', hint2: 'isSameTree helper + DFS through main tree.', solution: 'For each node in s, check isSameTree(node, t). DFS traversal.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(h)', pattern: 'DFS + SameTree' }),
            P('lowest-common-ancestor', 'Lowest Common Ancestor BST', 'Medium',
                { hint1: 'In BST, LCA is where p and q split.', hint2: 'If both < node go left. Both > go right. Else LCA.', solution: 'BST property: if both smaller go left, both larger go right, else found.', timeComplexity: 'O(h)', spaceComplexity: 'O(1)', pattern: 'BST Traversal' }),
            P('validate-bst', 'Validate Binary Search Tree', 'Medium',
                { hint1: 'Each node has valid range (min, max).', hint2: 'Pass bounds down. Left: max=node.val. Right: min=node.val.', solution: 'DFS with bounds (min, max). Check node in range. Update bounds for children.', timeComplexity: 'O(n)', spaceComplexity: 'O(h)', pattern: 'DFS + Bounds' }),
            P('binary-tree-level-order', 'Binary Tree Level Order Traversal', 'Medium',
                { hint1: 'Process all nodes at each depth together.', hint2: 'BFS with queue. Track level size.', solution: 'Queue BFS. For each level: process queue.length nodes, collect vals.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'BFS Level-by-Level' }),
            P('serialize-deserialize-bt', 'Serialize and Deserialize Binary Tree', 'Hard',
                { hint1: 'Use preorder traversal with null markers.', hint2: 'Serialize: DFS, write val or "N". Deserialize: read and reconstruct.', solution: 'Preorder DFS. Serialize with delimiters. Deserialize with index pointer.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'DFS Serialization' }),
        ]
    },
    {
        id: 'graphs-mk',
        title: 'Graphs',
        category: 'must-know',
        problems: [
            P('number-of-islands', 'Number of Islands', 'Medium',
                { hint1: 'Each "1" starts a new island. Explore all connected 1s.', hint2: 'DFS/BFS from each unvisited "1". Mark visited.', solution: 'For each "1": increment count, DFS/BFS to mark all connected as visited.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)', pattern: 'Grid DFS/BFS' }),
            P('clone-graph', 'Clone Graph', 'Medium',
                { hint1: 'Need to handle cycles - track cloned nodes.', hint2: 'HashMap: original to clone. DFS/BFS to clone neighbors.', solution: 'Map old to new. DFS: create clone, recurse neighbors. Return from map if visited.', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', pattern: 'DFS + HashMap' }),
            P('course-schedule', 'Course Schedule', 'Medium',
                { hint1: 'This is cycle detection in a directed graph.', hint2: 'Topological sort with BFS (Kahn algorithm) or DFS with visited states.', solution: 'Build adj list + indegree. BFS: process 0-indegree nodes. If all processed, no cycle.', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V+E)', pattern: 'Topological Sort' }),
            P('pacific-atlantic-water', 'Pacific Atlantic Water Flow', 'Medium',
                { hint1: 'Instead of flowing from cell to ocean, flow from ocean to cell.', hint2: 'BFS/DFS from Pacific edges and Atlantic edges. Find intersection.', solution: 'Two visited sets. DFS from each ocean edge (uphill). Return intersection.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)', pattern: 'Reverse DFS' }),
            P('graph-valid-tree', 'Graph Valid Tree', 'Medium',
                { hint1: 'Tree = connected + no cycles + n-1 edges.', hint2: 'Union-Find or DFS. Check edges = n-1 and all connected.', solution: 'Check edges==n-1. Union-Find: if union finds cycle, not tree.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Union-Find' }),
            P('word-ladder', 'Word Ladder', 'Hard',
                { hint1: 'Shortest path means BFS. Each word is a node.', hint2: 'Generate all 1-char variations. BFS level by level.', solution: 'BFS from begin. For each word, try all 1-char changes. Track distance.', timeComplexity: 'O(n*m^2)', spaceComplexity: 'O(n*m)', pattern: 'BFS Shortest Path' }),
        ]
    },
    {
        id: 'dp-mk',
        title: 'Dynamic Programming',
        category: 'must-know',
        problems: [
            P('climbing-stairs', 'Climbing Stairs', 'Easy',
                { hint1: 'Ways to reach step n = ways(n-1) + ways(n-2).', hint2: 'This is Fibonacci!', solution: 'dp[i] = dp[i-1] + dp[i-2]. Base: dp[1]=1, dp[2]=2.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Fibonacci DP' }),
            P('house-robber', 'House Robber', 'Medium',
                { hint1: 'At each house: rob it + dp[i-2] OR skip = dp[i-1].', hint2: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).', solution: 'DP with two vars. At each house max(skip, rob+prev_skip).', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Linear DP' }),
            P('coin-change', 'Coin Change', 'Medium',
                { hint1: 'For each amount, try all coins.', hint2: 'dp[amount] = min(dp[amount - coin] + 1) for all coins.', solution: 'Bottom-up DP. dp[0]=0. For each amount 1 to target, try all coins.', timeComplexity: 'O(n*m)', spaceComplexity: 'O(n)', pattern: 'Unbounded Knapsack' }),
            P('longest-increasing-subseq', 'Longest Increasing Subsequence', 'Medium',
                { hint1: 'For each element, find longest subsequence ending here.', hint2: 'dp[i] = max(dp[j]+1) for all j<i where nums[j]<nums[i].', solution: 'O(n^2): dp[i] = 1 + max(dp[j]) for j<i, nums[j]<nums[i]. Or O(n log n) with patience sort.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', pattern: 'LIS DP' }),
            P('word-break', 'Word Break', 'Medium',
                { hint1: 'Can s[0..i] be segmented? Check all prefixes.', hint2: 'dp[i] = true if dp[j] and s[j..i] in dict for some j.', solution: 'dp[0]=true. For i=1 to n: dp[i] = any(dp[j] and s[j:i] in wordDict).', timeComplexity: 'O(n^2*m)', spaceComplexity: 'O(n)', pattern: 'String DP' }),
            P('longest-common-subsequence', 'Longest Common Subsequence', 'Medium',
                { hint1: 'Compare chars at each position.', hint2: 'If match: dp[i][j] = dp[i-1][j-1]+1. Else max(dp[i-1][j], dp[i][j-1]).', solution: '2D DP. Match = diagonal+1. No match = max(left, up).', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)', pattern: '2D DP' }),
        ]
    },
    {
        id: 'heap-mk',
        title: 'Heap / Priority Queue',
        category: 'must-know',
        problems: [
            P('kth-largest-element', 'Kth Largest Element', 'Medium',
                { hint1: 'Min-heap of size k holds the k largest.', hint2: 'Push all, pop when size > k. Top = kth largest.', solution: 'Min-heap size k. Push each element, pop if size>k. Heap top = answer.', timeComplexity: 'O(n log k)', spaceComplexity: 'O(k)', pattern: 'Top-K with Heap' }),
            P('merge-k-sorted-lists', 'Merge K Sorted Lists', 'Hard',
                { hint1: 'Always pick the smallest head among all lists.', hint2: 'Min-heap of list heads. Pop smallest, push its next.', solution: 'Min-heap with (val, listIdx). Pop min, add to result, push next from same list.', timeComplexity: 'O(n log k)', spaceComplexity: 'O(k)', pattern: 'K-Way Merge Heap' }),
            P('find-median-data-stream', 'Find Median from Data Stream', 'Hard',
                { hint1: 'Keep two halves balanced.', hint2: 'Max-heap for lower half, min-heap for upper half.', solution: 'Two heaps. Balance sizes. Median = top of larger heap or avg of both tops.', timeComplexity: 'O(log n)', spaceComplexity: 'O(n)', pattern: 'Two Heaps' }),
        ]
    },
    {
        id: 'backtracking-mk',
        title: 'Backtracking',
        category: 'must-know',
        problems: [
            P('combination-sum', 'Combination Sum', 'Medium',
                { hint1: 'Try each candidate, can reuse it.', hint2: 'DFS: include current (stay at index) or skip (next index).', solution: 'DFS with remaining target. Include (stay) or skip (advance). Base: target=0 means add.', timeComplexity: 'O(2^t)', spaceComplexity: 'O(t)', pattern: 'Backtracking' }),
            P('subsets', 'Subsets', 'Medium',
                { hint1: 'For each element: include it or not.', hint2: 'Backtrack: at each index, add current subset, then try each remaining.', solution: 'DFS from index. Add current subset. For i=index to n: add nums[i], recurse(i+1), remove.', timeComplexity: 'O(n*2^n)', spaceComplexity: 'O(n)', pattern: 'Subset Generation' }),
            P('permutations', 'Permutations', 'Medium',
                { hint1: 'Try each unused element at each position.', hint2: 'Track used elements. Base: all used means add permutation.', solution: 'DFS: for each unused num, add to path, mark used, recurse, backtrack.', timeComplexity: 'O(n*n!)', spaceComplexity: 'O(n)', pattern: 'Permutation Backtrack' }),
            P('word-search', 'Word Search', 'Medium',
                { hint1: 'DFS from each cell matching first char.', hint2: 'Mark visited. Try 4 directions. Backtrack on failure.', solution: 'For each cell: if matches word[0], DFS 4-directionally matching word chars. Backtrack.', timeComplexity: 'O(m*n*4^L)', spaceComplexity: 'O(L)', pattern: 'Grid Backtracking' }),
        ]
    },
    {
        id: 'greedy-mk',
        title: 'Greedy',
        category: 'must-know',
        problems: [
            P('jump-game', 'Jump Game', 'Medium',
                { hint1: 'Track the farthest you can reach.', hint2: 'At each index, update maxReach. If i > maxReach, return false.', solution: 'Track maxReach. For each i: if i>maxReach, false. Update maxReach=max(maxReach, i+nums[i]).', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Greedy Reach' }),
            P('max-subarray', 'Maximum Subarray', 'Medium',
                { hint1: 'At each element: extend current subarray or start new.', hint2: 'Kadane: currentMax = max(num, currentMax + num).', solution: 'Kadane algorithm: curr = max(num, curr+num). Track globalMax. O(n).', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Kadane Algorithm' }),
            P('jump-game-ii', 'Jump Game II', 'Medium',
                { hint1: 'BFS-like: how many "levels" to reach end?', hint2: 'Track current level end and farthest reach.', solution: 'Track end, farthest, jumps. When i reaches end, jump and update end=farthest.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'BFS Greedy' }),
        ]
    },
    {
        id: 'intervals-mk',
        title: 'Intervals',
        category: 'must-know',
        problems: [
            P('merge-intervals', 'Merge Intervals', 'Medium',
                { hint1: 'Sort by start time.', hint2: 'If current overlaps last merged, extend. Else add new.', solution: 'Sort by start. For each: if overlaps result[-1], extend end. Else append.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', pattern: 'Sort + Merge' }),
            P('insert-interval', 'Insert Interval', 'Medium',
                { hint1: 'Three phases: before, overlapping, after.', hint2: 'Add all before. Merge all overlapping. Add all after.', solution: 'Add non-overlapping before. Merge overlapping (min start, max end). Add rest.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Interval Merge' }),
            P('non-overlapping-intervals', 'Non-overlapping Intervals', 'Medium',
                { hint1: 'Sort by end time. Greedily keep earliest-ending.', hint2: 'Count removals when overlap detected.', solution: 'Sort by end. Track lastEnd. If start < lastEnd, remove (count++). Else update lastEnd.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)', pattern: 'Greedy Intervals' }),
        ]
    },
];

// ============================================
// CATEGORY 2: PATTERN MASTERY (Learn the Patterns)
// ============================================
const PATTERN_MASTERY = [
    {
        id: 'bit-manipulation',
        title: 'Bit Manipulation',
        category: 'pattern-mastery',
        problems: [
            P('single-number', 'Single Number', 'Easy', { hint1: 'XOR of a number with itself = 0.', hint2: 'XOR all numbers. Pairs cancel out.', solution: 'XOR all elements. Result = the single one.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'XOR' }),
            P('number-of-1-bits', 'Number of 1 Bits', 'Easy', { hint1: 'n & (n-1) removes lowest set bit.', hint2: 'Count iterations until n = 0.', solution: 'While n: n = n & (n-1), count++. Return count.', timeComplexity: 'O(32)', spaceComplexity: 'O(1)', pattern: 'Bit Trick' }),
            P('counting-bits', 'Counting Bits', 'Easy', { hint1: 'dp[i] relates to dp[i>>1].', hint2: 'dp[i] = dp[i>>1] + (i&1).', solution: 'DP: bits[i] = bits[i>>1] + (i&1). Build 0 to n.', timeComplexity: 'O(n)', spaceComplexity: 'O(n)', pattern: 'Bit DP' }),
            P('reverse-bits', 'Reverse Bits', 'Easy', { hint1: 'Extract LSB, shift into result.', hint2: 'Loop 32 times: result = (result<<1) | (n&1); n >>= 1.', solution: 'Loop 32 times extracting and placing each bit.', timeComplexity: 'O(32)', spaceComplexity: 'O(1)', pattern: 'Bit Manipulation' }),
            P('missing-number', 'Missing Number', 'Easy', { hint1: 'Expected sum vs actual sum.', hint2: 'Or XOR all indices and values.', solution: 'Sum 0 to n minus sum of array. Or XOR approach.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Math/XOR' }),
        ]
    },
    {
        id: 'trie',
        title: 'Trie (Prefix Tree)',
        category: 'pattern-mastery',
        problems: [
            P('implement-trie', 'Implement Trie', 'Medium', { hint1: 'Each node has children map and isEnd flag.', hint2: 'Insert: create nodes along path. Search: follow path, check isEnd.', solution: 'TrieNode with children dict + isEnd. Insert/search follow char paths.', timeComplexity: 'O(m)', spaceComplexity: 'O(n*m)', pattern: 'Trie' }),
            P('word-search-ii', 'Word Search II', 'Hard', { hint1: 'Build trie of all words. DFS on grid.', hint2: 'Grid DFS following trie nodes. Prune dead branches.', solution: 'Insert words in trie. DFS from each cell following trie. Collect found words.', timeComplexity: 'O(m*n*4^L)', spaceComplexity: 'O(W*L)', pattern: 'Trie + DFS' }),
        ]
    },
    {
        id: 'math-geometry',
        title: 'Math & Geometry',
        category: 'pattern-mastery',
        problems: [
            P('rotate-image', 'Rotate Image', 'Medium', { hint1: 'Transpose + reverse each row = 90 degree rotation.', hint2: 'Transpose: swap [i][j] with [j][i]. Then reverse rows.', solution: 'Step 1: Transpose (swap across diagonal). Step 2: Reverse each row.', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', pattern: 'Matrix Transform' }),
            P('spiral-matrix', 'Spiral Matrix', 'Medium', { hint1: 'Track boundaries: top, bottom, left, right.', hint2: 'Shrink boundaries after traversing each side.', solution: 'Four boundaries. Traverse right, down, left, up. Shrink after each.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(1)', pattern: 'Boundary Shrink' }),
            P('set-matrix-zeroes', 'Set Matrix Zeroes', 'Medium', { hint1: 'Use first row/col as markers.', hint2: 'Mark rows/cols to zero using first row/col. Then fill.', solution: 'Use matrix[i][0] and matrix[0][j] as flags. Process in reverse.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(1)', pattern: 'In-place Markers' }),
            P('pow-x-n', 'Pow(x, n)', 'Medium', { hint1: 'x^n = (x^(n/2))^2 for even n.', hint2: 'Fast exponentiation. Handle negative n.', solution: 'Binary exponentiation: if n even, square half. If odd, multiply extra x.', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)', pattern: 'Fast Power' }),
        ]
    },
    {
        id: 'advanced-graphs',
        title: 'Advanced Graphs',
        category: 'pattern-mastery',
        problems: [
            P('alien-dictionary', 'Alien Dictionary', 'Hard', { hint1: 'Compare adjacent words to find char ordering.', hint2: 'Build directed graph of char precedence. Topological sort.', solution: 'Build graph from adjacent word pairs. Topological sort via BFS/DFS.', timeComplexity: 'O(C)', spaceComplexity: 'O(1)', pattern: 'Topological Sort' }),
            P('network-delay-time', 'Network Delay Time', 'Medium', { hint1: 'Shortest path from source to all nodes.', hint2: 'Dijkstra algorithm with priority queue.', solution: 'Dijkstra from source. Max of all shortest distances = answer.', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V+E)', pattern: 'Dijkstra' }),
            P('connected-components', 'Number of Connected Components', 'Medium', { hint1: 'Count separate groups of connected nodes.', hint2: 'Union-Find or DFS. Count unique roots/components.', solution: 'Union-Find: union edges, count unique parents. Or DFS from each unvisited.', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', pattern: 'Union-Find' }),
        ]
    },
];

// ============================================
// CATEGORY 3: PRACTICE & STRENGTHEN
// ============================================
const PRACTICE = [
    {
        id: 'string-practice',
        title: 'String Manipulation',
        category: 'practice',
        problems: [
            P('longest-palindromic-substr', 'Longest Palindromic Substring', 'Medium', { hint1: 'Expand around center for each position.', hint2: 'Try both odd and even length palindromes.', solution: 'For each center, expand outward while palindrome. Track longest.', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', pattern: 'Expand Around Center' }),
            P('palindromic-substrings', 'Palindromic Substrings', 'Medium', { hint1: 'Count all palindromes, not just longest.', hint2: 'Expand around each center, count valid expansions.', solution: 'For each center (odd+even), expand and count. Sum all.', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', pattern: 'Expand Around Center' }),
            P('valid-palindrome-ii', 'Valid Palindrome II', 'Easy', { hint1: 'Allow at most one deletion.', hint2: 'Two pointers. On mismatch, try skipping left OR right.', solution: 'Two pointers. On mismatch: check if s[l+1..r] or s[l..r-1] is palindrome.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Two Pointer + Skip' }),
            P('longest-common-prefix', 'Longest Common Prefix', 'Easy', { hint1: 'Compare character by character across all strings.', hint2: 'Take first string as reference. Compare each char with others.', solution: 'For each position in first string, check if all strings have same char.', timeComplexity: 'O(n*m)', spaceComplexity: 'O(1)', pattern: 'Vertical Scanning' }),
        ]
    },
    {
        id: 'matrix-practice',
        title: 'Matrix Problems',
        category: 'practice',
        problems: [
            P('word-search-grid', 'Word Search', 'Medium', { hint1: 'DFS from each cell matching first letter.', hint2: 'Mark visited, try 4 directions, backtrack.', solution: 'For each cell: if matches word[0], DFS matching subsequent chars.', timeComplexity: 'O(m*n*4^L)', spaceComplexity: 'O(L)', pattern: 'Grid DFS' }),
            P('surrounded-regions', 'Surrounded Regions', 'Medium', { hint1: 'Border-connected Os cannot be captured.', hint2: 'DFS/BFS from border Os. Mark safe. Capture rest.', solution: 'Mark border-connected Os as safe. Flip remaining Os to Xs.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)', pattern: 'Border DFS' }),
            P('rotting-oranges', 'Rotting Oranges', 'Medium', { hint1: 'Multi-source BFS from all rotten oranges.', hint2: 'BFS level = time. Add all rotten first.', solution: 'Queue all rotten. BFS spreading rot. Count levels. Check remaining fresh.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)', pattern: 'Multi-source BFS' }),
        ]
    },
    {
        id: 'dp-practice',
        title: 'DP Challenges',
        category: 'practice',
        problems: [
            P('unique-paths', 'Unique Paths', 'Medium', { hint1: 'Only move right or down.', hint2: 'dp[i][j] = dp[i-1][j] + dp[i][j-1].', solution: '2D DP. dp[0][j]=1, dp[i][0]=1. Fill: sum of top and left.', timeComplexity: 'O(m*n)', spaceComplexity: 'O(n)', pattern: 'Grid DP' }),
            P('decode-ways', 'Decode Ways', 'Medium', { hint1: 'At each position: decode 1 digit or 2 digits.', hint2: 'dp[i] = dp[i-1] (if valid 1-digit) + dp[i-2] (if valid 2-digit).', solution: 'DP. Check if s[i] valid (1-9) then add dp[i-1]. If s[i-1:i+1] valid (10-26) add dp[i-2].', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Linear DP' }),
            P('house-robber-ii', 'House Robber II', 'Medium', { hint1: 'Circular: cant rob first AND last.', hint2: 'Run House Robber on nums[0:n-1] and nums[1:n]. Max of both.', solution: 'Two passes of linear House Robber excluding first or last. Return max.', timeComplexity: 'O(n)', spaceComplexity: 'O(1)', pattern: 'Circular DP' }),
            P('edit-distance', 'Edit Distance', 'Medium', { hint1: 'Three operations: insert, delete, replace.', hint2: 'dp[i][j] = min(insert, delete, replace) + 1.', solution: '2D DP. If chars match use dp[i-1][j-1]. Else 1 + min(insert, delete, replace).', timeComplexity: 'O(m*n)', spaceComplexity: 'O(m*n)', pattern: '2D String DP' }),
        ]
    },
];

// ============================================
// EXPORT: Combine all categories
// ============================================
export const BLIND_75 = [...MUST_KNOW, ...PATTERN_MASTERY, ...PRACTICE];

// Category metadata for UI
export const CATEGORIES = [
    { id: 'must-know', label: 'Must-Know', desc: 'Core problems every developer must master', color: 'rose' },
    { id: 'pattern-mastery', label: 'Pattern Mastery', desc: 'Learn the key algorithmic patterns', color: 'purple' },
    { id: 'practice', label: 'Practice', desc: 'Strengthen your skills with more problems', color: 'blue' },
];
