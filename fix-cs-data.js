const fs = require('fs');
const path = require('path');

const csfund = {
  id: 'cs-fundamentals',
  name: 'CS Fundamentals',
  icon: '💻',
  color: '#8b5cf6',
  description: 'Algorithms, data structures, OS concepts, systems design',
  levels: {
    beginner: {
      name: 'Beginner',
      description: 'Basic data structures and algorithms',
      questions: [
        {id:'cs-b1',type:'multiple-choice',question:'What is time complexity of binary search?',options:['O(n)','O(log n)','O(n²)','O(1)'],correct:1,explanation:'Binary search halves search space each iteration: O(log n).',xp:10},
        {id:'cs-b2',type:'multiple-choice',question:'What data structure uses LIFO?',options:['Queue','Stack','Array','Tree'],correct:1,explanation:'Stack is Last In First Out - like a stack of plates.',xp:10},
        {id:'cs-b3',type:'multiple-choice',question:'What is a hash table collision?',options:['Two values are equal','Two different keys hash to same index','Table is full','Hash function fails'],correct:1,explanation:'Collision occurs when hash function maps different keys to same bucket.',xp:10},
        {id:'cs-b4',type:'multiple-choice',question:'What is Big O notation?',options:['Best case runtime','Average case runtime','Upper bound on growth rate of algorithm','Exact runtime'],correct:2,explanation:'Big O describes worst-case asymptotic time/space complexity.',xp:10},
        {id:'cs-b5',type:'multiple-choice',question:'What is a linked list?',options:['Array with links','Sequence of nodes where each points to next','List of links','Type of tree'],correct:1,explanation:'Linked list: nodes contain data and pointer to next node.',xp:10},
        {id:'cs-b6',type:'multiple-choice',question:'What is recursion?',options:['Loop','Function calling itself','Iteration','Data structure'],correct:1,explanation:'Recursion: function solves problem by calling itself with smaller input.',xp:10},
        {id:'cs-b7',type:'multiple-choice',question:'What is a binary tree?',options:['Tree with two nodes','Tree where each node has at most 2 children','Tree with binary data','Tree with 2 levels'],correct:1,explanation:'Binary tree: each node has left and right child (or null).',xp:10},
        {id:'cs-b8',type:'multiple-choice',question:'What does DFS stand for?',options:['Data File System','Depth First Search','Direct File Storage','Dynamic Function Search'],correct:1,explanation:'DFS explores as far as possible along each branch before backtracking.',xp:10},
        {id:'cs-b9',type:'multiple-choice',question:'What is a queue?',options:['LIFO structure','FIFO structure','Random access','Stack'],correct:1,explanation:'Queue is First In First Out - like a line at a store.',xp:10},
        {id:'cs-b10',type:'multiple-choice',question:'What is sorting stability?',options:['Sorting never crashes','Equal elements maintain relative order','Sorting is fast','Sorting uses little memory'],correct:1,explanation:'Stable sort preserves original order of equal elements.',xp:10},
        {id:'cs-b11',type:'multiple-choice',question:'What is a graph?',options:['Chart','Set of nodes connected by edges','Tree structure','Array'],correct:1,explanation:'Graph: nodes (vertices) connected by edges, modeling relationships.',xp:10},
        {id:'cs-b12',type:'multiple-choice',question:'What is an array?',options:['List of lists','Contiguous block of memory storing elements of same type','Dynamic structure','Tree'],correct:1,explanation:'Array: fixed-size sequential collection with O(1) index access.',xp:10},
        {id:'cs-b13',type:'multiple-choice',question:'What is a pointer?',options:['Arrow','Variable storing memory address of another variable','Number','Function'],correct:1,explanation:'Pointer holds memory address, enabling indirect data access.',xp:10},
        {id:'cs-b14',type:'multiple-choice',question:'What is quicksort average case?',options:['O(n)','O(n log n)','O(n²)','O(log n)'],correct:1,explanation:'Quicksort average case: O(n log n). Worst case (sorted): O(n²).',xp:10},
        {id:'cs-b15',type:'multiple-choice',question:'What is memoization?',options:['Remembering algorithms','Caching results of expensive function calls','Memory allocation','Deleting memory'],correct:1,explanation:'Memoization stores function results to avoid redundant computation.',xp:10},
        {id:'cs-b16',type:'multiple-choice',question:'What is BFS?',options:['Best First Search','Breadth First Search','Binary File System','Balanced Function Search'],correct:1,explanation:'BFS explores all neighbors at current depth before going deeper.',xp:10},
        {id:'cs-b17',type:'multiple-choice',question:'What is a heap?',options:['Messy memory','Complete binary tree satisfying heap property (parent ≥ children)','Stack overflow','Garbage'],correct:1,explanation:'Heap: tree-based structure for priority queue with O(log n) operations.',xp:10},
        {id:'cs-b18',type:'multiple-choice',question:'What is dynamic programming?',options:['Programming while running','Breaking problem into overlapping subproblems and caching solutions','Changing code at runtime','Programming dynamically typed languages'],correct:1,explanation:'DP solves problems by breaking into subproblems and reusing solutions.',xp:10},
        {id:'cs-b19',type:'multiple-choice',question:'What is a BST?',options:['Binary Search Tree where left < parent < right','Best Search Tree','Balanced System Tree','Binary Sort Table'],correct:0,explanation:'BST maintains sorted order: left subtree < node < right subtree.',xp:10},
        {id:'cs-b20',type:'multiple-choice',question:'What is space complexity?',options:['Memory used by algorithm','Disk space','Code size','Runtime'],correct:0,explanation:'Space complexity: amount of memory algorithm uses relative to input size.',xp:10}
      ]
    },
    intermediate: {
      name: 'Intermediate',
      description: 'Advanced algorithms and OS concepts',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cs-i${i+1}`,
        type: 'multiple-choice',
        question: i % 4 === 0 ? 'What is a trie?' : i % 4 === 1 ? 'What is Dijkstras algorithm for?' : i % 4 === 2 ? 'What is a deadlock?' : 'What is virtual memory?',
        options: i % 4 === 0 ? ['Tree for strings where each node represents a character','Tri-node tree','Type of BST','Graph structure'] :
                 i % 4 === 1 ? ['Sorting','Shortest path in weighted graph with non-negative weights','String matching','Tree traversal'] :
                 i % 4 === 2 ? ['Slow program','Two or more processes waiting for each other to release resources','Program crash','Memory leak'] :
                 ['Fake memory','Using disk space as RAM extension to run larger programs','Cloud memory','Cache'],
        correct: i % 4 === 0 ? 0 : 1,
        explanation: i % 4 === 0 ? 'Trie: stores strings efficiently for fast prefix searches.' :
                     i % 4 === 1 ? 'Dijkstra finds shortest paths from source using priority queue.' :
                     i % 4 === 2 ? 'Deadlock: circular wait where processes block each other indefinitely.' :
                     'Virtual memory: OS uses disk to extend RAM, swapping pages in/out.',
        xp: 15
      }))
    },
    advanced: {
      name: 'Advanced',
      description: 'Systems design and advanced algorithms',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cs-a${i+1}`,
        type: 'multiple-choice',
        question: i % 5 === 0 ? 'How does consistent hashing work?' : 
                  i % 5 === 1 ? 'What is the Byzantine Generals Problem?' :
                  i % 5 === 2 ? 'What is a Bloom filter?' :
                  i % 5 === 3 ? 'What is the two-phase commit protocol?' :
                  'What is eventual consistency?',
        options: i % 5 === 0 ? ['Normal hash','Hash keys and nodes onto ring, assign each key to next clockwise node','Perfect hash','Random assignment'] :
                 i % 5 === 1 ? ['War strategy','Achieving consensus in distributed system with potentially malicious nodes','Military history','Network protocol'] :
                 i % 5 === 2 ? ['Image filter','Probabilistic data structure for set membership (false positives possible, no false negatives)','Network filter','Sorting algorithm'] :
                 i % 5 === 3 ? ['Two steps','Distributed transaction protocol ensuring atomic commits across nodes (prepare then commit)','Deployment process','Version control'] :
                 ['Never consistent','Distributed system model where all replicas eventually converge if updates stop','Always consistent','No consistency'],
        correct: 1,
        explanation: i % 5 === 0 ? 'Consistent hashing: minimal key remapping when adding/removing nodes.' :
                     i % 5 === 1 ? 'Byzantine fault tolerance: consensus despite arbitrary failures/attacks.' :
                     i % 5 === 2 ? 'Bloom filter: space-efficient, fast membership check with tunable false positive rate.' :
                     i % 5 === 3 ? '2PC: coordinator ensures all participants prepare successfully before commit.' :
                     'Eventual consistency: prioritizes availability over immediate consistency (BASE).',
        xp: 20
      }))
    }
  }
};

fs.writeFileSync(path.join(__dirname, 'data', 'cs-fundamentals.json'), JSON.stringify(csfund, null, 2));
console.log('✅ CS Fundamentals data fixed');
