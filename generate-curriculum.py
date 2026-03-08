#!/usr/bin/env python3
"""Generate comprehensive AI/ML curriculum for BrainForge."""
import json

curriculum = {
    "id": "ai-ml",
    "name": "AI/ML Research",
    "icon": "🤖",
    "color": "#06b6d4",
    "description": "Neural networks, transformers, diffusion models, and cutting-edge ML research — from foundations to frontier",
    "levels": {}
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 1: FOUNDATIONS
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["foundations"] = {
    "name": "Foundations",
    "description": "Linear algebra, calculus, probability, and Python for ML",
    "order": 1,
    "topics": [
        {
            "id": "vectors-matrices",
            "title": "Vectors, Matrices & Dot Products",
            "explainer": """## Vectors & Matrices: The Language of ML

Every piece of data in machine learning is represented as numbers arranged in structures called **vectors** and **matrices**.

### Step 1: What is a Vector?
A vector is simply a list of numbers. Think of it as coordinates:
- A 2D vector: [3, 4] — a point on a plane
- A 3D vector: [1, 2, 3] — a point in space
- A 768D vector: an embedding of a word in a language model

### Step 2: What is a Matrix?
A matrix is a grid of numbers (rows × columns). Think of it as a spreadsheet:
- A 3×2 matrix has 3 rows and 2 columns
- An image is a matrix of pixel values
- A weight matrix transforms inputs in a neural network

### Step 3: The Dot Product
The dot product takes two vectors and produces a single number:
- Multiply corresponding elements, then sum
- [1,2,3] · [4,5,6] = 1×4 + 2×5 + 3×6 = 32
- It measures **similarity** between vectors (core of attention!)

### Step 4: Matrix Multiplication
Matrix multiplication is just many dot products at once:
- Each element in the result = dot product of a row from A and column from B
- This is the fundamental operation in neural networks
- GPU parallelism makes this fast""",
            "visual": """  Vector (1D)          Matrix (2D)           Matrix Multiply
  ┌───┐               ┌───┬───┐             A(2×3)  ×  B(3×2)  =  C(2×2)
  │ 3 │               │ 1 │ 2 │             ┌─────┐   ┌───┐     ┌─────┐
  │ 4 │               ├───┼───┤             │1 2 3│ × │4 5│  =  │· · │
  │ 5 │               │ 3 │ 4 │             │4 5 6│   │6 7│     │· · │
  └───┘               ├───┼───┤             └─────┘   │8 9│     └─────┘
                      │ 5 │ 6 │                        └───┘
  Dot Product:        └───┴───┘             C[0,0] = 1×4 + 2×6 + 3×8 = 40
  [1,2,3]·[4,5,6]                           C[0,1] = 1×5 + 2×7 + 3×9 = 46
  = 1×4+2×5+3×6 = 32""",
            "questions": [
                {"id": "f-vm-1", "type": "multiple-choice", "question": "What is the dot product of [2, 3] and [4, 1]?", "options": ["5", "11", "14", "8"], "correct": 1, "explanation": "Dot product = 2×4 + 3×1 = 8 + 3 = 11.", "xp": 10},
                {"id": "f-vm-2", "type": "multiple-choice", "question": "If matrix A is 3×4 and matrix B is 4×2, what is the shape of A×B?", "options": ["3×2", "4×4", "3×4", "2×3"], "correct": 0, "explanation": "Matrix multiplication: (m×n) × (n×p) = (m×p). So 3×4 times 4×2 = 3×2.", "xp": 10},
                {"id": "f-vm-3", "type": "multiple-choice", "question": "Why are dot products important in attention mechanisms?", "options": ["They reduce dimensionality", "They measure similarity between query and key vectors", "They normalize the input", "They add non-linearity"], "correct": 1, "explanation": "In attention, the dot product between query and key vectors computes how much 'attention' one token should pay to another.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement matrix multiplication from scratch using only Python lists (no numpy).",
                "starter_code": "def matmul(A, B):\n    \"\"\"Multiply matrices A and B.\"\"\"\n    pass\n\nA = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\nprint(matmul(A, B))  # [[19, 22], [43, 50]]",
                "solution": "def matmul(A, B):\n    m, n, p = len(A), len(A[0]), len(B[0])\n    C = [[0]*p for _ in range(m)]\n    for i in range(m):\n        for j in range(p):\n            for k in range(n):\n                C[i][j] += A[i][k] * B[k][j]\n    return C\n\nprint(matmul([[1,2],[3,4]], [[5,6],[7,8]]))",
                "tests": "assert matmul([[1,2],[3,4]], [[5,6],[7,8]]) == [[19,22],[43,50]]"
            },
            "source": "foundations"
        },
        {
            "id": "gradients-chain-rule",
            "title": "Gradients & The Chain Rule",
            "explainer": """## Gradients: How Neural Networks Learn

### Step 1: What is a Gradient?
The gradient tells you how the output changes when you slightly change the input:
- If f(x) = x², then f'(x) = 2x
- At x=3: gradient = 6, meaning "if x increases by 1, f increases by ~6"

### Step 2: Partial Derivatives
With multiple inputs, take the derivative with respect to each one separately:
- f(x, y) = x²y → ∂f/∂x = 2xy, ∂f/∂y = x²

### Step 3: The Chain Rule
When functions are composed: d/dx f(g(x)) = f'(g(x)) · g'(x)
This is EXACTLY how backpropagation works!

### Step 4: Why This Matters
- A neural network is a composition of many functions
- Chain rule lets us compute ∂Loss/∂weight for EVERY weight
- Then we nudge each weight to reduce loss""",
            "visual": """  Forward:   x ──→ [×w] ──→ z ──→ [ReLU] ──→ a ──→ [×w2] ──→ y ──→ [Loss] ──→ L
  Backward:  ∂L/∂w = ∂L/∂y · ∂y/∂a · ∂a/∂z · ∂z/∂w
              loss_grad  ×  w2  × ReLU'(z) ×  x""",
            "questions": [
                {"id": "f-gc-1", "type": "multiple-choice", "question": "If f(x) = 3x² + 2x, what is f'(x)?", "options": ["6x + 2", "3x + 2", "6x² + 2", "x² + 2x"], "correct": 0, "explanation": "Power rule: d/dx(3x²) = 6x, d/dx(2x) = 2. So f'(x) = 6x + 2.", "xp": 10},
                {"id": "f-gc-2", "type": "multiple-choice", "question": "In the chain rule, if y = f(g(x)), what is dy/dx?", "options": ["f'(x) + g'(x)", "f'(g(x)) · g'(x)", "f(g'(x))", "f'(x) · g'(x)"], "correct": 1, "explanation": "Chain rule: dy/dx = f'(g(x)) · g'(x). Evaluate outer derivative at inner function, multiply by inner derivative.", "xp": 10},
                {"id": "f-gc-3", "type": "multiple-choice", "question": "Why does backpropagation go backward?", "options": ["It's faster than going forward", "It uses the chain rule to efficiently compute all gradients in one pass", "Gradients are larger at the output", "It's required by GPU architecture"], "correct": 1, "explanation": "Going backward, each node multiplies its local gradient by the incoming gradient, computing all weight gradients in a single pass.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement numerical gradient checking using finite differences: (f(x+h) - f(x-h)) / (2h).",
                "starter_code": "def numerical_gradient(f, x, h=1e-5):\n    pass\n\ndef f(x): return x ** 2\nprint(numerical_gradient(f, 3.0))  # ~6.0",
                "solution": "def numerical_gradient(f, x, h=1e-5):\n    return (f(x + h) - f(x - h)) / (2 * h)\n\ndef f(x): return x ** 2\nprint(numerical_gradient(f, 3.0))  # 6.000000000012662",
                "tests": "assert abs(numerical_gradient(lambda x: x**2, 3.0) - 6.0) < 1e-5"
            },
            "source": "foundations/calculus"
        },
        {
            "id": "probability-stats",
            "title": "Probability & Statistics for ML",
            "explainer": """## Probability: The Language of Uncertainty

### Step 1: Probability Basics
P(event) is between 0 and 1. P(all outcomes) = 1.0.

### Step 2: Conditional Probability & Bayes
P(A|B) = P(B|A) · P(A) / P(B) — how spam filters work.

### Step 3: Key Distributions
- **Normal/Gaussian**: Bell curve — weight initialization
- **Softmax**: Turns any numbers into probabilities summing to 1

### Step 4: Key Concepts for ML
- **Cross-entropy**: Measures difference between distributions (loss function!)
- **KL divergence**: Distance between probability distributions (VAEs, RLHF)""",
            "visual": """  Normal Distribution          Softmax Transformation
       ▄████▄                  Raw logits:  [2.0, 1.0, 0.1]
     ▄████████▄                exp:         [7.39, 2.72, 1.11]
   ▄████████████▄              sum:          11.22
  ▄██████████████▄             softmax:      [0.66, 0.24, 0.10]
 ████████████████████          probabilities sum to 1.0 ✓
─┼──┼──┼──┼──┼──┼──┼─
-3σ -2σ -σ  μ  σ  2σ 3σ""",
            "questions": [
                {"id": "f-ps-1", "type": "multiple-choice", "question": "What does the softmax function do?", "options": ["Clips values between 0 and 1", "Converts logits into a probability distribution that sums to 1", "Returns the maximum value", "Normalizes by subtracting the mean"], "correct": 1, "explanation": "Softmax(x_i) = exp(x_i) / Σexp(x_j). Converts arbitrary real numbers into valid probabilities.", "xp": 10},
                {"id": "f-ps-2", "type": "multiple-choice", "question": "Cross-entropy loss is minimized when:", "options": ["All predictions are 0.5", "The predicted distribution matches the true distribution exactly", "The model predicts uniform probabilities", "The logits are all equal"], "correct": 1, "explanation": "Cross-entropy H(p,q) = -Σp(x)log(q(x)) is minimized when q = p.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement numerically stable softmax from scratch.",
                "starter_code": "import math\ndef softmax(logits):\n    pass\nprint(softmax([2.0, 1.0, 0.1]))  # ~[0.659, 0.242, 0.099]",
                "solution": "import math\ndef softmax(logits):\n    max_val = max(logits)\n    exps = [math.exp(x - max_val) for x in logits]\n    s = sum(exps)\n    return [e / s for e in exps]\nprint(softmax([2.0, 1.0, 0.1]))",
                "tests": "assert abs(sum(softmax([2.0, 1.0, 0.1])) - 1.0) < 1e-6"
            },
            "source": "foundations/probability"
        },
        {
            "id": "python-numpy-tensors",
            "title": "Python for ML: NumPy & Tensors",
            "explainer": """## NumPy: The Foundation of ML in Python

### Step 1: Arrays vs Lists
NumPy arrays use C under the hood — 100x faster than Python lists.

### Step 2: Key Operations
- `np.array()`, element-wise ops, `@` for matmul, `.reshape()`, broadcasting

### Step 3: From NumPy to Tensors
PyTorch tensors = NumPy arrays + GPU support + autograd.
`.requires_grad_(True)` enables automatic differentiation.

### Step 4: Broadcasting Rules
Dimensions compared right-to-left. Match if equal or one is 1.""",
            "visual": """  Broadcasting: (3,4) + (4,) → (3,4) + (1,4)
  ┌─────────────┐    ┌─────────────┐    ┌──────────────────┐
  │ 1  2  3  4  │ +  │ 10 20 30 40 │ =  │ 11  22  33  44   │
  │ 5  6  7  8  │    │ (broadcast) │    │ 15  26  37  48   │
  │ 9 10 11 12  │    │ (broadcast) │    │ 19  30  41  52   │
  └─────────────┘    └─────────────┘    └──────────────────┘""",
            "questions": [
                {"id": "f-np-1", "type": "multiple-choice", "question": "Why are NumPy operations faster than Python for-loops?", "options": ["NumPy uses more RAM", "NumPy operations are vectorized and run in compiled C code", "Python loops run in JavaScript", "NumPy automatically uses GPUs"], "correct": 1, "explanation": "NumPy operations are implemented in C and operate on contiguous memory, making them 10-100x faster.", "xp": 10},
                {"id": "f-np-2", "type": "multiple-choice", "question": "What does requires_grad=True do in PyTorch?", "options": ["Makes tensor immutable", "Enables GPU acceleration", "Tells PyTorch to track operations for automatic differentiation", "Converts to float32"], "correct": 2, "explanation": "It tells PyTorch to record operations in a computation graph for automatic gradient computation via .backward().", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement cosine similarity between two vectors using NumPy.",
                "starter_code": "import numpy as np\ndef cosine_similarity(a, b):\n    pass\nprint(cosine_similarity(np.array([1,2,3]), np.array([4,5,6])))  # ~0.9746",
                "solution": "import numpy as np\ndef cosine_similarity(a, b):\n    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))\nprint(cosine_similarity(np.array([1,2,3]), np.array([4,5,6])))",
                "tests": "assert abs(cosine_similarity(np.array([1,0]), np.array([0,1]))) < 1e-6"
            },
            "source": "foundations/numpy"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 2: NEURAL NETWORK FUNDAMENTALS
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["neural-nets"] = {
    "name": "Neural Network Fundamentals",
    "description": "Perceptrons to deep networks, activation functions, backprop, and optimizers",
    "order": 2,
    "topics": [
        {
            "id": "perceptron-to-mlp",
            "title": "Perceptron → MLP → Deep Networks",
            "explainer": """## From Single Neuron to Deep Networks

### Step 1: The Perceptron
output = activation(w₁x₁ + w₂x₂ + ... + b). Can only learn linearly separable patterns. Cannot learn XOR!

### Step 2: Multi-Layer Perceptron (MLP)
Stack neurons in layers. Universal Approximation Theorem: 1 hidden layer can approximate ANY function.

### Step 3: Going Deep
More layers = more abstract features. But deeper networks are harder to train (vanishing gradients). Solutions: ResNet, BatchNorm, better activations.

### Step 4: The Micrograd Way
Karpathy's micrograd: Value class wraps numbers, tracks operations, enables automatic backprop.""",
            "visual": """  Single Neuron:  x₁──w₁──┐                 MLP (2 hidden layers):
                         ▼                 Input  Hidden1  Hidden2  Output
                  x₂──w₂──▶ Σ+b → σ → y   │ ○ │──│ ● │──│ ● │──│ ○ │
                         ▲                 │ ○ │──│ ● │──│ ● │──│ ○ │
                  x₃──w₃──┘                │ ○ │──│ ● │──│ ● │
                                           │ ○ │──│ ● │""",
            "questions": [
                {"id": "nn-pm-1", "type": "multiple-choice", "question": "Why can't a single perceptron learn XOR?", "options": ["Not enough weights", "XOR is not linearly separable", "Wrong activation function", "Needs a bias term"], "correct": 1, "explanation": "XOR outputs 1 when inputs differ. No single line can separate [0,1],[1,0] from [0,0],[1,1]. Requires a hidden layer.", "xp": 10},
                {"id": "nn-pm-2", "type": "multiple-choice", "question": "What does the Universal Approximation Theorem state?", "options": ["Deep networks are always better", "A network with one hidden layer can approximate any continuous function", "Neural networks can learn any discrete function exactly", "More parameters always means better performance"], "correct": 1, "explanation": "The UAT states a feedforward network with one hidden layer and enough neurons can approximate any continuous function. It doesn't say how many neurons or how easy to train.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement a Value class (micrograd) supporting addition, multiplication, and backward pass.",
                "starter_code": "class Value:\n    def __init__(self, data, _children=(), _op=''):\n        self.data = data\n        self.grad = 0.0\n        self._backward = lambda: None\n        self._prev = set(_children)\n    def __add__(self, other): pass\n    def __mul__(self, other): pass\n    def backward(self): pass\n\na = Value(2.0); b = Value(3.0)\nc = a * b + b  # should be 9\nc.backward()\nprint(f'c={c.data}, da={a.grad}, db={b.grad}')",
                "solution": "class Value:\n    def __init__(self, data, _children=(), _op=''):\n        self.data = data; self.grad = 0.0\n        self._backward = lambda: None; self._prev = set(_children)\n    def __add__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        out = Value(self.data + other.data, (self, other), '+')\n        def _bw(): self.grad += out.grad; other.grad += out.grad\n        out._backward = _bw; return out\n    def __mul__(self, other):\n        other = other if isinstance(other, Value) else Value(other)\n        out = Value(self.data * other.data, (self, other), '*')\n        def _bw(): self.grad += other.data * out.grad; other.grad += self.data * out.grad\n        out._backward = _bw; return out\n    def backward(self):\n        topo, visited = [], set()\n        def build(v):\n            if v not in visited: visited.add(v); [build(c) for c in v._prev]; topo.append(v)\n        build(self); self.grad = 1.0\n        for v in reversed(topo): v._backward()\na = Value(2.0); b = Value(3.0); c = a * b + b; c.backward()\nprint(f'c={c.data}, da={a.grad}, db={b.grad}')",
                "tests": "a=Value(2.0);b=Value(3.0);c=a*b+b;c.backward();assert c.data==9.0 and a.grad==3.0"
            },
            "paper_ref": "https://github.com/karpathy/micrograd",
            "source": "karpathy/micrograd"
        },
        {
            "id": "activation-functions",
            "title": "Activation Functions Deep Dive",
            "explainer": """## Activation Functions: Adding Non-Linearity

### Why Non-Linearity?
Without activations, stacking linear layers is still linear: f(x) = W₂(W₁x) = Wx.

### Classic: Sigmoid σ(x)=1/(1+e⁻ˣ) output (0,1). Tanh output (-1,1). Both suffer vanishing gradients.

### Modern: ReLU max(0,x) — simple, fast. GELU x·Φ(x) — smooth, used in GPT/BERT. SiLU x·σ(x) — self-gated.""",
            "visual": """  Sigmoid            ReLU              GELU
  1 ┤    ╭──────     │      ╱          │      ╱
    │   ╱             │    ╱            │    ╱
  .5┤──╱              │  ╱             │  ╱
    │╱                │╱               │╱
  0 ┤─────            ┼────────        ┤───╮──""",
            "questions": [
                {"id": "nn-af-1", "type": "multiple-choice", "question": "What is the 'dying ReLU' problem?", "options": ["ReLU uses too much memory", "Neurons with negative inputs always output 0 and stop learning", "ReLU is too slow", "ReLU causes exploding gradients"], "correct": 1, "explanation": "When a ReLU neuron's input is always negative, it outputs 0 and receives zero gradient — permanently dead.", "xp": 10},
                {"id": "nn-af-2", "type": "multiple-choice", "question": "Why is GELU preferred in modern transformers?", "options": ["Faster to compute", "Smooth with probabilistic interpretation, better gradient flow", "Always positive", "Less memory"], "correct": 1, "explanation": "GELU is smooth everywhere, provides soft gating, and empirically improves transformer training. Default in GPT-2, BERT, LLaMA.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement ReLU, Sigmoid, and GELU activation functions from scratch.",
                "starter_code": "import math\ndef relu(x): pass\ndef sigmoid(x): pass\ndef gelu(x): pass\nfor fn in [relu, sigmoid, gelu]:\n    print(f'{fn.__name__}: {fn(-1):.4f}, {fn(0):.4f}, {fn(1):.4f}')",
                "solution": "import math\ndef relu(x): return max(0.0, x)\ndef sigmoid(x): return 1/(1+math.exp(-x))\ndef gelu(x): return 0.5*x*(1+math.tanh(math.sqrt(2/math.pi)*(x+0.044715*x**3)))\nfor fn in [relu, sigmoid, gelu]:\n    print(f'{fn.__name__}: {fn(-1):.4f}, {fn(0):.4f}, {fn(1):.4f}')",
                "tests": "assert relu(-5)==0 and relu(3)==3 and abs(sigmoid(0)-0.5)<1e-6"
            },
            "source": "neural-nets"
        },
        {
            "id": "loss-functions",
            "title": "Loss Functions: MSE, Cross-Entropy & Beyond",
            "explainer": """## Loss Functions: Measuring How Wrong You Are

### MSE: (1/n) Σ(pred - actual)² — for regression, penalizes large errors quadratically.
### Cross-Entropy: -Σ y·log(ŷ) — for classification, huge penalty when confidently wrong.
### Contrastive: InfoNCE loss — pulls similar pairs closer, pushes different apart (CLIP, SimCLR).""",
            "visual": """  MSE (regression):          Cross-Entropy (classification):
  L │                         L │
    │╲                ╱         │╲
    │  ╲            ╱           │  ╲
    │    ╲________╱             │    ╲_________
    └───────────────           └───────────────
    Symmetric, smooth           -log(p): huge penalty when confident & wrong""",
            "questions": [
                {"id": "nn-lf-1", "type": "multiple-choice", "question": "Why is cross-entropy preferred over MSE for classification?", "options": ["Faster to compute", "Provides stronger gradients when predictions are confidently wrong", "MSE doesn't work with networks", "Always gives smaller values"], "correct": 1, "explanation": "When confidently wrong, CE gives gradient proportional to 1/p (huge), while MSE gives ~2(p-t) (moderate). CE corrects mistakes faster.", "xp": 15},
                {"id": "nn-lf-2", "type": "multiple-choice", "question": "What loss function does CLIP use?", "options": ["MSE", "Cross-entropy on image-text similarity matrix (contrastive)", "Binary cross-entropy", "Hinge loss"], "correct": 1, "explanation": "CLIP uses InfoNCE contrastive loss on the similarity matrix between image and text embeddings, matching pairs on the diagonal.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement cross-entropy loss for multi-class classification.",
                "starter_code": "import math\ndef cross_entropy(preds, targets):\n    pass\nprint(cross_entropy([0.7, 0.2, 0.1], [1, 0, 0]))  # ~0.357",
                "solution": "import math\ndef cross_entropy(preds, targets):\n    return -sum(t * math.log(p + 1e-12) for p, t in zip(preds, targets))\nprint(cross_entropy([0.7, 0.2, 0.1], [1, 0, 0]))",
                "tests": "assert abs(cross_entropy([1.0, 0.0], [1, 0])) < 1e-6"
            },
            "source": "neural-nets"
        },
        {
            "id": "backpropagation",
            "title": "Backpropagation: Implement from Scratch",
            "explainer": """## Backpropagation: The Engine of Deep Learning

### Forward Pass: z₁=W₁x+b₁ → a₁=ReLU(z₁) → z₂=W₂a₁+b₂ → ŷ=softmax(z₂) → L=CE(ŷ,y)

### Backward Pass: ∂L/∂z₂ = ŷ-y → ∂L/∂W₂ = a₁ᵀ·∂L/∂z₂ → ∂L/∂a₁ = ∂L/∂z₂·W₂ᵀ → ...

### Weight Update: W = W - lr · ∂L/∂W""",
            "visual": """  FORWARD:  x ──▶ [W₁x+b₁] ──▶ [ReLU] ──▶ [W₂a₁+b₂] ──▶ [softmax] ──▶ [CE Loss]
  BACKWARD: ∂L/∂W₁ ◀── ∂L/∂z₁ ◀── ∂L/∂a₁ ◀── ∂L/∂z₂ ◀── (ŷ-y) ◀── 1.0""",
            "questions": [
                {"id": "nn-bp-1", "type": "multiple-choice", "question": "What is the gradient of ReLU(x) w.r.t. x?", "options": ["x", "1 if x>0, else 0", "Always 1", "e^x"], "correct": 1, "explanation": "ReLU(x) = max(0,x). Derivative is 1 for x>0 and 0 for x<0.", "xp": 10},
                {"id": "nn-bp-2", "type": "multiple-choice", "question": "Why is topological sort needed in backpropagation?", "options": ["Makes computation faster", "Ensures each node's gradient is fully accumulated before propagating backward", "Sorts weights by magnitude", "Prevents cycles"], "correct": 1, "explanation": "A node's gradient may receive contributions from multiple paths. Topological sort guarantees all are accumulated before propagating further.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement a 2-layer neural network with backpropagation using only NumPy. Train on XOR.",
                "starter_code": "import numpy as np\nnp.random.seed(42)\nX = np.array([[0,0],[0,1],[1,0],[1,1]])\ny = np.array([[0],[1],[1],[0]])\n# Initialize weights and train\n# ...",
                "solution": "import numpy as np\nnp.random.seed(42)\nX = np.array([[0,0],[0,1],[1,0],[1,1]])\ny = np.array([[0],[1],[1],[0]])\nW1 = np.random.randn(2,4)*0.5; b1 = np.zeros((1,4))\nW2 = np.random.randn(4,1)*0.5; b2 = np.zeros((1,1))\nsig = lambda x: 1/(1+np.exp(-x))\nfor _ in range(10000):\n    a1 = sig(X@W1+b1); a2 = sig(a1@W2+b2)\n    dz2 = 2*(a2-y)*a2*(1-a2)/4\n    W2 -= 0.5*(a1.T@dz2); b2 -= 0.5*dz2.sum(0,keepdims=True)\n    dz1 = (dz2@W2.T)*a1*(1-a1)\n    W1 -= 0.5*(X.T@dz1); b1 -= 0.5*dz1.sum(0,keepdims=True)\nprint(a2.round(2).flatten())",
                "tests": "# Predictions should approximate [0, 1, 1, 0]"
            },
            "paper_ref": "https://github.com/karpathy/micrograd",
            "source": "karpathy/micrograd"
        },
        {
            "id": "optimizers",
            "title": "Optimizers: SGD → Adam & Beyond",
            "explainer": """## Optimizers: How to Update Weights

### SGD: w = w - lr × gradient. Simple but slow.
### Momentum: v = β·v + g; w -= lr·v. Like a ball rolling downhill.
### Adam: Combines momentum + per-parameter learning rates. Default choice!
  m = β₁·m + (1-β₁)·g (mean), v = β₂·v + (1-β₂)·g² (variance)
### Learning Rate Schedules: Warmup → cosine decay (GPT, LLaMA recipe).""",
            "visual": """  SGD (oscillates)    Momentum (smooth)    Adam (direct)
  ╲╱╲╱╲●              ╲──╲──●               ╲──●
  
  LR Schedule (GPT-style):
  lr │  ╱╲╲╲╲╲╲______
     └──────────────── step
     warmup  cosine decay""",
            "questions": [
                {"id": "nn-opt-1", "type": "multiple-choice", "question": "Why is Adam the default optimizer?", "options": ["Always finds global minimum", "Adapts per-parameter learning rates + uses momentum, works well without tuning", "Uses less memory than SGD", "Invented most recently"], "correct": 1, "explanation": "Adam combines momentum and per-parameter adaptive LR. Robust with defaults (β₁=0.9, β₂=0.999, ε=1e-8).", "xp": 15},
                {"id": "nn-opt-2", "type": "multiple-choice", "question": "What is learning rate warmup?", "options": ["Using a high LR at the start", "Gradually increasing LR from 0 at the beginning of training to prevent instability", "Training only the last layer first", "Using a constant LR"], "correct": 1, "explanation": "Starting with a high LR can cause instability because initial gradients are noisy. Warmup gradually increases LR, letting the model find a stable region first.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement one step of the Adam optimizer from scratch.",
                "starter_code": "def adam_step(params, grads, m, v, t, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):\n    pass",
                "solution": "def adam_step(params, grads, m, v, t, lr=0.001, b1=0.9, b2=0.999, eps=1e-8):\n    new_p, new_m, new_v = [], [], []\n    for p, g, mi, vi in zip(params, grads, m, v):\n        mi = b1*mi + (1-b1)*g; vi = b2*vi + (1-b2)*g**2\n        mh = mi/(1-b1**t); vh = vi/(1-b2**t)\n        new_p.append(p - lr*mh/(vh**0.5+eps)); new_m.append(mi); new_v.append(vi)\n    return new_p, new_m, new_v",
                "tests": "p,m,v = adam_step([1.0],[0.1],[0.0],[0.0],1); assert p[0] < 1.0"
            },
            "paper_ref": "https://arxiv.org/abs/1412.6980",
            "source": "neural-nets"
        },
        {
            "id": "regularization",
            "title": "Regularization: Dropout, BatchNorm & Weight Decay",
            "explainer": """## Regularization: Preventing Overfitting

### Dropout: Randomly zero neurons during training (p=0.1-0.5). Forces redundant representations.
### BatchNorm: Normalize activations within mini-batch. Speeds training. BN(x) = γ·(x-μ)/√(σ²+ε)+β
### Weight Decay: Add λ·||w||² to loss. Keeps weights small = simpler model.
### LayerNorm: Like BatchNorm but across features. Used in Transformers.""",
            "visual": """  Without Dropout:       With Dropout (p=0.3):
  ● ──▶ ● ──▶ ●         ● ──▶ ● ──▶ ●
  ● ──▶ ● ──▶ ●         ● ──▶ ✗       ●
  ● ──▶ ● ──▶ ●         ● ──▶ ● ──▶ ●
  ● ──▶ ●               ✗      ●
  
  BatchNorm (↕ columns)    LayerNorm (← rows)
  (CNNs)                   (Transformers)""",
            "questions": [
                {"id": "nn-reg-1", "type": "multiple-choice", "question": "Why do Transformers use LayerNorm instead of BatchNorm?", "options": ["Faster to compute", "LayerNorm normalizes across features independently of batch size, works for variable-length sequences", "BatchNorm doesn't work with attention", "Fewer parameters"], "correct": 1, "explanation": "LayerNorm normalizes each example independently. BatchNorm depends on batch statistics, problematic for variable-length sequences and small batches.", "xp": 15},
                {"id": "nn-reg-2", "type": "multiple-choice", "question": "Why must dropout be turned off during inference?", "options": ["It would make inference slower", "Dropping neurons randomly would make predictions inconsistent and suboptimal", "It causes memory issues", "It only works with gradients"], "correct": 1, "explanation": "During inference, we want deterministic, optimal predictions using all neurons. Dropout randomly zeroing neurons would degrade quality and make outputs non-deterministic.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement dropout from scratch with inverted dropout scaling.",
                "starter_code": "import numpy as np\ndef dropout(x, p=0.5, training=True):\n    pass\nnp.random.seed(42)\nprint(dropout(np.ones((2,4)), p=0.5))",
                "solution": "import numpy as np\ndef dropout(x, p=0.5, training=True):\n    if not training: return x\n    mask = (np.random.rand(*x.shape) > p).astype(float)\n    return x * mask / (1 - p)\nnp.random.seed(42)\nprint(dropout(np.ones((2,4)), p=0.5))",
                "tests": "np.random.seed(0); x=np.ones(1000); assert 900 < dropout(x,0.5).sum() < 1100"
            },
            "source": "neural-nets"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 3: ARCHITECTURES
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["architectures"] = {
    "name": "Architectures",
    "description": "CNNs, RNNs, Transformers, and self-attention from scratch",
    "order": 3,
    "topics": [
        {
            "id": "cnns",
            "title": "Convolutional Neural Networks",
            "explainer": """## CNNs: Learning Spatial Patterns

### Convolution: Slide filter across image, dot product at each position → feature map.
### Key: Filters (3×3), Stride (step size), Padding, Pooling (downsample).
### Hierarchy: edges → shapes → objects (emerges from training!).
### Famous: LeNet(1998), AlexNet(2012), VGG(2014), ResNet(2015, skip connections!).""",
            "visual": """  Input(5×5) * Filter(3×3) = Output(3×3)
  ┌─┬─┬─┬─┬─┐   ┌─┬─┬─┐   ┌──┬──┬──┐
  │1│0│1│0│1│   │1│0│1│   │ 4│ 3│ 4│
  │0│1│0│1│0│ * │0│1│0│ = │ 2│ 4│ 3│
  │1│0│1│0│1│   │1│0│1│   │ 4│ 3│ 4│
  └─┴─┴─┴─┴─┘   └─┴─┴─┘   └──┴──┴──┘
  
  ResNet: x ──▶ [Conv→BN→ReLU] ──▶ (+) ──▶ out
          └──── identity ──────────▶""",
            "questions": [
                {"id": "arch-cnn-1", "type": "multiple-choice", "question": "What do ResNet skip connections solve?", "options": ["Overfitting", "Vanishing gradients in very deep networks", "Slow inference", "Large model size"], "correct": 1, "explanation": "Skip connections allow gradients to flow directly through the identity path, enabling training of 100+ layer networks.", "xp": 15},
                {"id": "arch-cnn-2", "type": "multiple-choice", "question": "If input is 32×32, filter 5×5, stride 1, no padding: output size?", "options": ["32×32", "28×28", "30×30", "27×27"], "correct": 1, "explanation": "Output = (input - filter)/stride + 1 = (32-5)/1 + 1 = 28.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement 2D convolution from scratch using NumPy.",
                "starter_code": "import numpy as np\ndef conv2d(image, kernel, stride=1):\n    pass\nkernel = np.array([[-1,-1,-1],[-1,8,-1],[-1,-1,-1]])\nimage = np.array([[0,0,0,0,0],[0,1,1,1,0],[0,1,1,1,0],[0,1,1,1,0],[0,0,0,0,0]])\nprint(conv2d(image, kernel))",
                "solution": "import numpy as np\ndef conv2d(image, kernel, stride=1):\n    h, w = image.shape; kh, kw = kernel.shape\n    oh, ow = (h-kh)//stride+1, (w-kw)//stride+1\n    out = np.zeros((oh, ow))\n    for i in range(oh):\n        for j in range(ow):\n            out[i,j] = np.sum(image[i*stride:i*stride+kh, j*stride:j*stride+kw] * kernel)\n    return out\nprint(conv2d(np.array([[0,0,0,0,0],[0,1,1,1,0],[0,1,1,1,0],[0,1,1,1,0],[0,0,0,0,0]]), np.array([[-1,-1,-1],[-1,8,-1],[-1,-1,-1]])))",
                "tests": "assert conv2d(np.ones((5,5)), np.ones((3,3))).shape == (3,3)"
            },
            "paper_ref": "https://arxiv.org/abs/1512.03385",
            "source": "architectures"
        },
        {
            "id": "rnns-lstms",
            "title": "RNNs & LSTMs: Sequence Modeling",
            "explainer": """## RNNs: Processing Sequences

### RNN Cell: h_t = tanh(W_hh·h_{t-1} + W_xh·x_t + b). Hidden state = memory.
### Problem: Vanishing gradients after many steps.
### LSTM: Adds cell state + 3 gates (forget, input, output). Solves long-range dependencies.
### Why Transformers Won: RNNs are sequential (can't parallelize). Attention replaces recurrence.""",
            "visual": """  RNN Unrolled: x₁→[RNN]→h₁→[RNN]→h₂→[RNN]→h₃
  
  LSTM: C_{t-1}──[×forget]──[+input]──C_t
        h_{t-1}──[forget_gate σ]
                 [input_gate  σ]
                 [output_gate σ]──h_t = o_t ⊙ tanh(C_t)""",
            "questions": [
                {"id": "arch-rnn-1", "type": "multiple-choice", "question": "What is the forget gate in LSTM?", "options": ["Speeds up training", "Decides what information to discard from cell state", "Computes the output", "Prevents gradient explosion"], "correct": 1, "explanation": "Forget gate f_t = σ(W_f·[h_{t-1}, x_t]) outputs 0-1 per element. Near 0 = forget, near 1 = keep.", "xp": 15},
                {"id": "arch-rnn-2", "type": "multiple-choice", "question": "Why did Transformers replace RNNs/LSTMs?", "options": ["Simpler to implement", "Transformers can process all positions in parallel and handle long-range dependencies better via attention", "RNNs use more memory", "LSTMs can't learn from data"], "correct": 1, "explanation": "RNNs must process tokens sequentially — slow and gradients still degrade over very long sequences. Transformers compute attention over all positions simultaneously.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement an RNN cell from scratch.",
                "starter_code": "import numpy as np\ndef rnn_cell(x_t, h_prev, W_xh, W_hh, b_h):\n    pass",
                "solution": "import numpy as np\ndef rnn_cell(x_t, h_prev, W_xh, W_hh, b_h):\n    return np.tanh(x_t @ W_xh + h_prev @ W_hh + b_h)",
                "tests": "h = rnn_cell(np.zeros(3), np.zeros(4), np.zeros((3,4)), np.zeros((4,4)), np.zeros(4)); assert np.allclose(h, 0)"
            },
            "paper_ref": "https://www.bioinf.jku.at/publications/older/2604.pdf",
            "source": "karpathy/makemore"
        },
        {
            "id": "transformers",
            "title": "Transformers: Attention Is All You Need",
            "explainer": """## The Transformer: Foundation of Modern AI

### Self-Attention: Q (what am I looking for?), K (what do I contain?), V (what info do I carry?)
  Attention(Q,K,V) = softmax(QKᵀ/√d_k)V

### Scale by √d_k: Without it, dot products grow → softmax saturates → zero gradients.

### Multi-Head: Run attention multiple times with different projections. Each head learns different relationships.

### Transformer Block: MultiHead Attention + Residual + LayerNorm → FFN + Residual + LayerNorm. Stack N times.""",
            "visual": """  "The cat sat" → Q,K,V projections → Attention weights → Output
  
  Attention = softmax(Q·Kᵀ/√d) · V
  
  Transformer Block:
  Input → [Multi-Head Attn] + residual → LayerNorm
        → [FFN: Linear→GELU→Linear] + residual → LayerNorm → Output
  
  GPT-2 Sizes:
  Small:124M, 12 layers, d=768,  12 heads
  XL:  1.5B,  48 layers, d=1600, 25 heads""",
            "questions": [
                {"id": "arch-tf-1", "type": "multiple-choice", "question": "Why divide attention scores by √d_k?", "options": ["Faster computation", "Prevents softmax saturation by keeping variance ~1", "Normalizes output values", "Reduces memory"], "correct": 1, "explanation": "Large d_k → large dot products → softmax near one-hot → tiny gradients. Dividing by √d_k keeps variance ~1.", "xp": 15},
                {"id": "arch-tf-2", "type": "multiple-choice", "question": "Computational complexity of self-attention w.r.t. sequence length n?", "options": ["O(n)", "O(n log n)", "O(n²)", "O(n³)"], "correct": 2, "explanation": "Q·Kᵀ is (n×d)·(d×n) = n×n. O(n²) is why long sequences are expensive and efficient attention variants matter.", "xp": 15},
                {"id": "arch-tf-3", "type": "multiple-choice", "question": "What is multi-head attention for?", "options": ["Makes model larger", "Allows attending to different representation subspaces simultaneously", "Speeds up training", "Reduces parameters"], "correct": 1, "explanation": "Different heads learn different relationship types (syntactic, semantic, positional). Concatenated for richer representation.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement scaled dot-product attention from scratch.",
                "starter_code": "import numpy as np\ndef attention(Q, K, V, mask=None):\n    pass\nnp.random.seed(42)\nQ = np.random.randn(4, 8)\nK = np.random.randn(4, 8)\nV = np.random.randn(4, 8)\nout, w = attention(Q, K, V)\nprint('Weights sum:', w.sum(axis=1))",
                "solution": "import numpy as np\ndef softmax(x, axis=-1):\n    e = np.exp(x - np.max(x, axis=axis, keepdims=True))\n    return e / e.sum(axis=axis, keepdims=True)\ndef attention(Q, K, V, mask=None):\n    d_k = Q.shape[-1]\n    scores = Q @ K.T / np.sqrt(d_k)\n    if mask is not None: scores = np.where(mask==0, -1e9, scores)\n    w = softmax(scores)\n    return w @ V, w",
                "tests": "_, w = attention(np.ones((2,3)), np.ones((2,3)), np.ones((2,3))); assert np.allclose(w.sum(axis=1), 1.0)"
            },
            "paper_ref": "https://arxiv.org/abs/1706.03762",
            "source": "Vaswani et al. 2017"
        },
        {
            "id": "positional-encoding",
            "title": "Positional Encoding: Sinusoidal, RoPE & ALiBi",
            "explainer": """## Positional Encoding: Giving Order to Transformers

### Why: 'Dog bites man' ≠ 'Man bites dog'. Transformers need explicit position info.
### Sinusoidal: PE(pos,2i) = sin(pos/10000^(2i/d)). Different frequencies per dimension.
### Learned: Lookup table of position embeddings (GPT-2). Can't extrapolate beyond training length.
### RoPE: Rotates Q,K vectors by position angle. Relative position in dot product. Used in LLaMA.
### ALiBi: Linear attention bias by distance. No parameters. Good length generalization.""",
            "visual": """  Sinusoidal PE:            RoPE (rotate Q,K):
  pos 0: [sin(0), cos(0)]   q' = q·cos(mθ) - q·sin(mθ)
  pos 1: [sin(1/f), cos(1/f)]  Dot product encodes RELATIVE position
  
  ALiBi: attention + bias    ┌──────────────┐
  ┌──────────────┐           │ 0  -1  -2  -3│
  │ 0  -1  -2  -3│ × slope  │ Closer = higher │
  │ -1  0  -1  -2│          └──────────────┘
  └──────────────┘""",
            "questions": [
                {"id": "arch-pe-1", "type": "multiple-choice", "question": "Why is RoPE preferred in modern LLMs?", "options": ["Fewer parameters", "Encodes relative positions and generalizes better to longer sequences", "Faster to compute", "Works without attention"], "correct": 1, "explanation": "RoPE encodes relative position through rotation, enabling better length generalization than learned absolute embeddings.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement sinusoidal positional encoding.",
                "starter_code": "import numpy as np\ndef positional_encoding(max_len, d_model):\n    pass\npe = positional_encoding(50, 16)\nprint(pe.shape)  # (50, 16)",
                "solution": "import numpy as np\ndef positional_encoding(max_len, d_model):\n    pe = np.zeros((max_len, d_model))\n    pos = np.arange(max_len)[:, None]\n    div = np.exp(np.arange(0, d_model, 2) * -(np.log(10000.0) / d_model))\n    pe[:, 0::2] = np.sin(pos * div)\n    pe[:, 1::2] = np.cos(pos * div)\n    return pe\nprint(positional_encoding(50, 16).shape)",
                "tests": "pe = positional_encoding(10, 8); assert pe.shape == (10,8)"
            },
            "paper_ref": "https://arxiv.org/abs/2104.09864",
            "source": "architectures"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 4: LANGUAGE MODELS
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["language-models"] = {
    "name": "Language Models",
    "description": "Tokenization, GPT, BERT, training LLMs, scaling laws, and inference optimization",
    "order": 4,
    "topics": [
        {
            "id": "tokenization-bpe",
            "title": "Tokenization & BPE",
            "explainer": """## Tokenization: Text → Numbers

### Character-level: tiny vocab (~256) but long sequences.
### Word-level: reasonable length but huge vocab, can't handle new words.
### BPE: Start with bytes, iteratively merge most common pairs. Best balance. Used by GPT-2/3/4, LLaMA.
### Karpathy's minbpe: BasicTokenizer (raw BPE), RegexTokenizer (category splitting), GPT4Tokenizer (tiktoken clone).""",
            "visual": """  BPE Training: "low lower lowest"
  Step 0: l o w   l o w e r   l o w e s t
  Step 1: merge (l,o)→'lo':  lo w  lo w e r  lo w e s t
  Step 2: merge (lo,w)→'low': low  low e r  low e s t
  
  "Hello world!" → [9906, 1917, 0] (3 tokens, not 12 chars)""",
            "questions": [
                {"id": "lm-tok-1", "type": "multiple-choice", "question": "Why does GPT use BPE instead of word tokenization?", "options": ["Faster to compute", "Handles rare/new words by breaking into known subwords, no OOV issues", "Produces shorter sequences", "Word tokenization doesn't work"], "correct": 1, "explanation": "BPE can tokenize any text by falling back to individual bytes. Common words get single tokens, rare words split into subwords.", "xp": 15},
                {"id": "lm-tok-2", "type": "multiple-choice", "question": "In BPE training, what happens at each step?", "options": ["Neural network weights optimize", "Most frequent adjacent pair merges into new token", "Words split by linguistic rules", "Dictionary loaded from file"], "correct": 1, "explanation": "BPE iteratively finds and merges the most frequent adjacent pair, building up common subwords from individual bytes.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement a minimal BPE tokenizer: train, encode, decode.",
                "starter_code": "def get_stats(ids):\n    pass\ndef merge(ids, pair, new_id):\n    pass\ndef train_bpe(text, num_merges):\n    tokens = list(text.encode('utf-8'))\n    merges = {}\n    # ...\n    return tokens, merges\ntokens, merges = train_bpe('aaabdaaabac', 3)\nprint(tokens, merges)",
                "solution": "def get_stats(ids):\n    counts = {}\n    for p in zip(ids, ids[1:]): counts[p] = counts.get(p, 0) + 1\n    return counts\ndef merge(ids, pair, new_id):\n    out, i = [], 0\n    while i < len(ids):\n        if i < len(ids)-1 and ids[i]==pair[0] and ids[i+1]==pair[1]:\n            out.append(new_id); i += 2\n        else: out.append(ids[i]); i += 1\n    return out\ndef train_bpe(text, num_merges):\n    tokens = list(text.encode('utf-8')); merges = {}\n    for i in range(num_merges):\n        stats = get_stats(tokens)\n        if not stats: break\n        top = max(stats, key=stats.get)\n        tokens = merge(tokens, top, 256+i); merges[top] = 256+i\n    return tokens, merges\nprint(train_bpe('aaabdaaabac', 3))",
                "tests": "t, m = train_bpe('aaabdaaabac', 3); assert len(m) == 3"
            },
            "paper_ref": "https://github.com/karpathy/minbpe",
            "source": "karpathy/minbpe"
        },
        {
            "id": "gpt-architecture",
            "title": "GPT Architecture: nanoGPT Deep Dive",
            "explainer": """## GPT: Generative Pre-trained Transformer

### Decoder-only: Stack of transformer decoder blocks. Causal attention (can't see future).
### Components: Token embedding + Position embedding → N × (Attention + FFN + LayerNorm) → LM Head.
### Training: Next-token prediction. Simple objective → emergent capabilities!
### Generation: Predict next token probs → sample (with temperature) → append → repeat.
### nanoGPT: train.py (~300 lines) + model.py (~300 lines). Reproduces GPT-2 (124M).""",
            "visual": """  "The cat sat" → Token+Pos Embedding
  → Transformer Block ×12:
    [Causal Self-Attention] + residual → LayerNorm
    [FFN: d→4d→d + GELU] + residual → LayerNorm
  → LM Head: d→vocab_size → softmax → P(next token)
  
  Causal Mask:  sat sees [The, cat, sat]
                cat sees [The, cat]
                The sees [The]""",
            "questions": [
                {"id": "lm-gpt-1", "type": "multiple-choice", "question": "What is the causal mask in GPT?", "options": ["Regularization technique", "Prevents tokens from attending to future tokens (autoregressive)", "Handles padding", "Applied to output logits"], "correct": 1, "explanation": "Causal mask sets future attention scores to -∞, so each token only attends to itself and previous tokens.", "xp": 15},
                {"id": "lm-gpt-2", "type": "multiple-choice", "question": "How does temperature affect text generation?", "options": ["Higher T = more deterministic", "No effect on quality", "Lower T = more deterministic, higher T = more creative/random", "Controls learning rate"], "correct": 2, "explanation": "Temperature scales logits before softmax. T<1 makes distribution peaky (deterministic), T>1 makes it flatter (random).", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement causal mask and temperature-based sampling.",
                "starter_code": "import numpy as np\ndef causal_mask(n):\n    pass\ndef sample_with_temp(logits, temp=1.0):\n    pass",
                "solution": "import numpy as np\ndef causal_mask(n): return np.tril(np.ones((n,n)))\ndef softmax(x): e=np.exp(x-np.max(x)); return e/e.sum()\ndef sample_with_temp(logits, temp=1.0):\n    probs = softmax(logits / max(temp, 1e-8))\n    return np.random.choice(len(logits), p=probs)\nm = causal_mask(4)\nprint(m)\nprint([sample_with_temp(np.array([2.0,1.0,0.1]), 0.1) for _ in range(5)])",
                "tests": "m = causal_mask(3); assert m[0,1]==0 and m[1,0]==1"
            },
            "paper_ref": "https://github.com/karpathy/nanoGPT",
            "source": "karpathy/nanoGPT"
        },
        {
            "id": "training-llms",
            "title": "Training LLMs: Pretraining, SFT, RLHF & DPO",
            "explainer": """## The LLM Training Pipeline

### Pretraining: Massive text corpus, predict next token. Enormous compute. Result: text completer.
### SFT: Fine-tune on instruction/response pairs. Model learns to follow instructions.
### RLHF: Human preferences → reward model → PPO optimization. Aligns with human values.
### DPO: Skip reward model, directly optimize from preference pairs. Simpler and effective.
### Chinchilla Law: Optimal tokens ≈ 20× parameters. 7B→140B tokens, 70B→1.4T tokens.""",
            "visual": """  Pretraining (internet)  →  SFT (instructions)  →  RLHF/DPO (preferences)
  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
  │ Base Model   │    →     │ Instruction  │    →     │ Aligned &    │
  │ (completes)  │          │ Following    │          │ Safe Model   │
  └──────────────┘          └──────────────┘          └──────────────┘
  
  Chinchilla: Tokens ≈ 20 × Parameters""",
            "questions": [
                {"id": "lm-train-1", "type": "multiple-choice", "question": "Main advantage of DPO over RLHF?", "options": ["Better models", "Skips reward model — simpler and more stable", "Less training data", "Works without reference model"], "correct": 1, "explanation": "DPO eliminates separate reward model training and PPO instability. Directly optimizes from preference pairs.", "xp": 15},
                {"id": "lm-train-2", "type": "multiple-choice", "question": "Chinchilla law: a 10B model should train on ~?", "options": ["10B tokens", "100B tokens", "200B tokens", "1T tokens"], "correct": 2, "explanation": "Chinchilla: optimal tokens ≈ 20× params. 10B × 20 = 200B tokens.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement simplified DPO loss.",
                "starter_code": "import math\ndef dpo_loss(lp_c, lp_r, lr_c, lr_r, beta=0.1):\n    pass\nprint(dpo_loss(-2.0, -3.0, -2.5, -2.5))",
                "solution": "import math\ndef sigmoid(x): return 1/(1+math.exp(-x))\ndef dpo_loss(lp_c, lp_r, lr_c, lr_r, beta=0.1):\n    return -math.log(sigmoid(beta * ((lp_c - lr_c) - (lp_r - lr_r))))\nprint(dpo_loss(-2.0, -3.0, -2.5, -2.5))",
                "tests": "assert dpo_loss(-1.0, -3.0, -2.0, -2.0, 0.1) < dpo_loss(-2.5, -3.0, -2.0, -2.0, 0.1)"
            },
            "paper_ref": "https://arxiv.org/abs/2305.18290",
            "source": "deeplearning.ai"
        },
        {
            "id": "inference-optimization",
            "title": "Inference: KV Cache, Quantization & Speculative Decoding",
            "explainer": """## Making LLM Inference Fast

### KV Cache: Store computed K,V from previous tokens. Only compute Q for new token. O(n)→O(1) per step.
### Quantization: FP32→FP16→INT8→INT4. Less memory, faster, small quality tradeoff.
### Speculative Decoding: Small model drafts N tokens, big model verifies in 1 pass. Same output, 2-3× faster.
### FlashAttention: Memory-efficient O(n²) attention without O(n²) memory.
### Paged Attention (vLLM): Efficient KV cache memory management.""",
            "visual": """  KV Cache:
  Without: Step n recomputes ALL previous tokens (O(n²) total)
  With:    Step n: just compute Q_new, lookup K,V from cache (O(n) total)
  
  Speculative Decoding:
  Draft(small)→"The cat sat on" → Target(large) verifies in 1 pass
  ✓The ✓cat ✓sat ✗in → resample "on". Accept 3 tokens in 1 pass!
  
  Quantization: FP32(4B) → FP16(2B) → INT8(1B) → INT4(0.5B)""",
            "questions": [
                {"id": "lm-inf-1", "type": "multiple-choice", "question": "How does KV cache speed up generation?", "options": ["Caches model weights", "Stores previous K,V pairs so only new token needs attention computation", "Reduces vocabulary", "Compresses model"], "correct": 1, "explanation": "Without cache, generating token N recomputes attention for all N-1 tokens. With cache, only compute Q for new token.", "xp": 15},
                {"id": "lm-inf-2", "type": "multiple-choice", "question": "Why does speculative decoding produce identical output?", "options": ["Draft model is perfect", "Uses rejection sampling that mathematically matches target distribution", "Averages both outputs", "Only uses draft for first token"], "correct": 1, "explanation": "Acceptance probability p_target/p_draft mathematically guarantees output distribution identical to target model.", "xp": 20}
            ],
            "coding_challenge": {
                "prompt": "Implement a simple KV cache class for attention.",
                "starter_code": "import numpy as np\nclass KVCache:\n    def __init__(self): self.k = None; self.v = None\n    def update(self, new_k, new_v): pass\n    def get(self): pass",
                "solution": "import numpy as np\nclass KVCache:\n    def __init__(self): self.k = None; self.v = None\n    def update(self, new_k, new_v):\n        if self.k is None: self.k, self.v = new_k, new_v\n        else:\n            self.k = np.concatenate([self.k, new_k], axis=0)\n            self.v = np.concatenate([self.v, new_v], axis=0)\n    def get(self): return self.k, self.v\nc = KVCache()\nc.update(np.ones((1,4)), np.ones((1,4)))\nc.update(np.ones((1,4))*2, np.ones((1,4))*2)\nprint(c.get()[0].shape)  # (2, 4)",
                "tests": "c=KVCache();c.update(np.ones((1,3)),np.ones((1,3)));assert c.get()[0].shape==(1,3)"
            },
            "source": "language-models"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 5: COMPUTER VISION
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["computer-vision"] = {
    "name": "Computer Vision",
    "description": "Image classification, diffusion models, vision transformers, and multimodal learning",
    "order": 5,
    "topics": [
        {
            "id": "image-classification",
            "title": "Image Classification & Object Detection",
            "explainer": """## Computer Vision Fundamentals

### Classification: Input image → single label (cat, dog, car).
### Object Detection: Locate + classify multiple objects. Output: bounding boxes + labels.
### Key Architectures:
- R-CNN → Fast R-CNN → Faster R-CNN (region proposals)
- YOLO: Single-shot, real-time detection
- SSD: Multi-scale detection

### Transfer Learning: Use ImageNet-pretrained CNN, fine-tune on your data. Almost always better than training from scratch.""",
            "visual": """  Classification:          Object Detection:
  ┌──────────┐              ┌──────────────────┐
  │          │              │  ┌──────┐        │
  │   🐱     │ → "cat"     │  │ 🐱   │ cat 95%│
  │          │              │  └──────┘   ┌──┐ │
  └──────────┘              │             │🐕│ │
                            │             └──┘ │
                            └──────────────────┘
  
  YOLO: Divide image into grid → each cell predicts boxes + classes simultaneously""",
            "questions": [
                {"id": "cv-ic-1", "type": "multiple-choice", "question": "What is transfer learning in CV?", "options": ["Training from scratch on new data", "Using a model pretrained on ImageNet and fine-tuning on target domain", "Transferring data between datasets", "Using multiple GPUs"], "correct": 1, "explanation": "Transfer learning reuses features learned on large datasets (like ImageNet). Early layers (edges, textures) transfer well to new tasks.", "xp": 10},
                {"id": "cv-ic-2", "type": "multiple-choice", "question": "What makes YOLO different from R-CNN for object detection?", "options": ["YOLO is more accurate", "YOLO processes the entire image in one pass (single-shot), enabling real-time detection", "YOLO uses transformers", "R-CNN is faster"], "correct": 1, "explanation": "YOLO divides the image into a grid and predicts all boxes and classes simultaneously in one forward pass, unlike R-CNN which proposes regions first. This makes YOLO much faster.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement Intersection over Union (IoU) for bounding boxes. IoU = Area of Overlap / Area of Union.",
                "starter_code": "def iou(box1, box2):\n    \"\"\"Compute IoU of two boxes [x1, y1, x2, y2].\"\"\"\n    pass\nprint(iou([0,0,2,2], [1,1,3,3]))  # ~0.143",
                "solution": "def iou(box1, box2):\n    x1 = max(box1[0], box2[0]); y1 = max(box1[1], box2[1])\n    x2 = min(box1[2], box2[2]); y2 = min(box1[3], box2[3])\n    inter = max(0, x2-x1) * max(0, y2-y1)\n    a1 = (box1[2]-box1[0]) * (box1[3]-box1[1])\n    a2 = (box2[2]-box2[0]) * (box2[3]-box2[1])\n    return inter / (a1 + a2 - inter)\nprint(iou([0,0,2,2], [1,1,3,3]))",
                "tests": "assert abs(iou([0,0,2,2],[0,0,2,2]) - 1.0) < 1e-6"
            },
            "source": "computer-vision"
        },
        {
            "id": "diffusion-models",
            "title": "Diffusion Models: DDPM & Stable Diffusion",
            "explainer": """## Diffusion Models: Learning to Denoise

### Forward Process: Gradually add Gaussian noise to image over T steps until pure noise.
### Reverse Process: Neural network learns to denoise step by step. Start from noise → generate image.
### Training: Add noise at random step t, train network to predict the noise that was added.
### Stable Diffusion: Runs diffusion in latent space (compressed representation) — much faster!
### Components: VAE encoder/decoder + U-Net denoiser + text encoder (CLIP) for conditioning.""",
            "visual": """  Forward (add noise):
  [Clean Image] → [Slightly Noisy] → [More Noisy] → ... → [Pure Noise]
      x₀              x₁                x₂                    x_T
  
  Reverse (denoise):
  [Pure Noise] → [Less Noisy] → [Less Noisy] → ... → [Clean Image]
      x_T            x_{T-1}         x_{T-2}              x₀
  
  Stable Diffusion:
  Text → [CLIP] → conditioning
                      ↓
  Noise → [U-Net denoiser in latent space] → Latent → [VAE Decoder] → Image""",
            "questions": [
                {"id": "cv-diff-1", "type": "multiple-choice", "question": "What does the neural network learn in DDPM?", "options": ["To generate images directly", "To predict the noise that was added at each timestep", "To classify images", "To compress images"], "correct": 1, "explanation": "The network is trained with a simple MSE loss: given a noisy image at step t, predict the noise ε that was added. At inference, iteratively denoise from pure noise.", "xp": 15},
                {"id": "cv-diff-2", "type": "multiple-choice", "question": "Why does Stable Diffusion work in latent space?", "options": ["Better image quality", "Much faster — operates on compressed representations instead of full pixel space", "Requires less training data", "Produces higher resolution"], "correct": 1, "explanation": "Operating in latent space (e.g., 64×64 instead of 512×512) reduces computation by ~64×, making diffusion practical for high-res images.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement the forward diffusion process: add noise to an image at timestep t.",
                "starter_code": "import numpy as np\ndef forward_diffusion(x0, t, T=1000):\n    \"\"\"Add noise at step t. Returns noisy image and the noise.\"\"\"\n    pass",
                "solution": "import numpy as np\ndef forward_diffusion(x0, t, T=1000):\n    beta = np.linspace(0.0001, 0.02, T)\n    alpha = 1 - beta\n    alpha_bar = np.prod(alpha[:t])\n    noise = np.random.randn(*x0.shape)\n    xt = np.sqrt(alpha_bar) * x0 + np.sqrt(1 - alpha_bar) * noise\n    return xt, noise\nx0 = np.random.randn(8, 8)  # \"image\"\nxt, noise = forward_diffusion(x0, 500)\nprint('Signal preserved:', np.std(xt))",
                "tests": "xt, n = forward_diffusion(np.zeros((4,4)), 1); assert xt.shape == (4,4)"
            },
            "paper_ref": "https://arxiv.org/abs/2006.11239",
            "source": "computer-vision"
        },
        {
            "id": "vision-transformers",
            "title": "Vision Transformers: ViT, DINO & SAM",
            "explainer": """## Vision Transformers: Attention for Images

### ViT: Split image into patches (16×16), flatten, add position embeddings, feed to transformer. Simple and powerful.
### DINOv2: Self-supervised ViT training. No labels needed! Learns universal visual features.
### SAM (Segment Anything): Foundation model for segmentation. Prompt with point/box/text → mask. Meta AI.
### Key Insight: With enough data, transformers outperform CNNs for vision. ViT needs more data but scales better.""",
            "visual": """  ViT: Image → Patches → Transformer
  ┌──┬──┬──┬──┐
  │P1│P2│P3│P4│  Split into 16×16 patches
  ├──┼──┼──┼──┤  Flatten + linear projection
  │P5│P6│P7│P8│  Add [CLS] token + position embeddings
  ├──┼──┼──┼──┤  → Transformer encoder
  │P9│..│..│..│  → [CLS] output → classification
  └──┴──┴──┴──┘
  
  SAM: Point/Box prompt → Encoder → Mask Decoder → Segmentation mask""",
            "questions": [
                {"id": "cv-vit-1", "type": "multiple-choice", "question": "How does ViT process images?", "options": ["Uses convolutions", "Splits image into patches and treats them as tokens for a transformer", "Processes pixel by pixel", "Uses recurrent connections"], "correct": 1, "explanation": "ViT divides the image into fixed-size patches (e.g., 16×16), linearly embeds each patch, adds positional embeddings, and feeds the sequence to a standard transformer encoder.", "xp": 15},
                {"id": "cv-vit-2", "type": "multiple-choice", "question": "What makes DINO special?", "options": ["It uses supervised learning with labels", "Self-supervised learning — learns visual features without any labeled data", "It's faster than ViT", "It only works on small images"], "correct": 1, "explanation": "DINO uses self-distillation (student-teacher framework) with no labels. The resulting features are so good they can be used for classification, segmentation, and retrieval without fine-tuning.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement the image-to-patches step of ViT: split an image into non-overlapping patches and flatten them.",
                "starter_code": "import numpy as np\ndef image_to_patches(image, patch_size=4):\n    \"\"\"Split image (H,W,C) into patches of size patch_size.\n    Returns: (num_patches, patch_size*patch_size*C)\"\"\"\n    pass\nimg = np.random.randn(8, 8, 3)\npatches = image_to_patches(img, patch_size=4)\nprint(patches.shape)  # (4, 48)  — 4 patches, each 4*4*3=48",
                "solution": "import numpy as np\ndef image_to_patches(image, patch_size=4):\n    H, W, C = image.shape\n    nH, nW = H // patch_size, W // patch_size\n    patches = []\n    for i in range(nH):\n        for j in range(nW):\n            patch = image[i*patch_size:(i+1)*patch_size, j*patch_size:(j+1)*patch_size, :]\n            patches.append(patch.flatten())\n    return np.array(patches)\nprint(image_to_patches(np.random.randn(8,8,3), 4).shape)",
                "tests": "p = image_to_patches(np.zeros((8,8,3)), 4); assert p.shape == (4, 48)"
            },
            "paper_ref": "https://arxiv.org/abs/2010.11929",
            "source": "Meta AI (SAM, DINOv2)"
        },
        {
            "id": "multimodal",
            "title": "Multimodal: CLIP, LLaVA & Flamingo",
            "explainer": """## Multimodal Models: Connecting Vision and Language

### CLIP: Trained on 400M image-text pairs. Learns shared embedding space. Zero-shot classification!
### Contrastive Learning: Match image-text pairs (diagonal of similarity matrix), push non-matches apart.
### LLaVA: Visual instruction tuning. Image encoder (CLIP ViT) + LLM (LLaMA). Can describe, reason about images.
### Applications: Text-to-image search, zero-shot classification, visual QA, image generation guidance.""",
            "visual": """  CLIP Training:
  Images: [🐱, 🐕, 🚗]     Texts: [\"a cat\", \"a dog\", \"a car\"]
  
  Similarity Matrix (cosine):
       text₁  text₂  text₃
  img₁ [0.9   0.1   0.0 ]  ← maximize diagonal
  img₂ [0.1   0.9   0.1 ]  ← minimize off-diagonal
  img₃ [0.0   0.1   0.9 ]
  
  LLaVA:
  [Image] → CLIP ViT → visual tokens ──┐
                                        ├──▶ LLM (LLaMA) → text response
  [\"Describe this image\"] ─────────────┘""",
            "questions": [
                {"id": "cv-mm-1", "type": "multiple-choice", "question": "How does CLIP enable zero-shot classification?", "options": ["It was trained on all ImageNet classes", "It learns a shared embedding space where images and text can be directly compared via cosine similarity", "It uses a separate classifier head for each class", "It memorizes image-label pairs"], "correct": 1, "explanation": "CLIP learns to embed images and text in the same space. For zero-shot classification, encode the image and candidate text labels, then pick the text with highest cosine similarity to the image.", "xp": 20},
                {"id": "cv-mm-2", "type": "multiple-choice", "question": "What is contrastive loss in CLIP?", "options": ["MSE between image and text", "Cross-entropy on similarity matrix — maximize matching pairs, minimize non-matching", "Binary classification of matching vs non-matching", "Reconstruction loss"], "correct": 1, "explanation": "CLIP uses InfoNCE loss on the image-text similarity matrix. Diagonal elements (matching pairs) should have high similarity, off-diagonal (non-matching) should be low.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement CLIP-style contrastive loss. Given image and text embeddings, compute the InfoNCE loss.",
                "starter_code": "import numpy as np\ndef clip_loss(image_embeds, text_embeds, temperature=0.07):\n    \"\"\"Compute CLIP contrastive loss.\"\"\"\n    pass",
                "solution": "import numpy as np\ndef clip_loss(image_embeds, text_embeds, temperature=0.07):\n    # Normalize\n    img_norm = image_embeds / np.linalg.norm(image_embeds, axis=1, keepdims=True)\n    txt_norm = text_embeds / np.linalg.norm(text_embeds, axis=1, keepdims=True)\n    # Similarity matrix\n    logits = (img_norm @ txt_norm.T) / temperature\n    n = len(logits)\n    labels = np.arange(n)\n    # Cross-entropy in both directions\n    def ce(logits, labels):\n        log_sum_exp = np.log(np.sum(np.exp(logits - np.max(logits, axis=1, keepdims=True)), axis=1))\n        return -np.mean(logits[np.arange(n), labels] - np.max(logits, axis=1) - log_sum_exp)\n    return (ce(logits, labels) + ce(logits.T, labels)) / 2\nprint(clip_loss(np.eye(3), np.eye(3)))",
                "tests": "# Perfect alignment should give low loss"
            },
            "paper_ref": "https://arxiv.org/abs/2103.00020",
            "source": "Meta AI / OpenAI"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 6: REINFORCEMENT LEARNING
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["reinforcement-learning"] = {
    "name": "Reinforcement Learning",
    "description": "MDPs, Q-learning, policy gradients, PPO, and RLHF for LLMs",
    "order": 6,
    "topics": [
        {
            "id": "rl-fundamentals",
            "title": "RL Fundamentals: MDPs & Value Functions",
            "explainer": """## Reinforcement Learning: Learning from Rewards

### The Setup: Agent interacts with environment. Takes actions, receives rewards, observes new state.
### MDP: (States, Actions, Transitions, Rewards, Discount γ). Markov: next state depends only on current state+action.
### Value Function V(s): Expected total reward from state s. V(s) = E[R_t + γR_{t+1} + γ²R_{t+2} + ...]
### Q Function Q(s,a): Expected total reward from state s, taking action a, then following policy.
### Bellman Equation: V(s) = max_a [R(s,a) + γ·V(s')]. Foundation of dynamic programming in RL.""",
            "visual": """  Agent-Environment Loop:
  ┌──────────┐  action a_t  ┌─────────────┐
  │  Agent   │─────────────▶│ Environment │
  │ (policy) │◀─────────────│  (world)    │
  └──────────┘  reward r_t  └─────────────┘
                state s_{t+1}
  
  Value Function:
  State A ──(reward=1)──▶ State B ──(reward=0)──▶ State C (terminal, reward=10)
  V(C) = 10, V(B) = 0 + γ·10, V(A) = 1 + γ·(0 + γ·10) = 1 + 10γ²""",
            "questions": [
                {"id": "rl-fund-1", "type": "multiple-choice", "question": "What does the discount factor γ control?", "options": ["Learning rate", "How much future rewards are valued vs immediate rewards", "Exploration rate", "Network size"], "correct": 1, "explanation": "γ∈[0,1] discounts future rewards. γ=0: only care about immediate reward. γ=0.99: strongly value future rewards. Ensures convergence of infinite sums.", "xp": 10},
                {"id": "rl-fund-2", "type": "multiple-choice", "question": "What is the Bellman equation?", "options": ["Loss function for RL", "Recursive relationship: V(s) = max_a[R(s,a) + γV(s')]", "Activation function", "Optimization algorithm"], "correct": 1, "explanation": "The Bellman equation expresses the value of a state in terms of immediate reward plus discounted value of the next state. It's the foundation of value-based RL methods.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement value iteration for a simple gridworld MDP.",
                "starter_code": "import numpy as np\ndef value_iteration(rewards, gamma=0.9, threshold=1e-4):\n    \"\"\"Simple 1D gridworld. States 0..n-1, actions: left/right.\"\"\"\n    pass",
                "solution": "import numpy as np\ndef value_iteration(rewards, gamma=0.9, threshold=1e-4):\n    n = len(rewards)\n    V = np.zeros(n)\n    while True:\n        V_new = np.zeros(n)\n        for s in range(n):\n            vals = []\n            for a in [-1, 1]:  # left, right\n                s_next = max(0, min(n-1, s + a))\n                vals.append(rewards[s] + gamma * V[s_next])\n            V_new[s] = max(vals)\n        if np.max(np.abs(V_new - V)) < threshold: break\n        V = V_new\n    return V\nprint(value_iteration([0, 0, 0, 0, 10]))",
                "tests": "V = value_iteration([0,0,0,0,10]); assert V[4] > V[0]"
            },
            "source": "reinforcement-learning"
        },
        {
            "id": "q-learning-dqn",
            "title": "Q-Learning & Deep Q-Networks",
            "explainer": """## Q-Learning: Learning Action Values

### Q-Learning: Learn Q(s,a) from experience. Update: Q(s,a) ← Q(s,a) + α[r + γ·max_a'Q(s',a') - Q(s,a)]
### ε-Greedy: With probability ε, explore (random action). Otherwise exploit (best action).
### DQN: Replace Q-table with neural network. Input: state → Output: Q-value for each action.
### Key DQN Innovations:
- Experience replay: Store transitions, sample random mini-batches (breaks correlation)
- Target network: Separate network for targets, update periodically (stabilizes training)""",
            "visual": """  Q-Table:           DQN:
  ┌──────┬──────┐    State ──▶ [Neural Net] ──▶ Q(s, left)
  │State │ Q(a) │                                Q(s, right)
  │  s₁  │ 2.1  │                                Q(s, up)
  │  s₂  │ 3.5  │    Experience Replay Buffer:
  │  s₃  │ 1.2  │    [(s,a,r,s'), (s,a,r,s'), ...]
  └──────┴──────┘    Sample random batch → train""",
            "questions": [
                {"id": "rl-ql-1", "type": "multiple-choice", "question": "Why does DQN use experience replay?", "options": ["To save memory", "To break temporal correlations between consecutive experiences, improving training stability", "To generate more data", "To speed up inference"], "correct": 1, "explanation": "Consecutive experiences are correlated (similar states). Random sampling from a replay buffer provides more i.i.d.-like mini-batches, which neural networks need for stable training.", "xp": 15},
                {"id": "rl-ql-2", "type": "multiple-choice", "question": "What is the exploration-exploitation tradeoff?", "options": ["Trading speed for accuracy", "Balancing trying new actions (exploration) vs using known good actions (exploitation)", "Choosing between models", "CPU vs GPU tradeoff"], "correct": 1, "explanation": "Too much exploitation: stuck in local optima, never discover better strategies. Too much exploration: never fully leverage what you've learned. ε-greedy balances both.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement tabular Q-learning for a simple environment.",
                "starter_code": "import numpy as np\ndef q_learning(n_states, n_actions, episodes=1000, alpha=0.1, gamma=0.99, epsilon=0.1):\n    Q = np.zeros((n_states, n_actions))\n    # ... environment interaction and Q-updates\n    return Q",
                "solution": "import numpy as np\ndef q_learning(n_states=5, n_actions=2, episodes=1000, alpha=0.1, gamma=0.99, eps=0.1):\n    Q = np.zeros((n_states, n_actions))\n    for _ in range(episodes):\n        s = 0\n        for _ in range(100):\n            a = np.random.randint(n_actions) if np.random.rand()<eps else np.argmax(Q[s])\n            s_next = min(n_states-1, max(0, s + (1 if a==1 else -1)))\n            r = 10.0 if s_next == n_states-1 else -0.1\n            Q[s,a] += alpha * (r + gamma * np.max(Q[s_next]) - Q[s,a])\n            s = s_next\n            if s == n_states-1: break\n    return Q\nprint(q_learning())",
                "tests": "Q = q_learning(); assert Q[0,1] > Q[0,0]  # should prefer going right"
            },
            "paper_ref": "https://arxiv.org/abs/1312.5602",
            "source": "DeepMind (AlphaGo)"
        },
        {
            "id": "policy-gradient-ppo",
            "title": "Policy Gradients & PPO",
            "explainer": """## Policy Gradient Methods

### Idea: Directly optimize the policy π(a|s) instead of learning Q-values.
### REINFORCE: ∇J = E[∇log π(a|s) · R]. Increase probability of actions that led to high reward.
### Problem: High variance! Lots of noise in gradient estimates.
### PPO (Proximal Policy Optimization):
- Clip the policy ratio to prevent too-large updates
- ratio = π_new(a|s) / π_old(a|s)
- L = min(ratio·A, clip(ratio, 1-ε, 1+ε)·A)
- Default algorithm for RLHF in LLMs!""",
            "visual": """  REINFORCE:
  Episode: s₁→a₁→r₁→s₂→a₂→r₂→...→sT
  For each (s,a): ∇log π(a|s) × (total_reward - baseline)
  → increase prob of good actions, decrease bad
  
  PPO Clipping:
  ratio │     ┌────────
        │    ╱
  1+ε   │───╱──────────  ← clip high
  1     │──╱
  1-ε   │─╱────────────  ← clip low
        │╱
        └──────────────
        Prevents too-large policy updates""",
            "questions": [
                {"id": "rl-ppo-1", "type": "multiple-choice", "question": "Why does PPO clip the policy ratio?", "options": ["To speed up training", "To prevent destructively large policy updates that could collapse performance", "To reduce memory usage", "To handle continuous actions"], "correct": 1, "explanation": "Without clipping, a single large gradient update could drastically change the policy, causing catastrophic performance collapse. PPO's clipping keeps updates conservative and stable.", "xp": 15},
                {"id": "rl-ppo-2", "type": "multiple-choice", "question": "Why is PPO used for RLHF in LLMs?", "options": ["It's the fastest RL algorithm", "It's stable, sample-efficient, and well-suited for fine-tuning large pretrained models", "It doesn't need rewards", "It was specifically designed for NLP"], "correct": 1, "explanation": "PPO provides stable policy updates (critical when fine-tuning expensive LLMs), works well with neural network policies, and is relatively simple to implement and tune.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement the PPO clipping objective.",
                "starter_code": "import numpy as np\ndef ppo_clip_objective(ratio, advantage, epsilon=0.2):\n    \"\"\"Compute PPO clipped objective.\"\"\"\n    pass",
                "solution": "import numpy as np\ndef ppo_clip_objective(ratio, advantage, epsilon=0.2):\n    unclipped = ratio * advantage\n    clipped = np.clip(ratio, 1-epsilon, 1+epsilon) * advantage\n    return np.minimum(unclipped, clipped)\nratios = np.array([0.5, 1.0, 1.5, 2.0])\nadvantages = np.array([1.0, 1.0, 1.0, 1.0])\nprint(ppo_clip_objective(ratios, advantages))",
                "tests": "assert ppo_clip_objective(np.array([2.0]), np.array([1.0]))[0] == 1.2"
            },
            "paper_ref": "https://arxiv.org/abs/1707.06347",
            "source": "reinforcement-learning"
        },
        {
            "id": "multi-agent-rl",
            "title": "Multi-Agent RL & Game Playing",
            "explainer": """## Multi-Agent RL

### Self-Play: Agent plays against itself. Both sides improve simultaneously (AlphaGo, AlphaZero).
### MCTS (Monte Carlo Tree Search): Simulate many possible futures, pick the best move.
### AlphaZero: Neural net (policy + value) + MCTS. Mastered Chess, Go, Shogi from scratch.
### Emergent Behavior: Simple rules → complex strategies emerge from multi-agent interaction.
### Meta's Cicero: Combined LLM + RL for Diplomacy — strategic reasoning + natural language.""",
            "visual": """  AlphaZero Self-Play:
  ┌──────────┐          ┌──────────┐
  │ Player A │ ◀──────▶ │ Player B │  (same network!)
  │ (net v1) │  game    │ (net v1) │
  └──────────┘          └──────────┘
       ↓ training data
  ┌──────────┐
  │ net v2   │  (improved from self-play games)
  └──────────┘
  
  MCTS: Explore game tree → simulate → evaluate → update
  ┌─┐
  │S│──┬──[a1]──┬──[expand]──[simulate]──[score]
  └─┘  │       │
       └──[a2]──└──...""",
            "questions": [
                {"id": "rl-ma-1", "type": "multiple-choice", "question": "How did AlphaZero learn to play Chess, Go, and Shogi?", "options": ["Trained on millions of human games", "Self-play with MCTS — no human knowledge except the rules", "Reinforcement learning with human rewards", "Transfer learning from a language model"], "correct": 1, "explanation": "AlphaZero learned purely through self-play, starting from random play. It used a neural network to evaluate positions and guide MCTS, improving both through self-play training data.", "xp": 20}
            ],
            "coding_challenge": {
                "prompt": "Implement a simple self-play framework for Tic-Tac-Toe with random agents.",
                "starter_code": "import numpy as np\ndef play_game():\n    board = np.zeros((3,3), dtype=int)\n    player = 1\n    for _ in range(9):\n        # Random valid move\n        pass\n    return 0  # winner or 0 for draw",
                "solution": "import numpy as np\ndef check_winner(board):\n    for p in [1, -1]:\n        for i in range(3):\n            if all(board[i,:]==p) or all(board[:,i]==p): return p\n        if board[0,0]==board[1,1]==board[2,2]==p: return p\n        if board[0,2]==board[1,1]==board[2,0]==p: return p\n    return 0\ndef play_game():\n    board = np.zeros((3,3), dtype=int); player = 1\n    for _ in range(9):\n        empty = list(zip(*np.where(board==0)))\n        if not empty: break\n        r, c = empty[np.random.randint(len(empty))]\n        board[r,c] = player\n        if check_winner(board): return player\n        player *= -1\n    return 0\nresults = [play_game() for _ in range(1000)]\nprint(f'P1 wins: {results.count(1)}, P2 wins: {results.count(-1)}, Draws: {results.count(0)}')",
                "tests": "r = play_game(); assert r in [-1, 0, 1]"
            },
            "paper_ref": "https://arxiv.org/abs/1712.01815",
            "source": "DeepMind (AlphaZero)"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 7: SYSTEMS & PRODUCTION
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["systems-production"] = {
    "name": "Systems & Production",
    "description": "Distributed training, GPU programming, inference serving, and MLOps",
    "order": 7,
    "topics": [
        {
            "id": "distributed-training",
            "title": "Distributed Training: Data, Model & Pipeline Parallelism",
            "explainer": """## Training on Multiple GPUs

### Data Parallelism (DDP): Copy model to each GPU, split data. Average gradients. Most common.
### Model Parallelism: Split model layers across GPUs. For models too large for one GPU.
### Pipeline Parallelism: Split model into stages, process micro-batches in pipeline fashion.
### Tensor Parallelism: Split individual layers across GPUs (split weight matrices).
### FSDP: Fully Sharded Data Parallel. Shard model parameters, gradients, and optimizer states across GPUs.""",
            "visual": """  Data Parallel (DDP):
  GPU 0: [Full Model] ← batch 0   ┐
  GPU 1: [Full Model] ← batch 1   ├── average gradients → update
  GPU 2: [Full Model] ← batch 2   ┘
  
  Pipeline Parallel:
  GPU 0: [Layers 1-4]  ──▶  GPU 1: [Layers 5-8]  ──▶  GPU 2: [Layers 9-12]
  micro-batch 1 ────────▶  micro-batch 1 ──────────▶  micro-batch 1
  micro-batch 2 ────────▶  micro-batch 2 ──────────▶  ...
  
  Tensor Parallel:
  GPU 0: [W[:, :d/2]]  ┐
                        ├── concat → output
  GPU 1: [W[:, d/2:]]  ┘""",
            "questions": [
                {"id": "sys-dt-1", "type": "multiple-choice", "question": "When should you use model parallelism instead of data parallelism?", "options": ["When you have many small GPUs", "When the model is too large to fit on a single GPU", "When you want faster training with small models", "When your dataset is very large"], "correct": 1, "explanation": "Data parallelism copies the full model to each GPU — impossible if the model exceeds one GPU's memory. Model parallelism splits the model across GPUs, enabling training of very large models.", "xp": 15},
                {"id": "sys-dt-2", "type": "multiple-choice", "question": "What does FSDP (Fully Sharded Data Parallel) shard?", "options": ["Only data", "Model parameters, gradients, AND optimizer states", "Only gradients", "Only the dataset"], "correct": 1, "explanation": "FSDP shards all three: parameters, gradients, and optimizer states. Each GPU only stores 1/N of everything, dramatically reducing memory. Parameters are gathered just-in-time for computation.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement a simple all-reduce operation (average gradients across simulated GPUs).",
                "starter_code": "import numpy as np\ndef all_reduce_average(gpu_gradients):\n    \"\"\"Average gradients across GPUs.\"\"\"\n    pass\ngrads = [np.array([1.0, 2.0]), np.array([3.0, 4.0]), np.array([5.0, 6.0])]\nprint(all_reduce_average(grads))  # [3.0, 4.0]",
                "solution": "import numpy as np\ndef all_reduce_average(gpu_gradients):\n    return np.mean(gpu_gradients, axis=0)\nprint(all_reduce_average([np.array([1.0,2.0]), np.array([3.0,4.0]), np.array([5.0,6.0])]))",
                "tests": "assert np.allclose(all_reduce_average([np.array([1,2]), np.array([3,4])]), [2,3])"
            },
            "paper_ref": "https://arxiv.org/abs/2304.11277",
            "source": "NVIDIA/Meta"
        },
        {
            "id": "gpu-programming",
            "title": "GPU Programming & CUDA Concepts",
            "explainer": """## GPU Programming for ML

### Why GPUs: Thousands of cores for parallel math. Matrix multiply → massive parallelism.
### CUDA Hierarchy: Grid → Blocks → Threads. Each thread computes one element.
### Memory Hierarchy: Global (slow, large) → Shared (fast, small per block) → Registers (fastest).
### Key Operations: MatMul, attention, element-wise ops, reduction (sum/max across threads).
### FlashAttention: Fuses attention computation, tiles in SRAM. O(n²) compute but O(n) memory!

### llm.c Connection: Karpathy implements full GPT training in pure CUDA — the best way to learn.""",
            "visual": """  GPU Architecture:
  ┌─────────────────────────────────┐
  │ GPU                              │
  │ ┌──────┐ ┌──────┐ ┌──────┐     │
  │ │ SM 0 │ │ SM 1 │ │ SM 2 │ ... │  (Streaming Multiprocessors)
  │ │┌────┐│ │┌────┐│ │┌────┐│     │
  │ ││core││ ││core││ ││core││     │  (thousands of CUDA cores)
  │ ││core││ ││core││ ││core││     │
  │ │└────┘│ │└────┘│ │└────┘│     │
  │ └──────┘ └──────┘ └──────┘     │
  │ ┌──────────────────────────┐    │
  │ │    Global Memory (HBM)   │    │  (80GB on A100)
  │ └──────────────────────────┘    │
  └─────────────────────────────────┘
  
  Memory Speed: Registers > Shared > L2 > Global (HBM)
                ~20TB/s    ~20TB/s  ~6TB/s  ~2TB/s""",
            "questions": [
                {"id": "sys-gpu-1", "type": "multiple-choice", "question": "Why is FlashAttention faster than standard attention?", "options": ["It uses approximate attention", "It tiles computation to fit in fast SRAM, avoiding slow HBM reads/writes for the full attention matrix", "It reduces the number of operations", "It uses fewer GPU cores"], "correct": 1, "explanation": "Standard attention materializes the full n×n attention matrix in slow HBM. FlashAttention tiles the computation into blocks that fit in fast SRAM (shared memory), reducing memory accesses by orders of magnitude.", "xp": 20},
                {"id": "sys-gpu-2", "type": "multiple-choice", "question": "What does Karpathy's llm.c demonstrate?", "options": ["Python is best for ML", "LLM training can be done in pure C/CUDA without Python or PyTorch, and be faster", "C is too slow for ML", "GPUs aren't needed for training"], "correct": 1, "explanation": "llm.c implements GPT-2 training in ~1000 lines of C/CUDA, is ~7% faster than PyTorch, and demonstrates that the underlying computation is straightforward without framework overhead.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Simulate a simple parallel matrix multiply by breaking it into blocks (like GPU thread blocks).",
                "starter_code": "import numpy as np\ndef blocked_matmul(A, B, block_size=2):\n    \"\"\"Block matrix multiplication (simulates GPU tiling).\"\"\"\n    pass",
                "solution": "import numpy as np\ndef blocked_matmul(A, B, block_size=2):\n    M, K = A.shape; K2, N = B.shape\n    assert K == K2\n    C = np.zeros((M, N))\n    for i in range(0, M, block_size):\n        for j in range(0, N, block_size):\n            for k in range(0, K, block_size):\n                ib, jb, kb = min(i+block_size,M), min(j+block_size,N), min(k+block_size,K)\n                C[i:ib, j:jb] += A[i:ib, k:kb] @ B[k:kb, j:jb]\n    return C\nA = np.random.randn(4,4); B = np.random.randn(4,4)\nassert np.allclose(blocked_matmul(A,B), A@B)",
                "tests": "A=np.eye(4);B=np.ones((4,4));assert np.allclose(blocked_matmul(A,B),B)"
            },
            "paper_ref": "https://github.com/karpathy/llm.c",
            "source": "karpathy/llm.c"
        },
        {
            "id": "inference-serving",
            "title": "Inference Serving: vLLM, TensorRT & ONNX",
            "explainer": """## Serving ML Models in Production

### vLLM: High-throughput LLM serving with PagedAttention. Continuous batching. 10-24× faster than HuggingFace.
### TensorRT: NVIDIA's inference optimizer. Graph optimization, kernel fusion, quantization.
### ONNX: Open model format. Export from PyTorch/TF, run anywhere with optimized runtime.
### Key Techniques:
- Continuous batching: Don't wait for whole batch, add new requests immediately
- PagedAttention: Manage KV cache like virtual memory pages
- Kernel fusion: Combine multiple ops into one GPU kernel call""",
            "visual": """  Static Batching:           Continuous Batching (vLLM):
  ┌─────────────────┐        ┌─────────────────┐
  │ req1 ████████   │        │ req1 ████████   │
  │ req2 ████       │        │ req2 ████ req4█ │  ← new req fills gap
  │ req3 ██████     │        │ req3 ██████req5█│
  │      (padding)  │        │ (no wasted GPU) │
  └─────────────────┘        └─────────────────┘
  Wait for all to finish     Process continuously
  
  PagedAttention:
  KV Cache as virtual memory pages:
  [Page1][Page2][Page3] → can be non-contiguous in GPU memory
  Efficient memory allocation, sharing, and eviction""",
            "questions": [
                {"id": "sys-is-1", "type": "multiple-choice", "question": "What is continuous batching?", "options": ["Batching all requests at once", "Dynamically adding new requests to the batch as previous ones finish, maximizing GPU utilization", "Processing one request at a time", "Batching by request size"], "correct": 1, "explanation": "Static batching pads shorter sequences and waits for all to finish. Continuous batching fills gaps immediately when requests finish, achieving near-100% GPU utilization.", "xp": 15},
                {"id": "sys-is-2", "type": "multiple-choice", "question": "What does TensorRT do to speed up inference?", "options": ["Retrains the model", "Optimizes computation graphs, fuses operations, quantizes weights, and generates hardware-specific kernels", "Uses more GPUs", "Reduces model accuracy"], "correct": 1, "explanation": "TensorRT analyzes the model graph, fuses compatible operations (fewer kernel launches), applies quantization (INT8/FP16), and generates CUDA kernels optimized for specific GPU hardware.", "xp": 15}
            ],
            "coding_challenge": {
                "prompt": "Implement a simple request scheduler with continuous batching simulation.",
                "starter_code": "class InferenceServer:\n    def __init__(self, max_batch=4):\n        self.max_batch = max_batch\n        self.queue = []\n        self.active = []\n    def add_request(self, req_id, tokens_remaining): pass\n    def step(self): pass  # process one step, return completed",
                "solution": "class InferenceServer:\n    def __init__(self, max_batch=4):\n        self.max_batch = max_batch; self.queue = []; self.active = []\n    def add_request(self, req_id, tokens_remaining):\n        self.queue.append({'id': req_id, 'remaining': tokens_remaining})\n    def step(self):\n        # Fill batch from queue\n        while len(self.active) < self.max_batch and self.queue:\n            self.active.append(self.queue.pop(0))\n        # Process one token for each active request\n        completed = []\n        for req in self.active:\n            req['remaining'] -= 1\n        completed = [r for r in self.active if r['remaining'] <= 0]\n        self.active = [r for r in self.active if r['remaining'] > 0]\n        return [c['id'] for c in completed]\nserver = InferenceServer(max_batch=2)\nserver.add_request('A', 3); server.add_request('B', 1); server.add_request('C', 2)\nfor step in range(5): print(f'Step {step}: completed={server.step()}, active={len(server.active)}')",
                "tests": "s=InferenceServer(2);s.add_request('a',1);assert s.step()==['a']"
            },
            "source": "systems-production"
        },
        {
            "id": "mlops",
            "title": "MLOps: Experiment Tracking & Deployment",
            "explainer": """## MLOps: From Experiment to Production

### Experiment Tracking: Log hyperparameters, metrics, artifacts. Tools: W&B, MLflow, TensorBoard.
### Model Registry: Version models, track lineage, manage deployment stages (staging → production).
### Deployment Patterns:
- Online: Real-time API (REST/gRPC)
- Batch: Process large datasets offline
- Edge: Run on device (mobile, embedded)

### Monitoring: Track latency, throughput, data drift, model degradation.
### CI/CD for ML: Automated testing of model quality, not just code correctness.""",
            "visual": """  MLOps Lifecycle:
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Develop  │ →  │  Train   │ →  │ Evaluate │ →  │ Deploy   │
  │ (code)   │    │ (compute)│    │ (metrics)│    │ (serve)  │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘
       ↑                                               │
       └──────────── Monitor & Retrain ◀───────────────┘
  
  Experiment Tracking:
  Run #42: lr=3e-4, batch=64, loss=0.23, acc=97.1%
  Run #43: lr=1e-4, batch=128, loss=0.21, acc=97.8% ← best""",
            "questions": [
                {"id": "sys-ml-1", "type": "multiple-choice", "question": "What is data drift?", "options": ["Moving data between servers", "When production data distribution changes from training data, degrading model performance", "Data corruption", "Too much training data"], "correct": 1, "explanation": "Data drift occurs when real-world data evolves differently from training data. E.g., user behavior changes, new products appear. Models must be monitored and retrained to maintain performance.", "xp": 10},
                {"id": "sys-ml-2", "type": "multiple-choice", "question": "Why is experiment tracking important in ML?", "options": ["Legal compliance", "Enables reproducibility, comparison of approaches, and identification of best hyperparameters", "Required by GPUs", "Reduces training time"], "correct": 1, "explanation": "ML development involves many experiments varying hyperparameters, architectures, and data. Without systematic tracking, you lose track of what worked, can't reproduce results, and waste compute.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement a simple experiment tracker that logs runs, metrics, and finds the best run.",
                "starter_code": "class ExperimentTracker:\n    def __init__(self): self.runs = []\n    def log_run(self, name, params, metrics): pass\n    def best_run(self, metric, higher_is_better=True): pass",
                "solution": "class ExperimentTracker:\n    def __init__(self): self.runs = []\n    def log_run(self, name, params, metrics):\n        self.runs.append({'name': name, 'params': params, 'metrics': metrics})\n    def best_run(self, metric, higher_is_better=True):\n        return sorted(self.runs, key=lambda r: r['metrics'].get(metric, 0), reverse=higher_is_better)[0]\ntracker = ExperimentTracker()\ntracker.log_run('run1', {'lr': 0.01}, {'acc': 0.95, 'loss': 0.3})\ntracker.log_run('run2', {'lr': 0.001}, {'acc': 0.97, 'loss': 0.2})\nprint(tracker.best_run('acc'))",
                "tests": "t=ExperimentTracker();t.log_run('a',{},{'acc':0.9});t.log_run('b',{},{'acc':0.95});assert t.best_run('acc')['name']=='b'"
            },
            "source": "systems-production"
        }
    ]
}

# ═══════════════════════════════════════════════════════════════
# LEVEL 8: RESEARCH FRONTIER
# ═══════════════════════════════════════════════════════════════
curriculum["levels"]["research-frontier"] = {
    "name": "Research Frontier",
    "description": "Latest papers, paper reading skills, reproducing results, and open source ML",
    "order": 8,
    "topics": [
        {
            "id": "reading-ml-papers",
            "title": "How to Read ML Papers",
            "explainer": "## Reading ML Papers Effectively\n\n### Three-Pass Approach:\n1. **First Pass (5 min)**: Title, abstract, figures, conclusions.\n2. **Second Pass (30 min)**: Read fully, skip proofs. Understand method + results.\n3. **Third Pass (hours)**: Every equation, could re-implement.\n\n### Focus On: Problem → Key Insight → Method → Results → Limitations.\n### Keep a Paper Log: Title, date read, key idea, relevance to your work.",
            "visual": "  Paper Reading Flow:\n  Title/Abstract → Figures → Method → Experiments → Conclusion\n  (5 min)          (10 min)  (deep)   (tables)      (summary)\n\n  Paper Log Template:\n  | Paper | Key Idea | Relevance | Implementation? |",
            "questions": [
                {"id": "rf-rp-1", "type": "multiple-choice", "question": "In a first pass of an ML paper, what should you read?", "options": ["Every equation carefully", "Title, abstract, section headers, figures, and conclusion", "Only the related work section", "The appendix first"], "correct": 1, "explanation": "First pass gives you the big picture in ~5 minutes. Figures often convey the main idea better than text. Abstract + conclusion tell you what was done and what was found.", "xp": 10},
                {"id": "rf-rp-2", "type": "multiple-choice", "question": "What makes a good ML paper contribution?", "options": ["More parameters than previous work", "A clear, novel insight that improves upon the state of the art with solid experimental evidence", "Using the latest framework", "Longer papers are better"], "correct": 1, "explanation": "A good contribution has: (1) clear problem statement, (2) novel technical insight, (3) rigorous experiments with fair baselines, (4) honest limitations.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Build a paper summary template generator that extracts key fields from a paper description.",
                "starter_code": "def summarize_paper(title, abstract, key_results):\n    \"\"\"Generate structured summary.\"\"\"\n    pass",
                "solution": "def summarize_paper(title, abstract, key_results):\n    return {\n        'title': title,\n        'problem': abstract.split('.')[0],\n        'key_results': key_results,\n        'questions': ['What is the key insight?', 'How does it compare to baselines?', 'What are limitations?']\n    }\nprint(summarize_paper('Attention Is All You Need', 'We propose a new architecture based solely on attention mechanisms.', ['BLEU 28.4 on WMT']))",
                "tests": "s = summarize_paper('Test', 'A paper.', ['good']); assert s['title'] == 'Test'"
            },
            "paper_ref": "https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf",
            "source": "research-frontier"
        },
        {
            "id": "frontier-papers",
            "title": "Frontier Research: Key Papers 2023-2026",
            "explainer": "## Key Papers Shaping the Field\n\n### Language Models:\n- **LLaMA/LLaMA 2/3** (Meta): Open-weight LLMs, competitive with GPT\n- **Mixtral** (Mistral): Mixture of Experts, 8×7B = 12B active params\n- **GPT-4/o** (OpenAI): Multimodal, reasoning\n\n### Vision:\n- **SAM** (Meta): Segment Anything — foundation model for segmentation\n- **DINOv2** (Meta): Self-supervised vision features\n- **Stable Diffusion 3**: Rectified flow, DiT architecture\n\n### Agents & Reasoning:\n- **Chain-of-Thought**: Step-by-step reasoning improves LLM accuracy\n- **ReAct**: Reasoning + Acting — LLMs use tools\n- **SIMA** (DeepMind): 3D game-playing agents\n\n### Systems:\n- **FlashAttention 2/3**: Memory-efficient attention\n- **Mamba/S4**: State space models as alternative to transformers\n- **Ring Attention**: Distributed attention across devices",
            "visual": "  2023-2026 AI Timeline:\n  2023: LLaMA, GPT-4, SAM, SDXL, Mixtral\n  2024: LLaMA3, Gemini, Claude3, SORA, FlashAttn3\n  2025: DeepSeek-R1, o3, Gemini2, Claude4, Genie3\n  2026: Gemini Robotics, Physical AI frontier\n\n  Architecture Evolution:\n  RNN → LSTM → Transformer → MoE → SSM (Mamba)?",
            "questions": [
                {"id": "rf-fp-1", "type": "multiple-choice", "question": "What is Mixture of Experts (MoE)?", "options": ["Ensemble of separate models", "Architecture where only a subset of parameters (experts) are activated per input, enabling larger models with less compute", "Multiple training runs averaged", "Expert human annotation"], "correct": 1, "explanation": "MoE uses a router to select K of N expert FFN blocks per token. Mixtral 8×7B has 46B total parameters but only activates ~12B per token, getting near-GPT-3.5 quality at much lower inference cost.", "xp": 20},
                {"id": "rf-fp-2", "type": "multiple-choice", "question": "What are state space models (Mamba) an alternative to?", "options": ["CNNs", "Transformer self-attention — they process sequences in O(n) instead of O(n²)", "Batch normalization", "Dropout"], "correct": 1, "explanation": "Mamba and other SSMs process sequences linearly O(n) by maintaining a hidden state, similar to RNNs but with better training parallelism. They challenge the dominance of quadratic-cost attention for long sequences.", "xp": 20}
            ],
            "coding_challenge": {
                "prompt": "Implement a simple Mixture of Experts layer with top-k routing.",
                "starter_code": "import numpy as np\ndef moe_layer(x, expert_weights, router_weights, top_k=2):\n    \"\"\"x: (d,), expert_weights: list of (d,d) matrices, router: (d, n_experts)\"\"\"\n    pass",
                "solution": "import numpy as np\ndef softmax(x): e=np.exp(x-np.max(x)); return e/e.sum()\ndef moe_layer(x, expert_weights, router_weights, top_k=2):\n    # Router: select top-k experts\n    router_logits = x @ router_weights  # (n_experts,)\n    top_indices = np.argsort(router_logits)[-top_k:]\n    gate_values = softmax(router_logits[top_indices])\n    # Compute weighted sum of expert outputs\n    output = np.zeros_like(x)\n    for idx, gate in zip(top_indices, gate_values):\n        expert_out = np.tanh(x @ expert_weights[idx])\n        output += gate * expert_out\n    return output\nd = 4; n_experts = 4\nexperts = [np.random.randn(d,d)*0.1 for _ in range(n_experts)]\nrouter = np.random.randn(d, n_experts)*0.1\nx = np.random.randn(d)\nprint(moe_layer(x, experts, router, top_k=2))",
                "tests": "d=4;e=[np.eye(d)]*4;r=np.ones((d,4));assert moe_layer(np.ones(d),e,r,2).shape==(d,)"
            },
            "paper_ref": "https://arxiv.org/abs/2401.04088",
            "source": "research-frontier"
        },
        {
            "id": "reproducing-results",
            "title": "Reproducing Paper Results",
            "explainer": "## Reproducing ML Papers\n\n### Why Reproduce?\n- Deepest way to understand a method\n- Reveals details papers often omit\n- Builds real implementation skills\n\n### Steps:\n1. Read paper thoroughly (3rd pass)\n2. Find reference implementation (GitHub, Papers with Code)\n3. Start small: implement core algorithm on toy data\n4. Match reference numbers on small benchmarks\n5. Scale up to full experiments\n\n### Common Gotchas:\n- Hyperparameters not fully specified\n- Data preprocessing details missing\n- Random seeds matter more than expected\n- Compute budget differences\n- Trick: Read the appendix carefully — that's where details hide!",
            "visual": "  Reproduction Workflow:\n  Paper → Understand → Toy Implementation → Match Reference → Scale\n  \n  Common Gotchas:\n  ┌─────────────────────────────────────────┐\n  │ 1. Hidden hyperparams (check appendix!) │\n  │ 2. Data preprocessing details           │\n  │ 3. Evaluation methodology differences   │\n  │ 4. Random seed sensitivity              │\n  │ 5. Compute budget gaps                  │\n  └─────────────────────────────────────────┘",
            "questions": [
                {"id": "rf-rr-1", "type": "multiple-choice", "question": "What is the most important first step when reproducing a paper?", "options": ["Download the code and run it", "Implement the full method from scratch immediately", "Understand the method deeply, then implement core algorithm on simple data first", "Contact the authors"], "correct": 2, "explanation": "Starting with a toy implementation on simple data lets you verify your understanding of the algorithm without debugging scale issues. Once the core works, scale up incrementally.", "xp": 10},
                {"id": "rf-rr-2", "type": "multiple-choice", "question": "Where do papers typically hide implementation details?", "options": ["Introduction", "Related work", "Appendix and supplementary material", "Abstract"], "correct": 2, "explanation": "Due to page limits, critical details (hyperparameters, ablations, preprocessing steps) are often in the appendix. Always read appendices when reproducing.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Implement a minimal version of the attention mechanism from 'Attention Is All You Need' and verify it matches expected output.",
                "starter_code": "import numpy as np\ndef transformer_attention(Q, K, V, d_k):\n    \"\"\"Exact implementation from the paper.\"\"\"\n    pass\n# Verify: when Q==K, attention weights should be uniform",
                "solution": "import numpy as np\ndef softmax(x, axis=-1):\n    e = np.exp(x - np.max(x, axis=axis, keepdims=True))\n    return e / e.sum(axis=axis, keepdims=True)\ndef transformer_attention(Q, K, V, d_k):\n    scores = Q @ K.T / np.sqrt(d_k)\n    weights = softmax(scores)\n    return weights @ V, weights\n# Verify uniform when Q==K\nX = np.ones((3, 4))\nout, w = transformer_attention(X, X, X, 4)\nprint('Uniform weights:', np.allclose(w, 1/3))  # True\nprint('Output equals input:', np.allclose(out, X))  # True",
                "tests": "X=np.ones((3,4));_,w=transformer_attention(X,X,X,4);assert np.allclose(w, 1/3)"
            },
            "paper_ref": "https://arxiv.org/abs/1706.03762",
            "source": "research-frontier"
        },
        {
            "id": "open-source-ml",
            "title": "Contributing to Open Source ML",
            "explainer": "## Contributing to Open Source ML\n\n### Where to Start:\n- **Karpathy repos**: micrograd, nanoGPT, minbpe — small, educational, well-documented\n- **Hugging Face**: transformers, datasets, diffusers — massive ecosystem\n- **PyTorch**: Core framework contributions\n- **Papers with Code**: Find implementations, improve benchmarks\n\n### Types of Contributions:\n1. Bug fixes and documentation\n2. Adding new models/features\n3. Performance optimizations\n4. New benchmarks and evaluations\n5. Educational content and tutorials\n\n### Best Practices:\n- Start with issues labeled 'good first issue'\n- Read contribution guidelines\n- Write tests for your code\n- Keep PRs focused and small\n- Engage with maintainer feedback constructively",
            "visual": "  Open Source ML Ecosystem:\n  ┌────────────────────────────────────────────┐\n  │ Educational:  micrograd, nanoGPT, minbpe   │\n  │ Frameworks:   PyTorch, JAX, TensorFlow     │\n  │ Libraries:    HuggingFace, LangChain       │\n  │ Tools:        vLLM, TensorRT, ONNX         │\n  │ Research:     Papers with Code              │\n  └────────────────────────────────────────────┘\n\n  Contribution Flow:\n  Fork → Branch → Code → Test → PR → Review → Merge",
            "questions": [
                {"id": "rf-os-1", "type": "multiple-choice", "question": "What's the best way to start contributing to open source ML?", "options": ["Rewrite the entire codebase", "Start with 'good first issue' labels — small bug fixes, docs, and tests", "Only submit large feature PRs", "Fork and never upstream"], "correct": 1, "explanation": "Good first issues are designed for newcomers. They help you learn the codebase, build trust with maintainers, and understand contribution workflows before tackling larger features.", "xp": 10}
            ],
            "coding_challenge": {
                "prompt": "Write a comprehensive test suite for the softmax function (edge cases, numerical stability, properties).",
                "starter_code": "import numpy as np\ndef softmax(x):\n    e = np.exp(x - np.max(x))\n    return e / e.sum()\n\ndef test_softmax():\n    # Test 1: Output sums to 1\n    # Test 2: All outputs positive\n    # Test 3: Numerical stability with large values\n    # Test 4: Single element\n    # Test 5: Correct ranking preserved\n    pass\ntest_softmax()\nprint('All tests passed!')",
                "solution": "import numpy as np\ndef softmax(x):\n    e = np.exp(x - np.max(x))\n    return e / e.sum()\ndef test_softmax():\n    # Test 1: Sums to 1\n    assert abs(softmax(np.array([1.0, 2.0, 3.0])).sum() - 1.0) < 1e-6\n    # Test 2: All positive\n    assert all(softmax(np.array([-10, 0, 10])) > 0)\n    # Test 3: Numerical stability\n    result = softmax(np.array([1000, 1001, 1002]))\n    assert not np.any(np.isnan(result)) and not np.any(np.isinf(result))\n    # Test 4: Single element\n    assert abs(softmax(np.array([42.0]))[0] - 1.0) < 1e-6\n    # Test 5: Ranking preserved\n    s = softmax(np.array([1.0, 3.0, 2.0]))\n    assert s[1] > s[2] > s[0]\n    # Test 6: Uniform input → uniform output\n    s = softmax(np.array([5.0, 5.0, 5.0]))\n    assert np.allclose(s, 1/3)\ntest_softmax()\nprint('All tests passed!')",
                "tests": "test_softmax()"
            },
            "source": "research-frontier"
        }
    ]
}

# Write the final JSON
with open('/home/ubuntu/brainforge/data/ai-ml.json', 'w') as f:
    json.dump(curriculum, f, indent=2, ensure_ascii=False)

# Print stats
total_topics = sum(len(level["topics"]) for level in curriculum["levels"].values())
total_questions = sum(
    len(q) for level in curriculum["levels"].values()
    for topic in level["topics"]
    for q in [topic.get("questions", [])]
)
total_challenges = sum(
    1 for level in curriculum["levels"].values()
    for topic in level["topics"]
    if topic.get("coding_challenge")
)

print(f"✅ Curriculum generated!")
print(f"   Levels: {len(curriculum['levels'])}")
print(f"   Topics: {total_topics}")
print(f"   Questions: {total_questions}")
print(f"   Coding Challenges: {total_challenges}")