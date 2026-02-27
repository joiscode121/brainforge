const fs = require('fs');
const path = require('path');

// Competitive Math / TMSCA / Number Sense
const compMath = {
  id: 'comp-math',
  name: 'Competitive Math',
  icon: '⚡',
  color: '#f59e0b',
  description: 'TMSCA, Number Sense, speed drills, mental math shortcuts',
  levels: {
    beginner: {
      name: 'Beginner',
      description: 'Basic arithmetic and speed drills',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cm-b${i+1}`,
        type: 'text-input',
        question: i % 5 === 0 ? `What is 17 × 13?` : 
                  i % 5 === 1 ? `What is 23 + 47 + 19?` :
                  i % 5 === 2 ? `What is 144 ÷ 12?` :
                  i % 5 === 3 ? `What is 15²?` :
                  `What is 200 - 87?`,
        answer: i % 5 === 0 ? '221' :
                i % 5 === 1 ? '89' :
                i % 5 === 2 ? '12' :
                i % 5 === 3 ? '225' :
                '113',
        explanation: 'Practice mental math speed for Number Sense competitions.',
        xp: 10,
        timeLimit: 15
      }))
    },
    intermediate: {
      name: 'Intermediate',
      description: 'Multi-digit speed calculations',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cm-i${i+1}`,
        type: 'text-input',
        question: i % 4 === 0 ? `What is 47 × 53?` :
                  i % 4 === 1 ? `What is √(1296)?` :
                  i % 4 === 2 ? `What is 2⁸?` :
                  `What is 35²?`,
        answer: i % 4 === 0 ? '2491' :
                i % 4 === 1 ? '36' :
                i % 4 === 2 ? '256' :
                '1225',
        explanation: i % 4 === 0 ? 'Use (50-3)(50+3) = 2500 - 9 = 2491' :
                     i % 4 === 1 ? 'Perfect square: 36 × 36 = 1296' :
                     i % 4 === 2 ? 'Powers of 2: double repeatedly' :
                     'Use (30+5)² = 900 + 300 + 25 = 1225',
        xp: 15,
        timeLimit: 20
      }))
    },
    advanced: {
      name: 'Advanced',
      description: 'Competition-level tricks and shortcuts',
      questions: Array.from({length: 20}, (_, i) => ({
        id: `cm-a${i+1}`,
        type: 'text-input',
        question: i % 4 === 0 ? `What is 125 × 88?` :
                  i % 4 === 1 ? `What is 1/7 as decimal (first 6 digits)?` :
                  i % 4 === 2 ? `Find GCD(252, 198)` :
                  `What is 999²?`,
        answer: i % 4 === 0 ? '11000' :
                i % 4 === 1 ? '0.142857' :
                i % 4 === 2 ? '18' :
                '998001',
        explanation: i % 4 === 0 ? '125 × 88 = 125 × 8 × 11 = 1000 × 11' :
                     i % 4 === 1 ? '1/7 = 0.142857... (repeating)' :
                     i % 4 === 2 ? 'Use Euclidean algorithm: 252 = 198×1 + 54, 198 = 54×3 + 36, etc.' :
                     '999² = (1000-1)² = 1000000 - 2000 + 1 = 998001',
        xp: 20,
        timeLimit: 30
      }))
    }
  }
};

// CS Fundamentals
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
      questions: [
        {id:'cs-i1',type:'multiple-choice',question:'What is a trie?',options:['Tree for strings where each node represents a character','Tri-node tree','Type of BST','Graph structure'],correct:0,explanation:'Trie (prefix tree): stores strings efficiently for fast prefix searches.',xp:15},
        {id:'cs-i2',type:'multiple-choice',question:'What is Dijkstras algorithm for?',options:['Sorting','Shortest path in weighted graph with non-negative weights','String matching','Tree traversal'],correct:1,explanation:'Dijkstra finds shortest paths from source using priority queue.',xp:15},
        {id:'cs-i3',type:'multiple-choice',question:'What is a deadlock?',options:['Slow program','Two or more processes waiting for each other to release resources','Program crash','Memory leak'],correct:1,explanation:'Deadlock: circular wait where processes block each other indefinitely.',xp:15},
        {id:'cs-i4',type:'multiple-choice',question:'What is virtual memory?',options:['Fake memory','Using disk space as RAM extension to run larger programs','Cloud memory','Cache'],correct:1,explanation:'Virtual memory: OS uses disk to extend RAM, swapping pages in/out.',xp:15},
        {id:'cs-i5',type:'multiple-choice',question:'What is the CAP theorem?',options:['Computer Algorithm Performance','Distributed system cant guarantee Consistency, Availability, Partition tolerance simultaneously','Capacity Analysis Protocol','Code Analysis Platform'],correct:1,explanation:'CAP: in network partition, choose consistency or availability (cant have both).',xp:15},
        {id:'cs-i6',type:'multiple-choice',question:'What is a race condition?',options:['Fast algorithm','Output depends on timing of uncontrolled events (thread scheduling)','Competition between programs','Speed test'],correct:1,explanation:'Race condition: behavior depends on non-deterministic thread interleaving.',xp:15},
        {id:'cs-i7',type:'multiple-choice',question:'What is the longest common subsequence problem?',options:['Finding longest substring','Finding longest sequence appearing in same order in both strings (not necessarily contiguous)','Finding repeated pattern','String sorting'],correct:1,explanation:'LCS uses DP: build table comparing all prefixes of both strings.',xp:15},
        {id:'cs-i8',type:'multiple-choice',question:'What is a mutex?',options:['Multiple threads','Mutual exclusion lock ensuring only one thread accesses critical section','Music library','Memory unit'],correct:1,explanation:'Mutex: synchronization primitive preventing concurrent access to shared resource.',xp:15},
        {id:'cs-i9',type:'multiple-choice',question:'What is the knapsack problem?',options:['Organizing backpack','Optimization: maximize value of items with weight constraint','Sorting problem','Graph problem'],correct:1,explanation:'0/1 Knapsack: DP solution fills table considering include/exclude for each item.',xp:15},
        {id:'cs-i10',type:'multiple-choice',question:'What is a semaphore?',options:['Signal flag','Synchronization primitive with counter controlling access to shared resources','Sensor','Memory barrier'],correct:1,explanation:'Semaphore: generalized mutex allowing N threads concurrent access.',xp:15},
        {id:'cs-i11',type:'multiple-choice',question:'What is Bellman-Ford algorithm for?',options:['Sorting','Shortest path even with negative weights (detects negative cycles)','String matching','Matrix multiplication'],correct:1,explanation:'Bellman-Ford: relaxes all edges V-1 times, works with negative weights.',xp:15},
        {id:'cs-i12',type:'multiple-choice',question:'What is paging in OS?',options:['Book organization','Dividing memory into fixed-size pages for virtual memory management','Network protocol','File system'],correct:1,explanation:'Paging: memory divided into pages (4KB typical) for efficient virtual memory.',xp:15},
        {id:'cs-i13',type:'multiple-choice',question:'What is a B-tree used for?',options:['Binary operations','Self-balancing tree optimized for disk access (databases, filesystems)','Bee storage','Network routing'],correct:1,explanation:'B-tree: keeps data sorted, allows O(log n) operations, minimizes disk I/O.',xp:15},
        {id:'cs-i14',type:'multiple-choice',question:'What is topological sorting?',options:['Sorting by location','Linear ordering of directed acyclic graph nodes respecting dependencies','Geographic sorting','Tree sorting'],correct:1,explanation:'Topo sort: DFS-based ordering where dependencies come before dependents.',xp:15},
        {id:'cs-i15',type:'multiple-choice',question:'What is context switching?',options:['Changing context','OS saving state of process and loading another processs state','Menu switching','Mode change'],correct:1,explanation:'Context switch: expensive operation storing/restoring registers, PC, stack pointer.',xp:15},
        {id:'cs-i16',type:'multiple-choice',question:'What is the dining philosophers problem?',options:['Philosophy debate','Classic synchronization problem demonstrating deadlock and resource contention','Meal planning','Restaurant management'],correct:1,explanation:'5 philosophers need 2 forks each - models resource allocation deadlock.',xp:15},
        {id:'cs-i17',type:'multiple-choice',question:'What is a red-black tree?',options:['Colored tree','Self-balancing BST with node colors ensuring O(log n) operations','Christmas tree','Error tree'],correct:1,explanation:'Red-black tree: maintains balance through color properties and rotations.',xp:15},
        {id:'cs-i18',type:'multiple-choice',question:'What is the traveling salesman problem?',options:['Vacation planning','NP-hard optimization: find shortest route visiting all cities once','Sales territory','Navigation system'],correct:1,explanation:'TSP: finding optimal Hamiltonian cycle is NP-complete, use approximations.',xp:15},
        {id:'cs-i19',type:'multiple-choice',question:'What is a segment tree?',options:['Tree segment','Data structure for efficient range queries and updates','Network segment','Memory segment'],correct:1,explanation:'Segment tree: binary tree enabling O(log n) range queries (sum, min, max).',xp:15},
        {id:'cs-i20',type:'multiple-choice',question:'What is thrashing in OS?',options:['Disk damage','System spending more time swapping pages than executing due to insufficient RAM','Fast processing','Data corruption'],correct:1,explanation:'Thrashing: constant paging kills performance when working set exceeds RAM.',xp:15}
      ]
    },
    advanced: {
      name: 'Advanced',
      description: 'Systems design and advanced algorithms',
      questions: [
        {id:'cs-a1',type:'multiple-choice',question:'How does consistent hashing work?',options:['Normal hash','Hash keys and nodes onto ring, assign each key to next clockwise node','Perfect hash','Random assignment'],correct:1,explanation:'Consistent hashing: minimal key remapping when adding/removing nodes.',xp:20},
        {id:'cs-a2',type:'multiple-choice',question:'What is the Byzantine Generals Problem?',options:['War strategy','Achieving consensus in distributed system with potentially malicious nodes','Military history','Network protocol'],correct:1,explanation:'Byzantine fault tolerance: consensus despite arbitrary failures/attacks.',xp:20},
        {id:'cs-a3',type:'multiple-choice',question:'What is a Bloom filter?',options:['Image filter','Probabilistic data structure for set membership (false positives possible, no false negatives)','Network filter','Sorting algorithm'],correct:1,explanation:'Bloom filter: space-efficient, fast membership check with tunable false positive rate.',xp:20},
        {id:'cs-a4',type:'multiple-choice',question:'What is the two-phase commit protocol?',options:['Two steps','Distributed transaction protocol ensuring atomic commits across nodes (prepare then commit)','Deployment process','Version control'],correct:1,explanation:'2PC: coordinator ensures all participants prepare successfully before commit.',xp:20},
        {id:'cs-a5',type:'multiple-choice',question:'What is eventual consistency?',options:['Never consistent','Distributed system model where all replicas eventually converge if updates stop','Always consistent','No consistency'],correct:1,explanation:'Eventual consistency: prioritizes availability over immediate consistency (BASE).',xp:20},
        {id:'cs-a6',type:'multiple-choice',question:'What is a skip list?',options:['Skipping items','Probabilistic data structure with multiple layers for O(log n) search','Linked list subset','Cache strategy'],correct:1,explanation:'Skip list: randomized layers create express lanes for faster search than linked list.',xp:20},
        {id:'cs-a7',type:'multiple-choice',question:'What is the Raft consensus algorithm?',options:['River rafting','Distributed consensus protocol simpler than Paxos (leader election + log replication)','Load balancing','Routing'],correct:1,explanation:'Raft: understandable consensus with leader-based replication for fault tolerance.',xp:20},
        {id:'cs-a8',type:'multiple-choice',question:'What is the actor model?',options:['Theater','Concurrency model where actors are primitive units communicating via messages','Design pattern','UI framework'],correct:1,explanation:'Actor model: isolated state, asynchronous message passing, no shared memory.',xp:20},
        {id:'cs-a9',type:'multiple-choice',question:'What is the A* algorithm?',options:['Star rating','Pathfinding using heuristic to guide search toward goal efficiently','Asterisk matching','Grading system'],correct:1,explanation:'A* = Dijkstra + heuristic. f(n) = g(n) + h(n) where h estimates distance to goal.',xp:20},
        {id:'cs-a10',type:'multiple-choice',question:'What is MVCC?',options:['Multi-View Camera','Multi-Version Concurrency Control: readers dont block writers using versions','Video codec','Design pattern'],correct:1,explanation:'MVCC: each transaction sees snapshot, enabling high concurrency in databases.',xp:20},
        {id:'cs-a11',type:'multiple-choice',question:'What is a merkle tree?',options:['Tree species','Hash tree where each non-leaf is hash of children, enabling efficient verification','Garden tree','File tree'],correct:1,explanation:'Merkle tree: used in blockchain, Git, distributed systems for integrity verification.',xp:20},
        {id:'cs-a12',type:'multiple-choice',question:'What is the gossip protocol?',options:['Office rumors','Distributed communication where nodes randomly share information with peers','Chat protocol','Security flaw'],correct:1,explanation:'Gossip: epidemic-style information spread achieves eventual consistency.',xp:20},
        {id:'cs-a13',type:'multiple-choice',question:'What is sharding?',options:['Breaking glass','Horizontal partitioning: splitting database across multiple machines by key range','Backup','Encryption'],correct:1,explanation:'Sharding: distributes data and load across servers for scalability.',xp:20},
        {id:'cs-a14',type:'multiple-choice',question:'What is the Paxos algorithm?',options:['Greek history','Consensus protocol for fault-tolerant distributed systems','Island','Network protocol'],correct:1,explanation:'Paxos: complex but proven consensus algorithm (proposer, acceptor, learner roles).',xp:20},
        {id:'cs-a15',type:'multiple-choice',question:'What is a CRDT?',options:['Credit','Conflict-free Replicated Data Type: automatically resolves concurrent updates','Certificate','Command'],correct:1,explanation:'CRDT: mathematical properties guarantee convergence without coordination.',xp:20},
        {id:'cs-a16',type:'multiple-choice',question:'What is the CAP theorem tradeoff in practice?',options:['No tradeoff','During partition: choose CP (consistent but unavailable) or AP (available but potentially inconsistent)','Always choose all three','No effect'],correct:1,explanation:'Real systems: tune consistency level (strong, eventual, causal) per use case.',xp:20},
        {id:'cs-a17',type:'multiple-choice',question:'What is the MapReduce paradigm?',options:['Reducing maps','Distributed computing model: map transforms data, reduce aggregates results','GPS algorithm','Design pattern'],correct:1,explanation:'MapReduce: parallel processing framework for big data (Hadoop, Spark).',xp:20},
        {id:'cs-a18',type:'multiple-choice',question:'What is cache coherence?',options:['Clear cache','Ensuring multiple caches have consistent view of memory in multiprocessor systems','Cache organization','Memory alignment'],correct:1,explanation:'Cache coherence protocols (MESI, MOESI) keep caches synchronized via snooping or directory.',xp:20},
        {id:'cs-a19',type:'multiple-choice',question:'What is the actor model vs CSP?',options:['Acting styles','Actor: addresses + async messages. CSP: channels + sync communication','Theater comparison','Programming languages'],correct:1,explanation:'Actor (Erlang, Akka) vs CSP (Go channels): different concurrency abstractions.',xp:20},
        {id:'cs-a20',type:'multiple-choice',question:'What is linearizability?',options:['Making linear','Strong consistency: operations appear atomic and in real-time order','Straightening code','Matrix operation'],correct:1,explanation:'Linearizability: strongest single-object consistency guarantee in distributed systems.',xp:20}
      ]
    }
  }
};

// STEM Foundations
const stem = {
  id: 'stem',
  name: 'STEM Foundations',
  icon: '🔬',
  color: '#10b981',
  description: 'Physics, engineering, chemistry, applied mathematics',
  levels: {
    beginner: {
      name: 'Beginner',
      description: 'Basic physics and engineering concepts',
      questions: [
        {id:'st-b1',type:'multiple-choice',question:'What is Newtons First Law?',options:['F=ma','Object in motion stays in motion unless acted upon by force','Every action has equal opposite reaction','Gravity pulls objects down'],correct:1,explanation:'Law of inertia: objects resist changes in motion without external force.',xp:10},
        {id:'st-b2',type:'multiple-choice',question:'What is kinetic energy formula?',options:['mgh','½mv²','mv','F×d'],correct:1,explanation:'KE = ½mv²: energy of motion depends on mass and velocity squared.',xp:10},
        {id:'st-b3',type:'multiple-choice',question:'What is Ohms Law?',options:['E=mc²','V=IR (voltage = current × resistance)','P=IV','F=ma'],correct:1,explanation:'Ohms Law: voltage across resistor = current through it × resistance.',xp:10},
        {id:'st-b4',type:'multiple-choice',question:'What is acceleration?',options:['Speed','Rate of change of velocity','Distance traveled','Force applied'],correct:1,explanation:'Acceleration: how quickly velocity changes (m/s²).',xp:10},
        {id:'st-b5',type:'multiple-choice',question:'What is potential energy?',options:['Energy of motion','Stored energy based on position (mgh for gravity)','Heat energy','Light energy'],correct:1,explanation:'Gravitational PE = mgh: mass × gravity × height.',xp:10},
        {id:'st-b6',type:'multiple-choice',question:'What is power?',options:['Force','Energy per unit time (Joules/second = Watts)','Voltage','Current'],correct:1,explanation:'Power = energy/time = work/time. Watt = Joule/second.',xp:10},
        {id:'st-b7',type:'multiple-choice',question:'What is wavelength?',options:['Height of wave','Distance between consecutive wave peaks','Speed of wave','Frequency of wave'],correct:1,explanation:'Wavelength (λ): spatial period of wave. v = fλ (speed = frequency × wavelength).',xp:10},
        {id:'st-b8',type:'multiple-choice',question:'What is momentum?',options:['Speed','Mass × velocity','Force × time','Energy'],correct:1,explanation:'Momentum p = mv: conserved in collisions (total before = total after).',xp:10},
        {id:'st-b9',type:'multiple-choice',question:'What is electric current?',options:['Voltage','Flow of electric charge (Coulombs/second = Amperes)','Resistance','Power'],correct:1,explanation:'Current: rate of charge flow. 1 Ampere = 1 Coulomb/second.',xp:10},
        {id:'st-b10',type:'multiple-choice',question:'What is work in physics?',options:['Effort','Force × distance in direction of force','Energy','Power × time'],correct:1,explanation:'Work W = F·d: energy transfer when force moves object.',xp:10},
        {id:'st-b11',type:'multiple-choice',question:'What is frequency?',options:['Wavelength','Number of wave cycles per second (Hertz)','Amplitude','Speed'],correct:1,explanation:'Frequency f: oscillations per second. 1 Hz = 1 cycle/second.',xp:10},
        {id:'st-b12',type:'multiple-choice',question:'What is Newtons Second Law?',options:['Inertia','F=ma (force = mass × acceleration)','Action-reaction','Gravity'],correct:1,explanation:'F=ma: force causes proportional acceleration inversely related to mass.',xp:10},
        {id:'st-b13',type:'multiple-choice',question:'What is resistance in circuits?',options:['Current','Opposition to current flow (Ohms)','Voltage','Power'],correct:1,explanation:'Resistance R: measured in Ohms (Ω), opposes current, dissipates heat.',xp:10},
        {id:'st-b14',type:'multiple-choice',question:'What is the unit of force?',options:['Joule','Newton','Watt','Volt'],correct:1,explanation:'Newton (N): 1 N = 1 kg·m/s² (force to accelerate 1 kg at 1 m/s²).',xp:10},
        {id:'st-b15',type:'multiple-choice',question:'What is velocity?',options:['Speed','Speed with direction (vector)','Acceleration','Distance'],correct:1,explanation:'Velocity: vector quantity (magnitude + direction), unlike scalar speed.',xp:10},
        {id:'st-b16',type:'multiple-choice',question:'What is density?',options:['Volume','Mass per unit volume','Weight','Pressure'],correct:1,explanation:'Density ρ = m/V. Water: ~1000 kg/m³.',xp:10},
        {id:'st-b17',type:'multiple-choice',question:'What is gravity on Earth?',options:['10 m/s²','~9.8 m/s² downward','Speed of light','Variable'],correct:1,explanation:'g ≈ 9.8 m/s²: acceleration due to gravity near Earths surface.',xp:10},
        {id:'st-b18',type:'multiple-choice',question:'What is a series circuit?',options:['Parallel paths','Single path where same current flows through all components','Multiple paths','No path'],correct:1,explanation:'Series: current same everywhere, voltage divides across components.',xp:10},
        {id:'st-b19',type:'multiple-choice',question:'What is friction?',options:['Pushing force','Force opposing relative motion between surfaces','Gravity','Acceleration'],correct:1,explanation:'Friction: depends on normal force and surface properties (μN).',xp:10},
        {id:'st-b20',type:'multiple-choice',question:'What is temperature?',options:['Heat','Measure of average kinetic energy of particles','Energy','Pressure'],correct:1,explanation:'Temperature: average thermal energy. Kelvin = Celsius + 273.15.',xp:10}
      ]
    },
    intermediate: {
      name: 'Intermediate',
      description: 'Thermodynamics, electromagnetism, waves',
      questions: [
        {id:'st-i1',type:'multiple-choice',question:'What is the First Law of Thermodynamics?',options:['Entropy increases','Energy is conserved: ΔU = Q - W','Heat flows hot to cold','Absolute zero unreachable'],correct:1,explanation:'ΔU = Q - W: change in internal energy = heat added - work done by system.',xp:15},
        {id:'st-i2',type:'multiple-choice',question:'What is Maxwells equations describe?',options:['Gravity','All classical electromagnetism (electric and magnetic field relationships)','Quantum mechanics','Thermodynamics'],correct:1,explanation:'Maxwells 4 equations: Gauss (E), Gauss (B), Faraday, Ampere-Maxwell.',xp:15},
        {id:'st-i3',type:'multiple-choice',question:'What is entropy?',options:['Energy','Measure of disorder/randomness in system','Temperature','Pressure'],correct:1,explanation:'Entropy S: Second Law says isolated systems entropy increases.',xp:15},
        {id:'st-i4',type:'multiple-choice',question:'What is Faradays Law?',options:['V=IR','Changing magnetic flux induces EMF: ε = -dΦ/dt','F=ma','E=mc²'],correct:1,explanation:'Faraday: time-varying magnetic field induces electric field (basis of generators).',xp:15},
        {id:'st-i5',type:'multiple-choice',question:'What is the Doppler effect?',options:['Sound amplification','Change in wave frequency due to relative motion of source and observer','Echo','Resonance'],correct:1,explanation:'Doppler: frequency increases when approaching, decreases when receding.',xp:15},
        {id:'st-i6',type:'multiple-choice',question:'What is an inductor?',options:['Resistor','Component that opposes change in current via magnetic field','Capacitor','Battery'],correct:1,explanation:'Inductor: V = L(dI/dt). Stores energy in magnetic field.',xp:15},
        {id:'st-i7',type:'multiple-choice',question:'What is resonance?',options:['Echo','System oscillates at maximum amplitude when driven at natural frequency','Sound quality','Pitch'],correct:1,explanation:'Resonance: energy transfer maximized at natural frequency (bridges, circuits, atoms).',xp:15},
        {id:'st-i8',type:'multiple-choice',question:'What is the Carnot cycle?',options:['Car engine','Idealized thermodynamic cycle with maximum theoretical efficiency','Cooling system','Circuit'],correct:1,explanation:'Carnot: efficiency = 1 - T_cold/T_hot. No real engine achieves this.',xp:15},
        {id:'st-i9',type:'multiple-choice',question:'What is Kirchhoffs Voltage Law?',options:['V=IR','Sum of voltages around closed loop = 0','Current in = current out','Power conservation'],correct:1,explanation:'KVL: voltage rises = voltage drops in any loop (energy conservation).',xp:15},
        {id:'st-i10',type:'multiple-choice',question:'What is Snells Law?',options:['Reflection','n₁sin(θ₁) = n₂sin(θ₂): refraction of light at interface','Diffraction','Polarization'],correct:1,explanation:'Snells Law: relates angles of incidence and refraction via refractive indices.',xp:15},
        {id:'st-i11',type:'multiple-choice',question:'What is a capacitor?',options:['Resistor','Component storing energy in electric field between plates','Inductor','Battery'],correct:1,explanation:'Capacitor: Q = CV. Stores charge, opposes voltage change.',xp:15},
        {id:'st-i12',type:'multiple-choice',question:'What is Bernoullis principle?',options:['Gravity','Fluid pressure decreases as velocity increases','Friction','Heat transfer'],correct:1,explanation:'Bernoulli: energy conservation for fluids. Explains lift on airplane wings.',xp:15},
        {id:'st-i13',type:'multiple-choice',question:'What is simple harmonic motion?',options:['Linear motion','Oscillation where restoring force proportional to displacement: F=-kx','Circular motion','Random motion'],correct:1,explanation:'SHM: sine/cosine motion (mass-spring, pendulum). x(t) = Acos(ωt + φ).',xp:15},
        {id:'st-i14',type:'multiple-choice',question:'What is the Stefan-Boltzmann Law?',options:['Ohms law','Power radiated by black body ∝ T⁴','Thermodynamic law','Circuit law'],correct:1,explanation:'Stefan-Boltzmann: j* = σT⁴. Hotter objects radiate much more.',xp:15},
        {id:'st-i15',type:'multiple-choice',question:'What is diffraction?',options:['Reflection','Bending of waves around obstacles/through openings','Refraction','Absorption'],correct:1,explanation:'Diffraction: wave spreading depends on wavelength vs obstacle size.',xp:15},
        {id:'st-i16',type:'multiple-choice',question:'What is Lenzs Law?',options:['Voltage law','Induced current opposes the change in flux that created it','Resistance law','Power law'],correct:1,explanation:'Lenz: direction of induced EMF creates current opposing flux change (conservation).',xp:15},
        {id:'st-i17',type:'multiple-choice',question:'What is the Reynolds number?',options:['Counting','Dimensionless number predicting flow regime (laminar vs turbulent)','Temperature','Pressure'],correct:1,explanation:'Re = ρvL/μ: ratio of inertial to viscous forces. Re > 2000: turbulent.',xp:15},
        {id:'st-i18',type:'multiple-choice',question:'What is blackbody radiation?',options:['Dark objects','Ideal emitter/absorber: spectrum depends only on temperature','Invisible light','Darkness'],correct:1,explanation:'Blackbody: Plancks law describes spectrum. Led to quantum theory.',xp:15},
        {id:'st-i19',type:'multiple-choice',question:'What is the photoelectric effect?',options:['Taking photos','Light ejects electrons from material if frequency above threshold','Camera operation','Film development'],correct:1,explanation:'Photoelectric: Einstein explained via photons (E=hf). Nobel 1921.',xp:15},
        {id:'st-i20',type:'multiple-choice',question:'What is interference?',options:['Noise','Superposition of waves creating constructive/destructive patterns','Signal jamming','Error'],correct:1,explanation:'Interference: Young double-slit showed wave nature of light.',xp:15}
      ]
    },
    advanced: {
      name: 'Advanced',
      description: 'Quantum mechanics and advanced physics',
      questions: [
        {id:'st-a1',type:'multiple-choice',question:'What is the Schrödinger equation?',options:['Classical mechanics','Fundamental equation of quantum mechanics: iℏ∂ψ/∂t = Ĥψ','Relativity','Thermodynamics'],correct:1,explanation:'Schrödinger: describes time evolution of quantum state wavefunction.',xp:20},
        {id:'st-a2',type:'multiple-choice',question:'What is the Heisenberg uncertainty principle?',options:['Everything is uncertain','Δx·Δp ≥ ℏ/2: cannot simultaneously know position and momentum exactly','Measurement errors','Random motion'],correct:1,explanation:'Uncertainty: fundamental limit, not measurement imprecision. Same for E-t.',xp:20},
        {id:'st-a3',type:'multiple-choice',question:'What is quantum superposition?',options:['Adding forces','System exists in multiple states simultaneously until measured','Strong superposition','Stacking'],correct:1,explanation:'Superposition: |ψ⟩ = α|0⟩ + β|1⟩. Measurement collapses to one eigenstate.',xp:20},
        {id:'st-a4',type:'multiple-choice',question:'What is quantum entanglement?',options:['Tangling','Correlated particles where measuring one instantly affects the other regardless of distance','Confusion','Complexity'],correct:1,explanation:'Entanglement: Einstein called it "spooky action." Enables quantum computing/crypto.',xp:20},
        {id:'st-a5',type:'multiple-choice',question:'What is the Pauli exclusion principle?',options:['Exclusivity','No two fermions can occupy same quantum state','Repulsion','Separation'],correct:1,explanation:'Pauli: explains atomic structure, periodic table, why matter has volume.',xp:20},
        {id:'st-a6',type:'multiple-choice',question:'What is special relativity?',options:['Relatively special','Laws of physics same in all inertial frames; c is constant','Newtonian mechanics','Quantum theory'],correct:1,explanation:'Special relativity: time dilation, length contraction, E=mc².',xp:20},
        {id:'st-a7',type:'multiple-choice',question:'What is general relativity?',options:['Very relative','Gravity is curvature of spacetime caused by mass/energy','Special case','Force theory'],correct:1,explanation:'General relativity: Einsteins field equations. Predicts black holes, gravitational waves.',xp:20},
        {id:'st-a8',type:'multiple-choice',question:'What is the Dirac equation?',options:['Simple algebra','Relativistic quantum mechanics equation predicting antimatter','Classical equation','Statistical law'],correct:1,explanation:'Dirac: combines quantum mechanics and special relativity. Predicted positron.',xp:20},
        {id:'st-a9',type:'multiple-choice',question:'What is the Standard Model?',options:['Average model','Theory describing all known fundamental particles and forces (except gravity)','Classical physics','Cosmology'],correct:1,explanation:'Standard Model: quarks, leptons, force carriers. Higgs boson confirms mass mechanism.',xp:20},
        {id:'st-a10',type:'multiple-choice',question:'What is quantum tunneling?',options:['Underground quantum','Particle passes through potential barrier classically forbidden','Fast travel','Drilling'],correct:1,explanation:'Tunneling: enables nuclear fusion in stars, transistors, radioactive decay.',xp:20},
        {id:'st-a11',type:'multiple-choice',question:'What is Noethers theorem?',options:['Nothing theorem','Every continuous symmetry corresponds to a conservation law','Mathematical proof','Physics law'],correct:1,explanation:'Noether: time symmetry → energy conservation, space → momentum, rotation → angular momentum.',xp:20},
        {id:'st-a12',type:'multiple-choice',question:'What is the Casimir effect?',options:['Casino effect','Force between uncharged conducting plates due to quantum vacuum fluctuations','Gambling','Randomness'],correct:1,explanation:'Casimir: quantum field theory prediction experimentally verified. Virtual particles.',xp:20},
        {id:'st-a13',type:'multiple-choice',question:'What is a black hole event horizon?',options:['Dark horizon','Boundary beyond which nothing (not even light) can escape','Black line','Dark matter'],correct:1,explanation:'Event horizon: one-way membrane. Schwarzschild radius rs = 2GM/c².',xp:20},
        {id:'st-a14',type:'multiple-choice',question:'What is Hawking radiation?',options:['Cosmic radiation','Black holes emit thermal radiation due to quantum effects near event horizon','Dangerous radiation','Solar radiation'],correct:1,explanation:'Hawking: black holes evaporate over time. Temperature ∝ 1/mass.',xp:20},
        {id:'st-a15',type:'multiple-choice',question:'What is the quantum Zeno effect?',options:['Philosophy','Frequent measurement prevents quantum system evolution','Speed paradox','Observation'],correct:1,explanation:'Quantum Zeno: continuous observation "freezes" state due to collapse.',xp:20},
        {id:'st-a16',type:'multiple-choice',question:'What is decoherence in quantum mechanics?',options:['Confusion','Interaction with environment destroys quantum superposition','Loss of coherence','Noise'],correct:1,explanation:'Decoherence: why we dont see macroscopic superposition. Challenge for quantum computers.',xp:20},
        {id:'st-a17',type:'multiple-choice',question:'What is the Lagrangian in physics?',options:['Language','Function L = T - V encoding system dynamics; Euler-Lagrange equations give motion','Mathematics','Coordinate'],correct:1,explanation:'Lagrangian mechanics: equivalent to Newtonian but more powerful, uses generalized coordinates.',xp:20},
        {id:'st-a18',type:'multiple-choice',question:'What is the Higgs mechanism?',options:['Machine part','Process giving mass to fundamental particles via Higgs field','Detector','Accelerator'],correct:1,explanation:'Higgs: spontaneous symmetry breaking. Higgs boson discovered CERN 2012.',xp:20},
        {id:'st-a19',type:'multiple-choice',question:'What is quantum chromodynamics?',options:['Colors','Theory of strong nuclear force between quarks via gluons','Optics','Chemistry'],correct:1,explanation:'QCD: quarks have color charge (R, G, B). Asymptotic freedom and confinement.',xp:20},
        {id:'st-a20',type:'multiple-choice',question:'What is the AdS/CFT correspondence?',options:['Advertising','Duality between gravity theory and quantum field theory (holographic principle)','Acronym','Technology'],correct:1,explanation:'AdS/CFT: string theory result relating quantum gravity to lower-dimensional QFT.',xp:20}
      ]
    }
  }
};

// Save all domains
fs.writeFileSync(path.join(__dirname, 'data', 'comp-math.json'), JSON.stringify(compMath, null, 2));
fs.writeFileSync(path.join(__dirname, 'data', 'cs-fundamentals.json'), JSON.stringify(csund), null, 2));
fs.writeFileSync(path.join(__dirname, 'data', 'stem.json'), JSON.stringify(stem, null, 2));

console.log('✅ Competitive Math (60 questions)');
console.log('✅ CS Fundamentals (60 questions)');
console.log('✅ STEM Foundations (60 questions)');
